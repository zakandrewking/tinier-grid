const path = require('path')

module.exports = {
  entry: [ 'babel-polyfill', './src/main.js' ],
  output: {
    path: __dirname,
    filename: 'bundle.js'
  },
  devtool: 'source-map',
  resolve: { fallback: path.join(__dirname, "node_modules") },
  resolveLoader: { fallback: path.join(__dirname, "node_modules") },
  module: {
    preLoaders: [
      {
        test: /\/tinier\/lib\/.*\.js$/,
        loader: "source-map-loader"
      }
    ],
    loaders: [
      {
        test: /\.css$/,
        loader: "style-loader!css-loader"
      },
      {
        loader: 'babel',
        test: /\.js$/,
        exclude: /node_modules/
      }
    ]
  }
}
