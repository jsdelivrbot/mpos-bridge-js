const fs = require('fs')
const { merge, objOf } = require('ramda')
const { join } = require('path')
const { devDependencies } = require('./package.json')

const externals = fs.readdirSync('node_modules')
  .filter(module => module !== '.bin')
  .reduce((modules, module) =>
      merge(modules, objOf(module, `commonjs ${module}`)), {})

module.exports = {
  context: join(__dirname, './src'),
  entry: './index.js',
  devtool: 'source-map',
  target: 'node',
  externals: externals,
  output: {
    path: join(__dirname, './dist'),
    libraryTarget: 'commonjs2',
    filename: 'mpos-bridge.js',
    sourceMapFilename: 'mpos-bridge.js.map',
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        loader: 'babel',
        exclude: /node_modules/,
      },
      {
        test: /\.json$/,
        loader: 'json',
      },
    ],
    preLoaders: [
      {
        test: /\.js$/,
        loader: 'eslint',
        exclude: /node_modules/,
      },
    ],
  },
}

