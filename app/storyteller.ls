module.exports = (->

  Storyteller = (opt) ->

    @progress-render = opt.progress-render

    # Create stage
    @stage = document.query-selector opt.element
    @stage.style.position = \relative

    # Create scene block
    @scene = document.create-element \div
    @scene.id = \scene
    @scene.style.position = \absolute
    @scene.style.text-align = \center
    @scene.style.width = \100%
    @stage.append-child @scene
    @scene-img = document.create-element \img
    @scene.append-child @scene-img

    # Create subtitle block
    @subtitle = document.create-element \div
    @subtitle.id = \subtitle
    @stage.append-child @subtitle
    @subtitle.style.position = \absolute
    @subtitle.style.text-align = \center
    @subtitle.style.color = \#FFF
    @subtitle.style.font-family = \Helvetica
    @subtitle.style.width = \100%
    @subtitle.style.display = \flex
    @subtitle.style.align-items = \center
    @subtitle.style.justify-content = \center

    @actions = []
    @action-i = 0
    @speech-record = 0

    # Parse story
    md-doc = opt.markdown.split \\n
    @title = if md-doc.0 is /^#\s*(.*)/ then that.1 else 'No title'
    [scene, i] = [null, 0]
    for line in md-doc
      continue if /^#.*/ is line
      continue if /^\s*$/ is line or /<!--.*-->/ is line
      if /^\!\[.*\]\((.*)\)/ is line then scene = that.1
      else @actions.push text: line, scene: scene, id: ++i
    @action-len = @actions.length
    @cover = @actions.0.scene

    # Init storyteller
    if /(.+)\?(\d+)$/ is location.href
      @base-url = that.1
      @action-i = -1 + parseInt that.2
      @status = \paused
      change-scene.call @, @actions[@action-i]
    else
      @base-url = location.href
      @action-i = 0
      @status = \start
      show-cover.call @

    resize = !->
      w = window.inner-width
      h = window.inner-height
      if w > h # landscape
        @scene.style.height = \80%
        @scene.style.top = 0
        @subtitle.style.height = \20%
        @subtitle.style.bottom = 0
        @subtitle.style.font-size = \2.5vw
      else     # portrait
        @scene.style.height = \70%
        @scene.style.top = 0
        @subtitle.style.height = \30%
        @subtitle.style.bottom = 0
        @subtitle.style.font-size = \4vh

      if @scene-img.width > @scene-img.height
        @scene-img.style.width = \100%
      else
        @scene-img.style.height = \100%
    resize.call @
    self = @
    window.add-event-listener \resize, !->
      resize.call self

  !function play
    @status = \playing
    if window.speech-synthesis.paused
      window.speech-synthesis.resume!
      # Workaround:
      # The utterance event listener crash when paused at the end of the speech,
      # so the trigger will not happen to continue.
      last-speech-record = @speech-record
      set-timeout !->
        @next! if last-speech-record is @speech-record
      , 1000
    else action.call @

  !function pause
    @status = \paused
    window.speech-synthesis.pause!

  !function prev
    self = @
    switch self.action-i
    | 0         => return set-to-start.call self
    | -1        => self.action-i := self.action-len - 1; (self.status := \paused if \start is self.status)
    | otherwise => self.action-i -= 1
    transition.call self

  !function next
    return (set-to-start.call @) if @action-i is @action-len - 1
    if \start is @status
      @status = \paused
    else
      @action-i += 1
    transition.call @

  !function show-cover
    @scene-img.src = @cover
    @subtitle.innerHTML = @title

  !function transition
    window.speech-synthesis.resume!
    window.speech-synthesis.cancel!
    switch @status
    | \playing        => action.call @
    | \start, \paused => change-scene.call @, @actions[@action-i]

  !function set-to-start
    window.speech-synthesis.resume!
    @action-i = -1
    @status = \start
    window.speech-synthesis.cancel!
    show-cover.call @
    rewrite-url @base-url

  !function change-scene
    @subtitle.innerHTML = it.text
    @scene-img.src = it.scene
    @progress-render "#{@actions[@action-i].id} / #{@action-len}"
    rewrite-url @base-url+'?'+@actions[@action-i].id.to-string!

  !function action
    act = @actions[@action-i]
    change-scene.call @, {} <<< act <<< text: null
    speech.call @, act.text

  !function speech text
    self = @
    text = text.replace /&quot;/g, '\"'
    text = text.replace /&apos;/g, '\''
    window.speech-synthesis.cancel!
    window.utterance = new SpeechSynthesisUtterance text
    window.utterance.lang = \en-us
    window.utterance.rate = 1
    window.utterance.onend = ->
      return if \playing isnt self.status or window.speech-synthesis.speaking
      self.action-i += 1
      return (action.call self) if self.action-i < self.action-len
      set-to-start.call self
    window.speech-synthesis.speak window.utterance
    window.onbeforeunload = -> self.pause!

  !function rewrite-url
    history.push-state {}, null, it

  Storyteller.prototype.play  = !-> play.call  @
  Storyteller.prototype.pause = !-> pause.call @
  Storyteller.prototype.next  = !-> next.call  @
  Storyteller.prototype.prev  = !-> prev.call  @

  Storyteller.prototype.get-title  = -> @title
  Storyteller.prototype.get-status = -> @status
  Storyteller.prototype.get-length = -> @action-len

  Storyteller
)!
