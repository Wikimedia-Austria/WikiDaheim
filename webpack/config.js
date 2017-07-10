const webpack = require('webpack');
const path = require('path');

const SpritePlugin = require('svg-sprite-loader/plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const autoprefixer = require('autoprefixer');

const paths = {
  source: path.join(__dirname, '../source'),
  javascript: path.join(__dirname, '../source/js'),
  images: path.join(__dirname, '../source/assets/img'),
  icons: path.join(__dirname, '../source/assets/icons'),
  build: path.join(__dirname, '../build'),
};

const outputFiles = require('./output-files').outputFiles;

const NODE_ENV = process.env.NODE_ENV || 'development';
const SERVER_RENDER = process.env.SERVER_RENDER === 'true';
const IS_DEVELOPMENT = NODE_ENV === 'development';
const IS_PRODUCTION = NODE_ENV === 'production';

// ----------
// PLUGINS
// ----------

// Shared plugins
const plugins = [
  // Extracts CSS to a file
  new ExtractTextPlugin(outputFiles.css),
  // Builds SVG sprite
  new SpritePlugin(),
  // Injects env variables to our app
  new webpack.DefinePlugin({
    'process.env': {
      NODE_ENV: JSON.stringify(NODE_ENV),
      SERVER_RENDER: JSON.stringify(SERVER_RENDER) === 'true',
    },
  }),
  // Autoprefixer
  new webpack.LoaderOptionsPlugin({
    options: {
      postcss: [
        autoprefixer({
          browsers: [
            'last 3 version',
            'ie >= 10',
          ],
        }),
      ],
      context: paths.source,
    },
  }),
];

if (IS_PRODUCTION) {
  // Shared production plugins
  plugins.push(
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        comparisons: true,
        conditionals: true,
        dead_code: true,
        // drop_console: true,
        drop_debugger: true,
        evaluate: true,
        if_return: true,
        join_vars: true,
        screw_ie8: true,
        sequences: true,
        unused: true,
        warnings: false,
      },
      output: {
        comments: false,
      },
    })
  );
} else {
  // Shared development plugins
  plugins.push(
    // Enables pretty names instead of index
    new webpack.NamedModulesPlugin()
  );
}

// ----------
// RULES
// ----------

// Shared rules
const rules = [
  // Babel loader without react hot loader
  // react-hot-loader will is added in webpack.config.js for development only
  {
    test: /\.(js|jsx)$/,
    exclude: /node_modules/,
    use: ['babel-loader'],
  },
  {
    test: /\.svg$/,
    use: [
      {
        loader: 'svg-sprite-loader',
      },
      {
        loader: 'svgo-loader',
        options: {
          plugins: [
            { removeTitle: true },
            { removeUselessStrokeAndFill: true },
            {
              removeAttrs: {
                attrs: ['fill', 'stroke.*'],
              },
            },
          ],
        },
      },
    ],
    include: paths.icons,
  },
  {
    test: /\.(png|gif|jpg|svg)$/,
    include: paths.images,
    use: 'url-loader?limit=20480&name=client/assets/[name]-[hash].[ext]',
  },
];

// Almost the same rule is used in both development and production
// only diffence is source map param
// so we are using this method to avoid redundant code
const getSassRule = (params = '') => {
  return {
    test: /\.scss$/,
    loader: ExtractTextPlugin.extract({
      fallback: 'style-loader',
      use: `css-loader${ params }!postcss-loader!sass-loader${ params }`,
    }),
  };
};

if (IS_PRODUCTION) {
  // Shared production rules
  rules.push(
    // SCSS files are compiled and extracted to separate file
    getSassRule()
  );
} else {
  // Shared development rules
  rules.push(
    // SCSS files are compiled and extracted to separate file with source maps
    getSassRule('?sourceMap')
  );
}

// ----------
// RESOLVE
// ----------

const resolve = {
  extensions: ['.webpack-loader.js', '.web-loader.js', '.loader.js', '.js', '.jsx'],
  modules: [
    path.join(__dirname, '../node_modules'),
    paths.javascript,
  ],
};

module.exports = {
  outputFiles,
  paths,
  plugins,
  resolve,
  rules,
  IS_DEVELOPMENT,
  IS_PRODUCTION,
  NODE_ENV,
  SERVER_RENDER,
};
