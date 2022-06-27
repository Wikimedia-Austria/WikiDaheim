const {
  override,
  addWebpackModuleRule,
} = require("customize-cra");

const setGlobalObject = value => config => {
  // mutate config as you want
  config.output.globalObject = value;

  // return config so the next function in the pipeline receives it as argument
  return config
}

module.exports = (config, env) => {
  return override(
    setGlobalObject('(self || this)'),
    addWebpackModuleRule({
      test: /\.html$/,
      use: [
        {loader: 'html-loader', options: { esModule: true }}
      ]
    }),
    addWebpackModuleRule({
      test: /(\.worker|mapbox-gl-csp-worker).js$/,
      use: [
        {
          loader: 'worker-loader',
          options: {
            filename: "[name].[contenthash].worker.js"
          }
        },
      ]
    })
  )(config, env);
}
