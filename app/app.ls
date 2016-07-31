Markteller = require \./markteller.ls

module.exports = !->

  if location.search
    [url, action-id] = (location.search.substring 1) / \&
    get-story url

  $ '.md-url input' .focus (input) ->
    <-! $ window .keydown
    if 13 is it.key-code
      url = input.current-target.value
      get-story url

  function get-story
    $.ajax do
      url: \/get-story, data: url: it
      before-send: !->
        $ \.err-msg .text 'Loading ...' .css \display, \block
      success: !->
        push-state location.origin+location.pathname+'?'+it.url
        $ \.homepage  .css \display, \none
        $ \.story     .css \display, \block
        opt = do
          element: \.stage, markdown: it.markdown
        markteller = new Markteller opt
        init-stage markteller

  !function init-stage markteller
    title = markteller.get-title!
    length = markteller.get-length!
    $ \title      .text "Markteller - #title"
    $ '.header p' .text title
    $ \.progress  .text "0 / #length"

    $ window .resize !->
      header-height = $ \.header .outer-height!
      footer-height = $ \.footer .outer-height!
      $ \.stage .css \height, window.inner-height - header-height - footer-height
    .resize!

    $ \.prev-btn .click !-> markteller.prev!
    $ \.next-btn .click !-> markteller.next!
    $ \.stage .click !->
      switch markteller.get-status!
      | \paused, \start => markteller.play!
      | \playing        => markteller.pause!
      | \finished       => markteller.play!

  function push-state then history.push-state {}, null, it
