const {
  override,
  addWebpackModuleRule,
  getBabelLoader
} = require("customize-cra");

const setGlobalObject = value => config => {
  // mutate config as you want
  config.output.globalObject = value;
  config.optimization.noEmitOnErrors = false;

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
      test: /\.worker.js$/,
      use: [
        { loader: 'worker-loader' },
      ]
    })
  )(config, env);
}
