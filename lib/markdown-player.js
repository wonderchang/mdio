import Director from './director'
import assign from 'lodash/assign'

import 'animate.css'
import 'semantic-ui-css/components/icon.css'

const DEFAULT_SELECTOR = '#markdown-player'

const MarkdownPlayer = class {
  constructor (options) {
    const defaultOptions = {
      selector: DEFAULT_SELECTOR,
      utteranceLang: 'en-US',
      utteranceRate: 1,
      utterancePitch: 1,
      utteranceVolume: 1
    }
    this.options = assign({}, defaultOptions, options)
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
      this.progressNumber.innerHTML = `${this.actionI} / ${this.show.length}`
    }
    this.prevButton.onclick = () => this._prev()
    this.nextButton.onclick = () => this._next()
    this.playButton.onclick = () => {
      switch (this.status) {
        case 'start':
        case 'paused':
          this.playButtonIcon.setAttribute('class', 'pause icon')
          return this._play()
        case 'playing':
          this.playButtonIcon.setAttribute('class', 'play icon')
          return this._pause()
      }
    }
    window.onkeydown = (evt) => {
      switch (evt.key) {
        case 'ArrowRight':
        case 'l':
          this._next()
          break
        case 'ArrowLeft':
        case 'h':
          this._prev()
          break
        case ' ':
          this.playButton.onclick()
          break
      }
    }
  }

  _buildPlayer () {
    // wrapper
    this.wrapper.style.position = 'relative'
    this.wrapper.style.overflow = 'hidden'
    this.wrapperHeight = this.wrapper.clientHeight
    this.playbarHeight = 44
    this.screenHeight = this.wrapperHeight - this.playbarHeight
    // container
    this.container = document.createElement('div')
    this.container.style.width = '100%'
    this.container.style.height = '100%'
    this.container.style.backgroundColor = '#eee'
    this.container.style.position = 'absolute'
    this.container.style.left = 0
    this.container.style.top = 0
    this.wrapper.appendChild(this.container)
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
    this.playbar.style.backgroundColor = '#333'
    this.playbar.style.position = 'absolute'
    this.playbar.style.textAlign = 'center'
    this.playbar.style.paddingTop = 9
    this.playbar.style.paddingBottom = 7
    this.playbar.style.bottom = 0
    this.playbar.style['animation-duration'] = '0.1s'
    this.playbar.style['animation-delay'] = '0s'
    this.container.appendChild(this.playbar)
    // playbar - play button
    this.playButton = document.createElement('a')
    this.playButton.style.float = 'left'
    this.playButton.style.cursor = 'pointer'
    this.playButton.style.marginLeft = 12
    this.playButtonIcon = document.createElement('i')
    this.playButtonIcon.setAttribute('class', 'play icon')
    this.playButtonIcon.style.fontSize = 24
    this.playButtonIcon.style.color = '#fff'
    this.playButton.appendChild(this.playButtonIcon)
    this.playbar.appendChild(this.playButton)
    // playbar - full screen button
    this.fullScreenButton = document.createElement('a')
    this.fullScreenButton.style.float = 'right'
    this.fullScreenButton.style.cursor = 'pointer'
    this.fullScreenButton.style.marginRight = 12
    this.fullScreenButtonIcon = document.createElement('i')
    this.fullScreenButtonIcon.setAttribute('class', 'maximize icon')
    this.fullScreenButtonIcon.style.fontSize = 24
    this.fullScreenButtonIcon.style.color = '#fff'
    this.fullScreenButton.appendChild(this.fullScreenButtonIcon)
    this.playbar.appendChild(this.fullScreenButton)
    // playbar - prev button
    this.prevButton = document.createElement('a')
    this.prevButton.style.cursor = 'pointer'
    this.prevButton.style.display = 'block-inline'
    this.prevButton.style.marginTop = 9
    this.prevButtonIcon = document.createElement('i')
    this.prevButtonIcon.setAttribute('class', 'step backward icon')
    this.prevButtonIcon.style.fontSize = 24
    this.prevButtonIcon.style.color = '#fff'
    this.prevButton.appendChild(this.prevButtonIcon)
    this.playbar.appendChild(this.prevButton)
    // playbar - progress number
    this.progressNumber = document.createElement('span')
    this.progressNumber.style.color = '#fff'
    this.progressNumber.style.fontSize = 20
    this.playbar.appendChild(this.progressNumber)
    // playbar - next button
    this.nextButton = document.createElement('a')
    this.nextButton.style.cursor = 'pointer'
    this.nextButton.style.marginTop = 9
    this.nextButtonIcon = document.createElement('i')
    this.nextButtonIcon.setAttribute('class', 'step forward icon')
    this.nextButtonIcon.style.fontSize = 24
    this.nextButtonIcon.style.color = '#fff'
    this.nextButton.appendChild(this.nextButtonIcon)
    this.playbar.appendChild(this.nextButton)

    // Event
    /*
    this.screen.onmouseover = (evt) => {
      clearTimeout(this.playbarTimer)
      this.playbar.setAttribute('class', 'animated fadeIn')
      this.playbarTimer = setTimeout(() => {
        this.playbar.setAttribute('class', 'animated fadeOut')
      }, 1000)
    }
    */
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
    this.progressNumber.innerHTML = `${action.id} / ${this.show.length}`
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
    this.progressNumber.innerHTML = `${this.actionI} / ${this.show.length}`
  }

  _action () {
    const act = this.show.actions[this.actionI]
    this._updateScreen(Object.assign({}, act, {text: null}))
    this._speech(act)
  }

  _speech (action) {
    const text = action.text.replace(/&quot;/g, '"').replace(/&apos;/g, '\'')
    window.speechSynthesis.cancel()
    window.utterance = new SpeechSynthesisUtterance(text)
    window.utterance.lang = action.options.utteranceLang || this.options.utteranceLang
    window.utterance.rate = action.options.utteranceRate || this.options.utteranceRate
    window.utterance.pitch = action.options.utterancePitch || this.options.utterancePitch
    window.utterance.volume = action.options.utteranceVolume || this.options.utteranceVolume
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
