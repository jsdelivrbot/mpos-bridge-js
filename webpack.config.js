const path = require('path')

module.exports = {
  context: path.join(__dirname, './src'),
  entry: './index.js',
  devtool: 'source-map',
  target: 'web',
  output: {
    path: path.join(__dirname, './dist'),
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

