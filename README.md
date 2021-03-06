# ipfs-browser-gateway

Given an IPFS multihash, print the content and try to render web page if the content is HTML.

Notice that currently deployed version in gh-page have problem loading website served with IFPS, it will only load files, videos and images.

Latest refactor is happened in [exxhentai/rehentai-frontend](https://github.com/exxhentai/rehentai-frontend), it will be merged here after being stabilized.

## Development

This is a "create-react-app" app, so in local development just:

`npm i && npm start`

## Deployment

To deploy this gateway by your self, replace all `http://onetwo.ren/ipfs-browser-gateway/` in this repo with your own website.

You can fork it and deploy it via gh-pages: `npm run deploy`, or deploy it use `now`.

## Drawback

1. The first visit to a webpage hosted in IPFS is way slower than traditional HTTP page. Though server side gateway `http://ipfs.io/ipfs` is slow too. (but in next version you can add a peer, thus directly connect to it)
1. Can't promise long-term cache, compared to a gateway running on a server, who can pin a file for a longer time.
1. Don't work with AJAX likes fetch API, see my comment in [ipfs/public-gateway-checker](https://github.com/ipfs/public-gateway-checker/pull/62).
1. May break service worker inside page delivered by ipfs (untested).

## Road Map

- Refactor
- Cache

## Reference

- [Discussion](https://github.com/ipfs/ipfs-service-worker/issues/11)
- [Further Discussion](https://github.com/ipfs-shipyard/service-worker-gateway/pull/1)
- [JS-IPFS-Gateway](https://github.com/ipfs/js-ipfs/tree/master/src/http/gateway)
- [readable-stream in SW](https://developers.google.com/web/updates/2016/06/sw-readablestreams)
