import Cids from 'cids';
import Multihashes from 'multihashes';
import promisify from 'promisify-es6';
import async from 'async';

import { splitPath } from './pathUtil';
import renderFolder from './renderFolder';

const INDEX_HTML_FILES = ['index.html', 'index.htm', 'index.shtml'];
function getIndexHtml(links) {
  return links.filter(link => INDEX_HTML_FILES.indexOf(link.name) !== -1);
}

export const resolveDirectory = promisify((ipfs, path, multihash, callback) => {
  // TODO: seems useless, since we have check it in cid = new Cids(Multihashes.fromB58String(result));
  Multihashes.validate(Multihashes.fromB58String(multihash));

  ipfs.object.get(multihash, { enc: 'base58' }, (err, dagNode) => {
    if (err) {
      return callback(err);
    }
    // if it is a web site, return index.html
    const indexFiles = getIndexHtml(dagNode.Links);
    if (indexFiles.length > 0) {
      // TODO: add *.css and *.ico to cache, since they are already in "indexFiles"
      return callback(null, indexFiles);
    }
    return callback(null, renderFolder(path, dagNode.Links));
  });
});

export const resolveMultihash = promisify((ipfs, path, callback) => {
  const parts = splitPath(path);
  const firstMultihash = parts.shift();
  let currentCid;

  return async.reduce(
    parts,
    firstMultihash,
    // check if next part of hash is inside previous part of hash
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

        const { Links: links } = dagNode;

        for (const link of links) {
          if (link.Name === nextFileName) {
            // found multihash of requested named-file
            multihashOfNextFile = Multihashes.toB58String(link.Hash.multihash);
            break;
          }
        }

        if (!multihashOfNextFile) {
          return next(new Error(`no link named "${nextFileName}" under ${memo}`));
        }

        next(null, multihashOfNextFile);
      });
    },
    // check if last part of hash is a directory
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

      ipfs.files.stat(`/ipfs/${path}`, (fileStatErr, stats) => {
        if (fileStatErr) {
          return callback(fileStatErr);
        }
        if (stats.type.includes('directory')) {
          const isDirErr = new Error('This dag node is a directory');
          isDirErr.cid = cid;
          isDirErr.fileName = stats.name || stats.hash;
          isDirErr.dagDirType = stats.type;

          return callback(isDirErr);
        }

        callback(err, {
          multihash: result,
        });
      });
    },
  );
});
