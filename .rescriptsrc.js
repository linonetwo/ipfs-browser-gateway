const { appendWebpackPlugin } = require('@rescripts/utilities');
const ServiceWorkerWebpackPlugin = require('serviceworker-webpack-plugin');
const path = require('path');

const logConfig = config => {
  console.log(config);
  return config;
};

function rescriptSWPlugin(serviceWorkerEntryPath) {
  // const withoutIgnorePlugin = removeWebpackPlugin('SWPrecacheWebpackPlugin', config)
  return config => {
    const nextConfig = appendWebpackPlugin(
      new ServiceWorkerWebpackPlugin({
        entry: path.join(__dirname, serviceWorkerEntryPath),
      }),
      config,
    );
    return nextConfig;
  };
}

module.exports = [
  ['use-babel-config', '.babelrc'],
  ['use-eslint-config', '.eslintrc'],
  'rescript-disable-eslint',
  [rescriptSWPlugin, 'src/IPFSServiceWorkerGateway/index.js'],
];
