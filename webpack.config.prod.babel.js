import path from 'path'

module.exports = {
  entry: './lib/index.js',
  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'markdown-player.js',
    library: 'MarkdownPlayer',
    libraryTarget: 'umd',
    umdNamedDefine: true
  },
  devServer: {
    contentBase: path.join(__dirname, 'public'),
    publicPath: path.join(__dirname, 'dist'),
  }
}
