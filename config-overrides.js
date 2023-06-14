const { override, addWebpackModuleRule } = require("customize-cra");

const setGlobalObject = (value) => (config) => {
  // mutate config as you want
  config.output.globalObject = value;

  // return config so the next function in the pipeline receives it as argument
  return config;
};

const overrideStats = (value) => (config) => {
  config.stats = value;
  return config;
};

module.exports = (config, env) => {
  return override(
    setGlobalObject("(self || this)"),
    /*overrideStats({
      children: true
    }),*/ // enable if you weant to see more detailed stats for debug
    addWebpackModuleRule({
      test: /\.html$/,
      use: [{ loader: "html-loader", options: { esModule: true } }],
    }),
    addWebpackModuleRule({
      test: /(\.worker|mapbox-gl-csp-worker).js$/,
      use: [
        {
          loader: "worker-loader",
          options: {
            filename: "[name].[contenthash].worker.js",
          },
        },
      ],
    })
  )(config, env);
};
