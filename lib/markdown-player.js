import Director from './director'

const MarkdownPlayer = class {
  constructor (options) {
    this.options = options
    this.wrapper = document.querySelector(this.options.selector)
    this.script = this.wrapper.innerHTML
    this.show = Director.read(this.script)
    this.actionI = 0
    this.speechRecord = 0
    this._buildPlayer()

    const result = /(.+)\?(\d+)$/.exec(location.href)
    if (result) {
      this.baseUrl = result[1]
      this.actionI = -1 + parseInt(result[2])
      this.status = 'paused'
      this._updateScreen(this.show.actions[this.actionI])
    } else {
      this.baseUrl = location.href
      this.actionI = 0
      this.status = 'start'
      this._showCover()
      this.progressDisplay.innerHTML = `${this.actionI} / ${this.show.length}`
    }
    this.stopButton.onclick = () => this._setToStart()
    this.prevButton.onclick = () => this._prev()
    this.nextButton.onclick = () => this._next()
    this.playButton.onclick = () => {
      switch (this.status) {
        case 'start':
        case 'paused':
          this.playButton.innerHTML = 'Pause'
          return this._play()
        case 'playing':
          this.playButton.innerHTML = 'Play'
          return this._pause()
      }
    }
  }

  _buildPlayer () {
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
    // screen - title
    this.title = document.createElement('div')
    this.title.style.width = '100%'
    this.title.style.position = 'absolute'
    this.title.style.top = '45%'
    this.title.style.color = '#fff'
    this.title.style.textShadow = '0 0 8px #000'
    this.title.style.textAlign = 'center'
    this.title.style.fontSize = '6vh'
    this.screen.appendChild(this.title)
    // screen - subtitle
    this.subtitle = document.createElement('div')
    this.subtitle.style.width = '100%'
    this.subtitle.style.position = 'absolute'
    this.subtitle.style.bottom = '2vh'
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
    // playbar - stop button
    this.stopButton = document.createElement('button')
    this.stopButton.innerHTML = 'Stop'
    this.stopButton.style.backgroundColor = '#aaa'
    this.playbar.appendChild(this.stopButton)
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

  _showCover () {
    if (this.show.cover) {
      this.scene.style.backgroundImage = `url('${this.show.cover}')`
      this.scene.style.opacity = 0.5
    } else {
      this.scene.style.backgroundImage = null
    }
    this.title.innerHTML = this.show.title
    this.title.style.display = 'block'
    this.subtitle.style.display = 'none'
  }

  _hideCover () {
    if (this.show.cover) {
      this.scene.style.opacity = 1
    }
    this.title.style.display = 'none'
    this.subtitle.style.display = 'block'
  }

  _updateScreen (action) {
    this._hideCover()
    this.scene.style.backgroundImage = `url('${action.img.src}')`
    this.subtitle.innerHTML = action.text
    this.progressDisplay.innerHTML = `${action.id} / ${this.show.length}`
    this._rewriteUrl(`${this.baseUrl}?${this.show.actions[this.actionI].id.toString()}`)
  }

  _play () {
    this.status = 'playing'
    if (window.speechSynthesis.paused) {
      window.speechSynthesis.resume()
      /* TODO
       * The utterance event listener crash when paused at the end of the speech,
       * so the trigger will not happen to continue.
       * To workaround, record the actionI
       */
      const lastSpeechRecord = this.speechRecord
      setTimeout(() => {
        if (lastSpeechRecord === this.speechRecord) {
          this._next()
        }
      }, 1000)
    } else {
      this._action()
    }
  }

  _pause () {
    this.status = 'paused'
    window.speechSynthesis.pause()
  }

  _prev () {
    switch (this.actionI) {
      case 0:
        return this._setToStart()
      case -1:
        this.actionI = this.show.length - 1
        if (this.status === 'start') {
          this.status = 'paused'
        }
        break
      default:
        this.actionI -= 1
    }
    this._transition()
  }

  _next () {
    if (this.actionI === this.show.length - 1) {
      return this._setToStart()
    }
    if (this.status === 'start') {
      this.status = 'paused'
    } else {
      this.actionI += 1
    }
    this._transition()
  }

  _transition () {
    window.speechSynthesis.resume()
    window.speechSynthesis.cancel()
    switch (this.status) {
      case 'playing':
        return this._action()
      case 'start':
      case 'paused':
        return this._updateScreen(this.show.actions[this.actionI])
    }
  }

  _setToStart () {
    window.speechSynthesis.resume()
    window.speechSynthesis.cancel()
    this.actionI = 0
    this.status = 'start'
    this._rewriteUrl(this.baseUrl)
    this._showCover()
    this.playButton.innerHTML = 'Play'
    this.progressDisplay.innerHTML = `${this.actionI} / ${this.show.length}`
  }

  _action () {
    const act = this.show.actions[this.actionI]
    this._updateScreen(Object.assign({}, act, {text: null}))
    this._speech(act.text)
  }

  _speech (text) {
    text = text.replace(/&quot;/g, '"').replace(/&apos;/g, '\'')
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
      if (this.actionI < this.show.length) {
        return this._action()
      }
      this._setToStart()
    }
    window.speechSynthesis.speak(window.utterance)
    window.onbeforeunload = () => {
      this._pause()
    }
  }

  _rewriteUrl (url) {
    history.pushState({}, null, url)
  }
}

module.exports = MarkdownPlayer
