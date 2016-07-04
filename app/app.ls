window.$ = window.jQuery = require \jquery/dist/jquery.js
Timer = require \./timer.ls

module.exports = (doc, base-url) ->

  timer = new Timer \timer

  # Parse the script from html
  script = []; i = 0; scene = ''
  if doc is /<h1.*?>(.+?)<\/h1>/ then $ \title .text title = that.1
  for d in doc.split /<p>(.*?)<\/p>/
    continue if /<h1.*?<\/h1>/ is d
    continue if /^\s*$/ is d or /<!--.*-->/ is d
    if /<img src="?(.+?)"? alt="">/ is d then scene = that.1
    else script.push text: d, scene: scene, id: ++i
  script-len = script.length

  # Draw play icon svg
  $ window .resize !->
    if window.inner-width > window.inner-height
      radius = window.inner-height / 4
    else radius = window.inner-width / 4
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
  .resize!

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
  $ \#screen   .click player
  $ \#prev-btn .click prev
  $ \#next-btn .click next

  # Keydown event handler
  $ window .keydown !->
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
    history.push-state {}, null, base-url

  !function show-start-screen
    $ \#play-symbol .css \display, \block
    $ \#screen .css \opacity 0.8
    $ '#scene img' .attr \src ''
    $ \#subtitle .text title
    update-progresser!

  !function action
    sb = script[storyboard-i]
    change-scene {} <<< sb <<< text: ''
    speech sb.text

  !function change-scene sb
    $ \#subtitle .html sb.text
    $ '#scene img' .attr \src sb.scene
    history.push-state {}, null, "#baseUrl?#{sb.id}"
    update-progresser!

  !function speech subtitle
    window.speech-synthesis.cancel!
    window.utterance = new SpeechSynthesisUtterance subtitle
    window.utterance.lang = \zh-tw
    window.utterance.rate = 1.2
    window.utterance.onstart = ->
      $ \#subtitle .html subtitle.substring 0, 3
    window.utterance.onboundary = ->
      speech-record := speech-record + 1
      $ \#subtitle .html subtitle.substring 0, it.char-index+3
    window.utterance.onend = ->
      return if \playing isnt status or window.speech-synthesis.speaking
      storyboard-i := storyboard-i + 1
      return action! if storyboard-i < script-len
      set-to-start!
      timer.stop!
    window.speech-synthesis.speak window.utterance

  !function update-progresser
    $ \#progress .text "#{storyboard-i + 1} / #script-len"

  !function show-play-screen
    $ \#play-symbol .css \display, \block
    $ \#screen .css \opacity 0.8

  !function hide-play-screen
    $ \#play-symbol .css \display \none
    $ \#screen .css \opacity 0

# vi:et:nowrap
