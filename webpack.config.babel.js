import path from 'path'
import webpack from 'webpack'

module.exports = {
  entry: './lib/markdown-player.js',
  output: {
    path: path.join(__dirname, 'dist'),
    filename: (process.env.WEBPACK_ENV === 'build') ? 'markdown-player.min.js' : 'markdown-player.js',
    library: 'MarkdownPlayer',
    libraryTarget: 'umd',
    umdNamedDefine: true
  },
  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        loader: 'babel-loader',
        exclude: /node_modules/
      }
    ]
  },
  plugins: (process.env.WEBPACK_ENV === 'build') ? [
    new webpack.optimize.UglifyJsPlugin({ minimize: true })
  ] : [],
}
