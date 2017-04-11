import path from 'path'
import webpack from 'webpack'
import htmlWebpackPlugin from 'html-webpack-plugin'

module.exports = {
  entry: './app/main.js',
  resolve: {
    modules: [
      'node_modules',
      'lib'
    ],
  },
  output: {
    path: path.join(__dirname, 'public'),
    filename: 'bundle.js'
  },
  devServer: {
    contentBase: path.join(__dirname, 'public'),
    inline: true
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new htmlWebpackPlugin({
      template: 'app/index.html',
      inject: 'body'
    })
  ]
}
