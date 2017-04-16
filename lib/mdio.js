import Director from './director'
import Player from './player'
import assign from 'lodash/assign'

import 'animate.css'
import 'semantic-ui-css/components/icon.css'

const Mdio = class {
  constructor (options) {
    const defaultOptions = {
      selector: '#markdown-player',
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
    this.player = new Player(this.options.selector)

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
      this.player.showCover(this.show.title, this.show.cover)
      this.player.setProgressNumber(`${this.actionI} / ${this.show.length}`)
    }
    this.player.prevButton.onclick = () => this._prev()
    this.player.nextButton.onclick = () => this._next()
    this.player.playButton.onclick = () => {
      switch (this.status) {
        case 'start':
        case 'paused':
          return this._play()
        case 'playing':
          return this._pause()
        case 'end':
          this.actionI = 0
          return this._play()
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
          this.player.playButton.onclick()
          break
      }
    }
  }

  _updateScreen (action) {
    this.player.hideCover()
    this.player.setSceneImage(action.img.src)
    this.player.setSubtitle(action.text)
    this.player.setProgressNumber(`${action.id} / ${this.show.length}`)
    this._rewriteUrl(`${this.baseUrl}?${this.show.actions[this.actionI].id.toString()}`)
  }

  _play () {
    this.status = 'playing'
    this.player.showPauseButton()
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
    this.player.showPlayButton()
    window.speechSynthesis.pause()
  }

  _prev () {
    if (this.status === 'start') {
      return
    }
    if (!this.actionI) {
      return this._setToStart()
    }
    if (this.status === 'end') {
      this.status = 'paused'
      this.player.showPlayButton()
    } else {
      this.actionI -= 1
    }
    this._transition()
  }

  _next () {
    if (this.status === 'end') {
      return
    }
    if (this.actionI === this.show.length - 1) {
      return this._setToEnd()
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
    this.player.showCover(this.show.title, this.show.cover)
    this.player.showPlayButton()
    this.player.setProgressNumber(`${this.actionI} / ${this.show.length}`)
  }

  _setToEnd () {
    window.speechSynthesis.cancel()
    this.player.showCover('The End', null)
    this.player.showReplayButton()
    this.status = 'end'
  }

  _action () {
    if (this.actionI < this.show.length) {
      const act = this.show.actions[this.actionI]
      this._updateScreen(Object.assign({}, act, {text: null}))
      this._speech(act)
      return
    }
    this._setToEnd()
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
      this.player.setSubtitle(text)
    }
    window.utterance.onboundary = () => {
      this.speechRecord += 1
    }
    window.utterance.onend = () => {
      if (this.status !== 'playing' || window.speechSynthesis.speaking) {
        return
      }
      this.actionI += 1
      this._action()
      /*
      if (this.actionI < this.show.length) {
        return this._action()
      }
      this._setToStart()
      */
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

module.exports = Mdio
