# ipfs-browser-gateway

Given an IPFS multihash, print the content and try to render web page if the content is HTML.

## Development

This is a "create-react-app" app, so just:

`yarn && yarn start`

## Drawback

1. The first visit to a webpage hosted in IPFS is way slower than traditional HTTP page. Though server side gateway ```http://ipfs.io/ipfs``` is slow too.
1. Can't promise long-term cache, compared to a gateway running on a server, who can pin a file for a longer time.
1. Don't work with AJAX likes fetch API.
1. May break service worker inside page delivered by ipfs (untested).

## Road Map

- Refactor
- Cache

## Reference

- [Discussion](https://github.com/ipfs/ipfs-service-worker/issues/11)
- [Further Discussion](https://github.com/ipfs-shipyard/service-worker-gateway/pull/1)
- [JS-IPFS-Gateway](https://github.com/ipfs/js-ipfs/tree/master/src/http/gateway)
- [readable-stream in SW](https://developers.google.com/web/updates/2016/06/sw-readablestreams)
