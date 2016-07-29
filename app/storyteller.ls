Timer = require \./timer.ls

Storyteller = (element, story) !->

  e = {}
  e.stage = document.query-selector element
  e.stage.style.position = \relative
  e.story = story

  e.scene = document.create-element \div
  e.scene.id = \scene
  e.scene-img = document.create-element \img
  e.scene.append-child e.scene-img
  e.stage.append-child e.scene

  e.subtitle = document.create-element \div
  e.subtitle.id = \subtitle
  e.stage.append-child e.subtitle

  e.screen = document.create-element \svg
  e.screen.id = \screen
  e.play-symbol = document.create-element \g
  e.play-symbol.id = \play-symbol
  e.circle = document.create-element \circle
  e.polygon = document.create-element \polygon
  e.play-symbol.append-child e.circle
  e.play-symbol.append-child e.polygon
  e.screen.append-child e.play-symbol
  e.stage.append-child e.screen

  e.prev-btn = document.create-element \div
  e.prev-btn.id = \prev-btn
  e.next-btn = document.create-element \div
  e.next-btn.id = \next-btn
  e.time = document.create-element \div
  e.time.id = \time
  e.progress = document.create-element \div
  e.progress.id = \progress

  e.stage.append-child e.prev-btn
  e.stage.append-child e.next-btn
  e.stage.append-child e.time
  e.stage.append-child e.progress

  timer = new Timer time.id
  book = story.book.split '\n'

  script = []; i = 0; scene = ''
  title = if book.0 is /^#\s*(.*)/ then that.1 else 'No title'
  title-dom = document.query-selector \title
  title-dom.innerHTML += " - #title"

  for line in book
    continue if /^#.*/ is line
    continue if /^\s*$/ is line or /<!--.*-->/ is line
    if /^\!\[.*\]\((.*)\)/ is line then scene = that.1
    else script.push text: line, scene: scene, id: ++i
  script-len = script.length
  cover = script.0.scene

  if window.inner-width > window.inner-height
    radius = window.inner-height / 4
  else
    radius = window.inner-width / 4

  center =
    x: window.inner-width / 2
    y: window.inner-height / 2

  $ '#play-symbol circle' .attr \r radius
    .attr \cx center.x
    .attr \cy center.y

  $ '#play-symbol polygon'
    .attr \points ((triangle =
      * do
          x: center.x - (radius) / 2
          y: center.y - radius * (Math.sqrt 3) / 2
      * do
          x: center.x - (radius) / 2
          y: center.y + radius * (Math.sqrt 3) / 2
      * do
          x: center.x + radius
          y: center.y
    ).map (-> "#{it.x},#{it.y}")) * ' '

  # Init data
  if /\?.+?\?(\d+)$/ is location.search
    storyboard-i = -1 + parseInt that.1
    sb = script[storyboard-i]
    change-scene sb
    status = \paused
  else
    storyboard-i = -1
    update-progresser!
    status = \start
    show-start-screen!

  speech-record = 0

  # Click event handler
  e.screen.add-event-listener \click, player
  e.prev-btn.add-event-listener \click, prev
  e.next-btn.add-event-listener \click, next

  # Keydown event handler
  window.add-event-listener \keydown, !->
    switch it.key-code
    | 32 => player! # space key
    | 37 => prev!   # left key
    | 39 => next!   # right key

  !function player
    switch status
    | \paused           => play!
    | \playing          => paused!
    | \start, \finished => start!

  !function start
    storyboard-i := 0
    timer.reset!
    play!

  !function play
    status := \playing
    hide-play-screen!
    timer.run!
    if window.speech-synthesis.paused
      window.speech-synthesis.resume!
      # Workaround:
      # The utterance event listener crash when paused at the end of the speech,
      # so the trigger will not happen to continue.
      last-speech-record = speech-record
      set-timeout !->
        next! if last-speech-record is speech-record
      , 1000
    else action!

  !function paused
    status := \paused
    show-play-screen!
    timer.stop!
    window.speech-synthesis.pause!

  !function prev
    switch storyboard-i
    | 0         => return set-to-start!
    | -1        => storyboard-i := script-len - 1; (status := \paused if \start is status)
    | otherwise => storyboard-i := storyboard-i - 1
    transition!

  !function next
    return set-to-start! if script-len - 1 is storyboard-i
    storyboard-i := storyboard-i + 1
    status := \paused if \start is status
    transition!

  !function transition
    window.speech-synthesis.resume!
    sb = script[storyboard-i]
    window.speech-synthesis.cancel!
    switch status
    | \playing        => action!
    | \start, \paused => change-scene sb

  !function set-to-start
    window.speech-synthesis.resume!
    storyboard-i := -1
    status := \start
    window.speech-synthesis.cancel!
    show-start-screen!
    history.push-state {}, null, location.href

  !function show-start-screen
    e.play-symbol.style.display = \block
    e.screen.style.opacity = 0.8
    e.scene-img.src = cover
    e.subtitle.innerHTML = title
    update-progresser!

  !function action
    sb = script[storyboard-i]
    change-scene {} <<< sb <<< text: ''
    speech sb.text

  !function change-scene sb
    e.subtitle.innerHTML = sb.text
    e.scene-img.src = sb.scene
    new-url = if location.href is /(.*)\?\d*$/ then that.1+'?'+sb.id else location.href+'?'+sb.id
    history.push-state {}, null, new-url
    update-progresser!

  !function speech subtitle
    window.speech-synthesis.cancel!
    window.utterance = new SpeechSynthesisUtterance subtitle
    window.utterance.lang = \zh-tw
    window.utterance.rate = 1.2
    window.utterance.onstart = ->
      e.subtitle.innerHTML = subtitle.substring 0, 3
    window.utterance.onboundary = ->
      speech-record := speech-record + 1
      e.subtitle.innerHTML = subtitle.substring 0, it.char-index+3
    window.utterance.onend = ->
      return if \playing isnt status or window.speech-synthesis.speaking
      storyboard-i := storyboard-i + 1
      return action! if storyboard-i < script-len
      set-to-start!
      timer.stop!
    window.speech-synthesis.speak window.utterance

  !function update-progresser
    e.progress.innerHTML = "#{storyboard-i + 1} / #script-len"

  !function show-play-screen
    e.play-symbol.style.display = \block
    e.screen.style.opacity = 0.8

  !function hide-play-screen
    e.play-symbol.style.display = \none
    e.screen.style.opacity = 0

module.exports = Storyteller

# vi:et:nowrap
