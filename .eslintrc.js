const NODE_ENV = process.env.NODE_ENV;

module.exports = {
  extends: ["react-app"],
  // ISSUE: https://github.com/facebook/create-react-app/issues/12070 --> will be fixed with next cra version
  parserOptions: {
    babelOptions: { presets: [["babel-preset-react-app", false]] },
  },
};
