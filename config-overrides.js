const {
  override,
  addBundleVisualizer,
  addWebpackModuleRule,
  getBabelLoader
} = require("customize-cra");

module.exports = (config, env) => {
  const babelLoader = getBabelLoader(config);

  return override(
    addWebpackModuleRule({
      test: /\.html$/,
      use: [
        {loader: 'html-loader', options: { esModule: true }}
      ]
    }),
    addWebpackModuleRule({
      test: /\.worker.js$/,
      use: [
        { loader: 'worker-loader' },
        { loader: babelLoader.loader, options: babelLoader.options }
      ]
    })
  )(config, env);
}
