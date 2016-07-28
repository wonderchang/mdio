Storyteller = require \./storyteller.ls

module.exports = !->

  if location.search
    [url, action-id] = (location.search.substring 1) / \&
    get-story url

  $ '#md-url input' .focus (input) ->
    <-! $ window .keydown
    if 13 is it.key-code
      url = input.current-target.value
      get-story url

  function get-story
    $.ajax do
      url: \/get-story, data: url: it
      before-send: !->
        console.log 'start to send'
      success: !->
        push-state location.href+"?#{it.url}" if '' is location.search
        $ \#homepage .css \display, \none
        storyteller = new Storyteller \#stage, it

  function push-state then history.push-state {}, null, it
