require! <[fs gulp gulp-mocha gulp-plumber webpack webpack-dev-server express]>

opt =
  dev-port: 3000 port: 8080 host: \localhost
  mocha: reporter: \spec compiler: \ls:livescript

test-run = <[markdown-engine]>

gulp.task \dev-server <[server]> !->
  config = require \./webpack.config.ls
  config.entry.unshift "webpack-dev-server/client?http://#{opt.host}:#{opt.dev-port}", "webpack/hot/dev-server"
  compiler = webpack config
  server = new webpackDevServer compiler, {
    proxy: {'*': "http://#{opt.host}:#{opt.port}"}, stats: {+colors}, +hot }
  err <-! server.listen opt.dev-port, opt.host
  return console.log err if err

gulp.task \server !->
  require! \express
  express-server = express!
  express-server.listen opt.port
  router = require \./router.ls
  router.init express-server
  router.start!

gulp.task \test test-run, !->
  (run, i) <-! test-run.for-each
  target-files = ["lib/#run", "test/#run/**/*"]
  gulp.watch target-files, [run]

gulp.task \markdown-engine !->
  gulp.src \test/markdown-engine/spec.ls, {-read}
    .pipe gulp-plumber!
    .pipe gulp-mocha opt.mocha

gulp.task \default <[test dev-server]>
