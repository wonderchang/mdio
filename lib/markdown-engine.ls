require! <[https]>

Engine = (url) !->

  this.url = url

  this.provider = undefined
  this.provider = \hackmd  if /https:\/\/hackmd\.io\//   is url
  this.provider = \hackpad if /https:\/\/hackpad\.com\// is url
  this.token = if this.provider then url.split \/ .pop! else undefined

  this.markdown-parser =
    hackmd:  !-> return if it is /<div id="doc" class="container markdown-body">((.|\n)*?)<\/div>/ then that.1 else null
    hackpad: !-> return null

Engine.prototype.request-story = (cb) !->
  engine = this
  req = https.get engine.url, (res) !->
    data = ''
    res.on \data, !-> data += it.to-string!
    res.on \end,  !-> cb engine.markdown-parser[engine.provider] data
  req.on \error, !->

module.exports = Engine
