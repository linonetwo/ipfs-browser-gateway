import Cids from 'cids';
import Multihashes from 'multihashes';
import IpfsUnixfs from 'ipfs-unixfs';
import promisify from 'promisify-es6';
import async from 'async';

import { splitPath } from './pathUtil';
import renderFolder from './renderFolder';

const INDEX_HTML_FILES = ['index.html', 'index.htm', 'index.shtml'];
function getIndexHtml(links) {
  return links.filter(link => INDEX_HTML_FILES.indexOf(link.name) !== -1);
}

export const resolveDirectory = promisify((ipfs, path, multihash, callback) => {
  Multihashes.validate(Multihashes.fromB58String(multihash));

  ipfs.object.get(multihash, { enc: 'base58' }, (err, dagNode) => {
    if (err) {
      return callback(err);
    }

    // if it is a web site, return index.html
    const indexFiles = getIndexHtml(dagNode.links);
    if (indexFiles.length > 0) {
      // TODO: add *.css and *.ico to cache, since they are already in "indexFiles"
      return callback(null, indexFiles);
    }

    return callback(null, renderFolder(path, dagNode.links));
  });
});

export const resolveMultihash = promisify((ipfs, path, callback) => {
  const parts = splitPath(path);
  const firstMultihash = parts.shift();
  let currentCid;

  return async.reduce(
    parts,
    firstMultihash,
    (memo, item, next) => {
      try {
        currentCid = new Cids(Multihashes.fromB58String(memo));
      } catch (err) {
        return next(err);
      }

      ipfs.dag.get(currentCid, (err, result) => {
        if (err) {
          return next(err);
        }

        const dagNode = result.value;
        // find multihash of requested named-file in current dagNode's links
        let multihashOfNextFile;
        const nextFileName = item;

        const { links } = dagNode;

        for (const link of links) {
          if (link.name === nextFileName) {
            // found multihash of requested named-file
            multihashOfNextFile = Multihashes.toB58String(link.multihash);
            break;
          }
        }

        if (!multihashOfNextFile) {
          return next(new Error(`no link named "${nextFileName}" under ${memo}`));
        }

        next(null, multihashOfNextFile);
      });
    },
    (err, result) => {
      if (err) {
        return callback(err);
      }

      let cid;
      try {
        cid = new Cids(Multihashes.fromB58String(result));
      } catch (error) {
        return callback(error);
      }

      ipfs.dag.get(cid, (error, dagResult) => {
        if (error) return callback(err);

        const dagDataObj = IpfsUnixfs.unmarshal(dagResult.value.data);
        if (dagDataObj.type === 'directory') {
          const isDirErr = new Error('This dag node is a directory');
          // add memo (last multihash) as a fileName so it can be used by resolveDirectory
          isDirErr.fileName = result;
          return callback(isDirErr);
        }

        callback(null, { multihash: result });
      });
    },
  );
});
