const https = require('https')
const htmlEntities = require('html-entities')

class MarkdownEngine {
  constructor(url) {
    this.url = url
    this.provider = undefined
    if (/https:\/\/hackmd\.io\//.exec(url)) {
      this.provider = 'hackmd'
    }
    if (/https:\/\/hackpad\.com\//.exec(url)) {
      this.provider = 'hackpad'
    }
    this.token = (this.provider) ? url.split('/').pop() : undefined
  }
}
