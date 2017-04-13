# markdown-player

[![Build Status](https://travis-ci.org/wonderchang/markdown-player.svg?branch=master)](https://travis-ci.org/wonderchang/markdown-player)

A markdown document player. See example:

* [The Three Little Pigs](https://wonderchang.github.io/markdown-player/the-three-little-pigs.html) [[source](https://github.com/wonderchang/markdown-player/blob/master/dist/the-three-little-pigs.html)]

## Installation

For webpack

	$ npm install markdown-player


## Getting Started

Markup the content

```html
<div id='markdown-player'>
  # The Three Little Pigs

  ![cover](http://homepages.uni-paderborn.de/odenbach/wwwmath/pics/pigs/pig2.jpg)
  Once upon a time there was a mother pig who had three little pigs.
  The three little pigs grew so big that their mother said to them,
  ...
</div>
```

Setup the player

```js
const markdownPlayer = MarkdownPlayer({
  selector: '#markdown-player',
  utteranceLang: 'en-US'
})
```

## Avaliable Options

* `selector`: the CSS selector for refering the element which the player will be set to. (default: `#markdown-player`)
* `utteranceLang`: The language of the utterance, See [`SpeechSynthesisUtterance.lang`](https://developer.mozilla.org/en-US/docs/Web/API/SpeechSynthesisUtterance/lang) (default: `en-US`)
* `utteranceRate`: The speed at which the utterance will be spoken, See [`SpeechSynthesisUtterance.rate`](https://developer.mozilla.org/en-US/docs/Web/API/SpeechSynthesisUtterance/rate) (default: `1`)
