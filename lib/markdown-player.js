const marked = require('marked')

const MarkdownPlayer = class {
  constructor(options) {
    const wrapper = document.querySelector(options.selector)
    wrapper.style.position = 'relative'
    const container = document.createElement('div')
    wrapper.appendChild(container)
    container.style.width = '100%'
    container.style.height = '100%'
    container.style.backgroundColor = '#222'
    container.style.position = 'absolute'
    container.style.left = 0
    container.style.top = 0
    /*
    this.wrapper.innerHTML = ''
    this.options = options
    this.token = marked.lexer(content)
    this._identityImageToken()
    */
  }

  _identityImageToken() {
    const pattern = /.*\!\[(.*)\]\((.*)\)/
    this.token = this.token.map(t => {
      const result = pattern.exec(t.text)
      if (t.type === 'paragraph' && result) {
        t.alt = result[1]
        t.src = result[2]
        t.type = 'image'
      }
      return t
    })
  }

}

module.exports = MarkdownPlayer
