const { injectBabelPlugin } = require('react-app-rewired');
const ServiceWorkerWebpackPlugin = require('serviceworker-webpack-plugin');
const path = require('path');

function removeSWPrecachePlugin(config) {
  const swPrecachePluginIndex = config.plugins.findIndex(
    element => element.constructor.name === 'SWPrecacheWebpackPlugin',
  );
  // Remove the swPrecachePlugin if it was found
  if (swPrecachePluginIndex !== -1) {
    config.plugins.splice(swPrecachePluginIndex, 1); // mutates
  }
}
function rewireServiceWorkerPlugin(config, serviceWorkerEntryPath) {
  removeSWPrecachePlugin(config);
  config.plugins.push(
    new ServiceWorkerWebpackPlugin({
      entry: path.join(__dirname, serviceWorkerEntryPath),
    }),
  );
}

module.exports = function override(config, env) {
  config = injectBabelPlugin(
    [
      'flow-runtime',
      {
        assert: true,
        annotate: true,
      },
    ],
    config,
  );

  if (env === 'production') {
    console.log('⚡ Production build with optimization ⚡');
    config = injectBabelPlugin('closure-elimination', config);
    config = injectBabelPlugin('transform-react-inline-elements', config);
    config = injectBabelPlugin('transform-react-constant-elements', config);
  }

  // remove eslint in eslint, we only need it on VSCode
  config.module.rules.splice(1, 1);
  // rewire service-worker-webpack
  rewireServiceWorkerPlugin(config, 'src/IPFSServiceWorkerGateway/index.js');

  return config;
};
