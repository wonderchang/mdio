require! <[html-webpack-plugin webpack]>

module.exports =
  entry: <[./app/main.js]>
  output:
    filename: \app.js
    path: __dirname + \dist
  module:
    loaders:
      * test: /\.(jpg|jpeg|png)$/ loader: \file
      * test: /\.ls$/ loader: \livescript
      * test: /\.pug$/ loader: \jade
      * test: /\.styl$/ loader: \style!css!stylus
  dev-server:
    content-base: \dist
    host: \0.0.0.0
    inline: true
    stats: {-chunk-modules, +colors}
  plugins:
    * new webpack.HotModuleReplacementPlugin!
    * new html-webpack-plugin template: \app/index.pug
    * new webpack.Provide-plugin $: \jquery jQuery: \jquery

# vi:et:nowrap
