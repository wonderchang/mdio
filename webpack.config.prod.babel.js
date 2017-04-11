import path from 'path'

module.exports = {
  entry: './lib/markdown-player.js',
  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'markdown-player.js',
    library: 'MarkdownPlayer',
    libraryTarget: 'umd',
    umdNamedDefine: true
  },
}
