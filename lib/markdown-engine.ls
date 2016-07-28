require! <[request]>

Engine = (url) !->

  this.url = url

  this.provider = undefined
  this.provider = \hackmd  if /https:\/\/hackmd\.io\//   is url
  this.provider = \hackpad if /https:\/\/hackpad\.com\// is url
  this.token = if this.provider then url.split \/ .pop! else undefined

  this.markdown-parser =

    hackmd: !->

      if it is /<div id="doc" class="container markdown-body">((.|\n)*?)<\/div>/
        return that.1
      else
        return null

    hackpad: !->
      return null

Engine.prototype.request-story = (cb) !->
  engine = this
  (err, res, body) <-! request engine.url
  story = engine.markdown-parser[engine.provider] body
  cb story

module.exports = Engine
