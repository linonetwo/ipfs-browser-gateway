/* eslint-disable no-unused-vars */
export function splitPath(path) {
  if (path[path.length - 1] === '/') {
    path = path.substring(0, path.length - 1);
  }

  return path.split('/');
}

export function removeLeadingSlash(url) {
  if (url[0] === '/') {
    url = url.substring(1);
  }

  return url;
}

export function removeTrailingSlash(url) {
  if (url.endsWith('/')) {
    url = url.substring(0, url.length - 1);
  }

  return url;
}

export function removeSlashFromBothEnds(url) {
  url = removeLeadingSlash(url);
  url = removeTrailingSlash(url);

  return url;
}

export function joinURLParts(...urls) {
  urls = urls.filter(url => url.length > 0);
  urls = [].concat(urls.map(url => removeSlashFromBothEnds(url)));

  return urls.join('/');
}
