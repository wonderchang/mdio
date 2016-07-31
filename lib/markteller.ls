'use strict'

Markteller = (->

  # Object constructor
  Markteller = (markdown, opt) ->

    self = @

    @opt = render: \.markteller, lang: \en-us
    @opt = @opt <<< opt if opt
    @opt.progress-render = (->) if undefined is @opt.progress-render

    # Create screen element
    @screen = document.query-selector @opt.render
    @screen.append-child @scene    = document.create-element \div
    @scene.append-child @frame     = document.create-element \img
    @screen.append-child @subtitle = document.create-element \div
    _set-screen-style.call @; _response-screen-size.call @
    window.add-event-listener \resize, !-> _response-screen-size.call self

    # Parse story
    @actions = []
    md-doc = markdown.split \\n
    @title = if md-doc.0 is /^#\s*(.*)/ then that.1 else 'No title'
    [frame, i] = [null, 0]
    for line in md-doc
      continue if /^#.*/ is line
      continue if /^\s*$/ is line or /<!--.*-->/ is line
      if /^\!\[.*\]\((.*)\)/ is line then frame = that.1
      else @actions.push text: line, frame: frame, id: ++i
    @action-len = @actions.length
    @cover = @actions.0.frame

    # Init markteller
    @action-i = 0
    @speech-record = 0
    if /(.+)\?(\d+)$/ is location.href
      @base-url = that.1
      @action-i = -1 + parseInt that.2
      @status = \paused
      _update-screen.call @, @actions[@action-i]
    else
      @base-url = location.href
      @action-i = 0
      @status = \start
      _update-screen.call @, frame: @cover, text: @title

  # Public method
  Markteller.prototype.play  = !-> _play.call  @
  Markteller.prototype.pause = !-> _pause.call @
  Markteller.prototype.prev  = !-> _prev.call  @
  Markteller.prototype.next  = !-> _next.call  @
  Markteller.prototype.get-title  = -> @title
  Markteller.prototype.get-status = -> @status
  Markteller.prototype.get-length = -> @action-len

  # Private method
  !function _set-screen-style
    # Screen
    @screen.style.position = \relative
    @screen.style.background-color = \#222
    # Scene
    @scene.id = \scene
    @scene.style.position = \absolute
    @scene.style.text-align = \center
    @scene.style.width = \100%
    # Subtitle
    @subtitle.id = \subtitle
    @subtitle.style.position = \absolute
    @subtitle.style.text-align = \center
    @subtitle.style.color = \#FFF
    @subtitle.style.font-family = \Helvetica
    @subtitle.style.width = \100%
    @subtitle.style.display = \flex
    @subtitle.style.align-items = \center
    @subtitle.style.justify-content = \center

  !function _response-screen-size
    if window.inner-width > window.inner-height
      # For landscape
      @scene.style.height = \80%
      @scene.style.top = 0
      @subtitle.style.height = \20%
      @subtitle.style.bottom = 0
      @subtitle.style.font-size = \2.5vw
    else
      # For portrait
      @scene.style.height = \70%
      @scene.style.top = 0
      @subtitle.style.height = \30%
      @subtitle.style.bottom = 0
      @subtitle.style.font-size = \4vh
    _response-frame-size.call @

  !function _response-frame-size
    if @frame.width > @frame.height
      @frame.style.width = \100%
      @frame.style.height = \auto
    else
      @frame.style.width = \auto
      @frame.style.height = \100%

  !function _play
    @status = \playing
    if window.speech-synthesis.paused
      window.speech-synthesis.resume!
      /*
      Problem:
        The utterance event listener crash when paused at the end of the speech,
        so the trigger will not happen to continue.
      Workaround:
        Reocrd the action-i
      */
      last-speech-record = @speech-record
      set-timeout !->
        @_next! if last-speech-record is @speech-record
      , 1000
    else _action.call @

  !function _pause
    @status = \paused
    window.speech-synthesis.pause!

  !function _prev
    self = @
    switch self.action-i
    | 0         => return _set-to-start.call self
    | -1        => self.action-i := self.action-len - 1; (self.status := \paused if \start is self.status)
    | otherwise => self.action-i -= 1
    _transition.call self

  !function _next
    return (_set-to-start.call @) if @action-i is @action-len - 1
    if \start is @status
      @status = \paused
    else
      @action-i += 1
    _transition.call @

  !function _update-screen
    @frame.src = it.frame
    @subtitle.innerHTML = it.text
    _response-frame-size.call @
    @opt.progress-render "#{@actions[@action-i].id} / #{@action-len}"
    _rewrite-url @base-url+'?'+@actions[@action-i].id.to-string!

  !function _transition
    window.speech-synthesis.resume!
    window.speech-synthesis.cancel!
    switch @status
    | \playing        => _action.call @
    | \start, \paused => _update-screen.call @, @actions[@action-i]

  !function _set-to-start
    window.speech-synthesis.resume!
    @action-i = -1
    @status = \start
    window.speech-synthesis.cancel!
    _update-screen.call @
    _rewrite-url @base-url

  !function _action
    act = @actions[@action-i]
    _update-screen.call @, {} <<< act <<< text: null
    _speech.call @, act.text

  !function _speech text
    self = @
    text = text.replace /&quot;/g, '\"'
    text = text.replace /&apos;/g, '\''
    window.speech-synthesis.cancel!
    window.utterance = new SpeechSynthesisUtterance text
    window.utterance.lang = \en-us
    window.utterance.rate = 1
    window.utterance.onstart = ->
      self.subtitle.innerHTML = text
    window.utterance.onboundary = ->
      self.speech-record += 1
    window.utterance.onend = ->
      return if \playing isnt self.status or window.speech-synthesis.speaking
      self.action-i += 1
      return (_action.call self) if self.action-i < self.action-len
      _set-to-start.call self
    window.speech-synthesis.speak window.utterance
    window.onbeforeunload = -> self.pause!

  !function _rewrite-url
    history.push-state {}, null, it

  if undefined isnt typeof exports
    if undefined isnt typeof module and module.exports
      exports = module.exports = Markteller
    exports.Markteller = Markteller
  else
    @Markteller = Markteller

  Markteller

).call @
