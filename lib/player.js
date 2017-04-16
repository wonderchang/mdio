const Player = class {
  constructor (selector) {
    // Wrapper
    this.wrapper = document.querySelector(selector)
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
    this.scene.style.height = '100%'
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

    // controller
    this.controller = document.createElement('div')
    this.controller.style.width = '100%'
    this.controller.style.backgroundColor = '#333'
    this.controller.style.position = 'absolute'
    this.controller.style.textAlign = 'center'
    this.controller.style.paddingTop = 9
    this.controller.style.paddingBottom = 7
    this.controller.style.bottom = 0
    this.controller.style['animation-duration'] = '0.1s'
    this.controller.style['animation-delay'] = '0s'
    this.container.appendChild(this.controller)

    // controller - play button
    this.playButton = document.createElement('a')
    this.playButton.style.float = 'left'
    this.playButton.style.cursor = 'pointer'
    this.playButton.style.marginLeft = 12
    this.playButtonIcon = document.createElement('i')
    this.playButtonIcon.setAttribute('class', 'play icon')
    this.playButtonIcon.style.fontSize = 24
    this.playButtonIcon.style.color = '#fff'
    this.playButton.appendChild(this.playButtonIcon)
    this.controller.appendChild(this.playButton)

    // playbar - full screen button
    this.isFullScreen = false
    this.fullScreenButton = document.createElement('a')
    this.fullScreenButton.style.float = 'right'
    this.fullScreenButton.style.cursor = 'pointer'
    this.fullScreenButton.style.marginRight = 12
    this.fullScreenButtonIcon = document.createElement('i')
    this.fullScreenButtonIcon.setAttribute('class', 'expand icon')
    this.fullScreenButtonIcon.style.fontSize = 24
    this.fullScreenButtonIcon.style.color = '#fff'
    this.fullScreenButton.appendChild(this.fullScreenButtonIcon)
    this.controller.appendChild(this.fullScreenButton)
    this.fullScreenButton.onclick = () => {
      if (!this.isFullScreen) {
        this.wrapperWidth = this.wrapper.clientWidth
        this.wrapperHeight = this.wrapper.clientHeight
        this.wrapper.style.width = '100%'
        this.wrapper.style.height = '100%'
        this.wrapper.style.position = 'absolute'
        this.wrapper.style.top = 0
        this.wrapper.style.left = 0
        this.screen.style.height = window.innerHeight - 44
        this.fullScreenButtonIcon.setAttribute('class', 'compress icon')
        this.isFullScreen = true
      } else {
        this.wrapper.setAttribute('style', 'position: relative; overflow: hidden')
        this.screen.style.height = this.screenHeight
        this.fullScreenButtonIcon.setAttribute('class', 'expand icon')
        this.isFullScreen = false
      }
    }

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
    this.controller.appendChild(this.prevButton)

    // playbar - progress number
    this.progressNumber = document.createElement('span')
    this.progressNumber.style.color = '#fff'
    this.progressNumber.style.fontSize = 20
    this.controller.appendChild(this.progressNumber)

    // playbar - next button
    this.nextButton = document.createElement('a')
    this.nextButton.style.cursor = 'pointer'
    this.nextButton.style.marginTop = 9
    this.nextButtonIcon = document.createElement('i')
    this.nextButtonIcon.setAttribute('class', 'step forward icon')
    this.nextButtonIcon.style.fontSize = 24
    this.nextButtonIcon.style.color = '#fff'
    this.nextButton.appendChild(this.nextButtonIcon)
    this.controller.appendChild(this.nextButton)

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

  setProgressNumber (text) {
    this.progressNumber.innerHTML = text
  }

  setSceneImage (imageUrl) {
    if (!imageUrl) {
      this.scene.style.backgroundImage = 'url("")'
      return
    }
    this.scene.style.backgroundImage = `url('${imageUrl}')`
  }

  setSubtitle (text) {
    this.subtitle.innerHTML = text
  }

  showPlayButton () {
    this.playButtonIcon.setAttribute('class', 'play icon')
  }

  showPauseButton () {
    this.playButtonIcon.setAttribute('class', 'pause icon')
  }

  showReplayButton () {
    this.playButtonIcon.setAttribute('class', 'undo icon')
  }

  showCover (title, imageUrl) {
    this.setSceneImage(imageUrl)
    this.title.innerHTML = title
    this.title.style.display = 'block'
    this.subtitle.style.display = 'none'
  }

  hideCover () {
    this.title.style.display = 'none'
    this.subtitle.style.display = 'block'
  }
}

module.exports = Player
