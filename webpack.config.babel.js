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
        test: /\.css$/,
        loaders: [
          'style-loader',
          'css-loader'
        ]
      },
      {
        test: /\.jsx?$/,
        loader: 'babel-loader',
        exclude: /node_modules/
      },
      {
        test: /\.(ttf|otf|eot|svg|woff)(\?v=[0-9]\.[0-9]\.[0-9])?|(jpg|gif)$/,
        loader: 'file-loader'
      }
    ]
  },
  plugins: (process.env.WEBPACK_ENV === 'build') ? [
    new webpack.optimize.UglifyJsPlugin({ minimize: true })
  ] : [],
}
