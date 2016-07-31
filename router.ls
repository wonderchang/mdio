require! <[fs
  ./lib/markdown-engine]>

module.exports =

  init: (server) !->
    @app = server

  start: !->
    @app.get \/get-story (req, res) ->
      engine = new markdown-engine req.query.url
      md <-! engine.request-markdown
      res.send do
        url: engine.url
        provider: engine.provider
        token: engine.token
        markdown: md
