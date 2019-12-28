var path = require('path')
var webpack = require('webpack')
var utils = require('./utils')
var config = require('../config')
var VueLoaderPlugin = require('vue-loader/lib/plugin')
var vueLoaderConfig = require('./vue-loader.conf')
var StylelintPlugin = require('stylelint-webpack-plugin')
const cliProgress = require('cli-progress');
const bar1 = new cliProgress.SingleBar({}, cliProgress.Presets.shades_classic);
bar1.start(100, 0);

function resolve (dir) {
  return path.join(__dirname, '..', dir)
}
const handler = (percentage, message, ...args) => {
  // e.g. Output each progress message directly to the console:
  bar1.update(percentage * 100);
  if (percentage * 100 >= 100) {
    bar1.stop();
  }

};

module.exports = {
  entry: {
    app: './src/'
  },
  node: {
    // For mermaid
    fs: 'empty' // jison generated code requires 'fs'
  },
  output: {
    path: config.build.assetsRoot,
    filename: '[name].js',
    publicPath: process.env.NODE_ENV === 'production'
      ? config.build.assetsPublicPath
      : config.dev.assetsPublicPath
  },
  resolve: {
    extensions: ['.js', '.vue', '.json'],
    alias: {
      '@': resolve('src')
    }
  },
  module: {
    rules: [
      {
        test: /\.(js|vue)$/,
        loader: 'eslint-loader',
        enforce: 'pre',
        include: [resolve('src'), resolve('test')],
        options: {
          formatter: require('eslint-friendly-formatter')
        }
      },
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        options: vueLoaderConfig
      },
      // We can't pass graphlibrary to babel
      {
        test: /\.js$/,
        loader: 'string-replace-loader',
        include: [
          resolve('node_modules/graphlibrary')
        ],
        options: {
          search: '^\\s*(?:let|const) ',
          replace: 'var ',
          flags: 'gm'
        }
      },
      {
        test: /\.js$/,
        loader: 'babel-loader',
        include: [
          resolve('src'),
          resolve('test'),
          resolve('node_modules/mermaid')
        ],

        options: {
          cacheDirectory: true
        },
        exclude: [
          resolve('node_modules/mermaid/src/diagrams/class/parser'),
          resolve('node_modules/mermaid/src/diagrams/flowchart/parser'),
          resolve('node_modules/mermaid/src/diagrams/gantt/parser'),
          resolve('node_modules/mermaid/src/diagrams/git/parser'),
          resolve('node_modules/mermaid/src/diagrams/sequence/parser')
        ],
      },
      {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: utils.assetsPath('img/[name].[hash:7].[ext]')
        }
      },
      {
        test: /\.(ttf|eot|otf|woff2?)(\?.*)?$/,
        loader: 'file-loader',
        options: {
          name: utils.assetsPath('fonts/[name].[hash:7].[ext]')
        }
      },
      {
        test: /\.(md|yml|html)$/,
        loader: 'raw-loader'
      }
    ]
  },
  plugins: [
    new VueLoaderPlugin(),
    new StylelintPlugin({
      files: ['**/*.vue', '**/*.scss']
    }),
    new webpack.DefinePlugin({
      VERSION: JSON.stringify(require('../package.json').version)
    }),
    new webpack.ProgressPlugin(handler)
  ]
}
