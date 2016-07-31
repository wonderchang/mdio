Markteller = require \../markteller-min
module.exports = !->

  # Dom elements
  pagetitle = $ \title
  homepage  = $ \#homepage
  doc-url   = $ \#doc-url
  res-msg   = $ \#res-msg
  markvideo = $ \#markvideo
  marktitle = $ \#marktitle
  header    = $ \#header
  footer    = $ \#footer
  prev-btn  = $ \#prev-btn
  progress  = $ \#progress
  next-btn  = $ \#next-btn
  screen    = null

  # Markdown link have already given in url
  if location.search
    [url, action-id] = (location.search.substring 1) / \?
    get-markdown url

  # Markdown link given from user input
  doc-url.focus (input) ->
    <-! $ window .keydown
    return if 13 isnt it.key-code
    url = input.current-target.value
    get-markdown url

  !function get-markdown
    $.ajax do
      url: \/get-story, data: url: it
      before-send: before-send
      success: success, error: error
      complete: complete

  !function before-send
    res-msg.text 'Loading ...' .css \display, \block

  !function error
    res-msg.text 'Error' .css \display, \block

  !function success
    # Rewrite url without redirect
    history.push-state {}, null, location.origin+location.pathname+'?'+it.url
    # Create markteller
    markteller = new Markteller it.markdown, do
      progress-render: !-> progress.text it
    # Set Page
    screen := markteller.screen
    title  = markteller.get-title!
    length = markteller.get-length!
    pagetitle.text "Markteller - #title"
    marktitle.text title
    progress.text  "0 / #length"
    # Controller
    prev-btn.click !-> markteller.prev!
    next-btn.click !-> markteller.next!
    $ screen .click !->
      switch markteller.get-status!
      | \paused, \start => markteller.play!
      | \playing        => markteller.pause!
      | \finished       => markteller.play!

  !function complete
    markvideo.css \display, \block
    homepage.css  \display, \none
    # Resize screen
    $ window .resize !->
      height = window.inner-height - header.outer-height! - footer.outer-height!
      $ screen .css \height, height
    .resize!
    # Show time
