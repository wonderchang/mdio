'use strict'

import gulp from 'gulp'
import webpack from 'webpack'
import webpackDevServer from 'webpack-dev-server'

import config from 'webpack.config.js'

gulp.task('dev-server', () => {
  const compiler = webpack(config)
  const server = new WebpackDevServer(compiler, serverOptions)
  server.listen(options.devPort, options.host, (error) => {
    if (error) {
      return console.error(error)
    }
  })
})

gulp.task('build', () => {
})
