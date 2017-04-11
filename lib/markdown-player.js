const marked = require('marked')

const MarkdownPlayer = class {
  constructor(options) {
    this.options = options
    this.wrapper = document.querySelector(this.options.selector)
    this.content = this.wrapper.innerHTML.split('\n').map(l => l.trim()).join('\n\n').trim()
    this._buildPlayer()
    this._tokenizeContent()
    console.log(this.token)
    this.actionLen = this.actions.length
    this.cover = this.actions[0].frame
    this.actionI = 0
    this.speechRecord = 0

    const result = /(.+)\?(\d+)$/.exec(location.href)
    if (result) {
      this.baseUrl = result[1]
      this.actionI = -1 + parseInt(result[2])
      this.status = 'paused'
      this._updateScreen(this.actions[this.actionI])
    }
    else {
      this.baseUrl = location.href
      this.actionI = 0
      this.status = 'start'
      this._updateScreen({
        frame: this.cover,
        text: this.title
      })
    }
    this.prevButton.onclick = () => {
      this._prev()
    }
    this.playButton.onclick = () => {
      this._play()
    }
    this.nextButton.onclick = () => {
      this._next()
    }
  }

  _buildPlayer() {
    // wrapper
    this.wrapper.style.position = 'relative'
    this.wrapper.style.overflow = 'hidden'
    this.wrapperHeight = this.wrapper.clientHeight
    this.headerHeight = 50
    this.playbarHeight = 23
    this.screenHeight = this.wrapperHeight - this.playbarHeight - this.headerHeight
    // container
    this.container = document.createElement('div')
    this.container.style.width = '100%'
    this.container.style.height = '100%'
    this.container.style.backgroundColor = '#eee'
    this.container.style.position = 'absolute'
    this.container.style.left = 0
    this.container.style.top = 0
    this.wrapper.appendChild(this.container)
    // header
    this.header = document.createElement('div')
    this.header.style.width = '100%'
    this.header.style.height = this.headerHeight
    this.header.style.backgroundColor = '#000'
    this.container.appendChild(this.header)
    // screen
    this.screen = document.createElement('div')
    this.screen.style.width = '100%'
    this.screen.style.height = this.screenHeight
    this.screen.style.position = 'relative'
    this.container.appendChild(this.screen)
    // screen - scene
    this.scene = document.createElement('div')
    this.scene.style.width = '100%'
    this.scene.style.height = this.screenHeight
    this.scene.style.backgroundColor = '#222'
    this.scene.style.backgroundRepeat = 'no-repeat'
    this.scene.style.backgroundSize = 'contain'
    this.scene.style.backgroundPosition = '50% 50%'
    this.screen.appendChild(this.scene)
    // screen - subtitle
    this.subtitle = document.createElement('div')
    this.subtitle.style.width = '100%'
    this.subtitle.style.position = 'absolute'
    this.subtitle.style.bottom = 0
    this.subtitle.style.backgroundColor = 'transparent'
    this.subtitle.style.textAlign = 'center'
    this.subtitle.style.color = '#fff'
    this.subtitle.style.fontWeight = 'bold'
    this.subtitle.style.textShadow = '0 0 8px #000'
    this.subtitle.style.fontSize = '3vh'
    this.screen.appendChild(this.subtitle)
    // playbar
    this.playbar = document.createElement('div')
    this.playbar.style.width = '100%'
    this.playbar.style.height = this.playbarHeight
    this.playbar.style.backgroundColor = '#000'
    this.container.appendChild(this.playbar)
    // playbar - backward screen button
    this.prevButton = document.createElement('button')
    this.prevButton.innerHTML = 'Prev'
    this.prevButton.style.backgroundColor = '#aaa'
    this.playbar.appendChild(this.prevButton)
    // playbar - play button
    this.playButton = document.createElement('button')
    this.playButton.innerHTML = 'Play'
    this.playButton.style.backgroundColor = '#aaa'
    this.playbar.appendChild(this.playButton)
    // playbar - forward screen button
    this.nextButton = document.createElement('button')
    this.nextButton.innerHTML = 'Next'
    this.nextButton.style.backgroundColor = '#aaa'
    this.playbar.appendChild(this.nextButton)
    // playbar - progressDisplay
    this.progressDisplay = document.createElement('span')
    this.progressDisplay.style.backgroundColor = '#aaa'
    this.progressDisplay.style.float = 'right'
    this.playbar.appendChild(this.progressDisplay)
  }

  _tokenizeContent() {
    this.token = marked.lexer(this.content)
    this._tokenizeImageToken()
    this.title = (this.token[0].type === 'heading' && this.token[0].depth === 1) ? this.token.shift().text : null
    this.actions = []
    let frame = null, i = 0
    for (let t of this.token) {
      if (t.type === 'image') {
        frame = t
      }
      else {
        this.actions.push({
          id: ++i,
          frame: frame,
          text: t.text
        })
      }
    }
  }

  _tokenizeImageToken() {
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

  _updateScreen(action) {
    this.scene.style.backgroundImage = `url('${action.frame.src}')`
    this.subtitle.innerHTML = action.text
    this.progressDisplay.innerHTML = `${this.actionI} / ${this.actionLen}`
  }

  _play() {
    this.status = 'playing'
    if (window.speechSynthesis.paused) {
      window.speechSynthesis.resume()
      /* TODO
       * The utterance event listener crash when paused at the end of the speech,
       * so the trigger will not happen to continue.
       * To workaround, record the actionI
       */
      lastSpeechRecord = this.speechRecord
      setTimeout(() => {
        if (lastSpeechRecord === this.speechRecord) {
          this._next()
        }
      }, 1000)
    }
    else {
      this._action()
    }
  }

  _pause() {
    this.status = 'paused'
    window.speechSynthesis.pause()
  }

  _prev() {
    switch (this.actionI) {
      case 0:
        return this._setToStart()
      case -1:
        this.actionI = self.actionLen - 1
        if (this.status === 'start') {
          this.status = 'paused'
        }
        break
      default:
        this.actionI -= 1
    }
    this._transition()
  }

  _next() {
    if (this.actionI === this.actionLen - 1) {
      return this._setToStart()
    }
    if (this.status === 'start') {
      this.status = 'paused'
    }
    else {
      this.actionI += 1
    }
    this._transition()
  }

  _transition() {
    window.speechSynthesis.resume()
    window.speechSynthesis.cancel()
    switch (this.status) {
      case 'playing':
        return this._action()
      case 'start':
      case 'paused':
        return this._updateScreen(this.actions[this.actionI])
    }
  }

  _setToStart() {
    window.speechSynthesis.resume()
    this.actionI = -1
    this.status = 'start'
    window.speechSynthesis.cancel()
    this._updateScreen()
    this._rewriteUrl()
  }

  _action() {
    const act = this.actions[this.actionI]
    this._updateScreen(Object.assign({}, act, {text: null}))
    this._speech(act.text)
  }

  _speech(text) {
    text = text.replace(/&quot;/g, '\"').replace(/&apos;/g, '\'')
    window.speechSynthesis.cancel()
    window.utterance = new SpeechSynthesisUtterance(text)
    window.utterance.lang = 'en-us'
    window.utterance.rate = 1
    window.utterance.onstart = () => {
      this.subtitle.innerHTML = text
    }
    window.utterance.onboundary = () => {
      this.speechRecord += 1
    }
    window.utterance.onend = () => {
      if (this.status !== 'playing' || window.speechSynthesis.speaking) {
        return
      }
      this.actionI += 1
      if (this.actionI < this.actionLen) {
        return this._action()
      }
      this._setToStart()
    }
    window.speechSynthesis.speak(window.utterance)
    window.onbeforeunload = () => {
      this._pause()
    }
  }

  _rewriteUrl(url) {
    history.pushState({}, null, url)
  }

}

module.exports = MarkdownPlayer
