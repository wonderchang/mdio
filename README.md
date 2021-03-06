# mdio

[![Build Status](https://travis-ci.org/wonderchang/mdio.svg?branch=master)](https://travis-ci.org/wonderchang/mdio)

A markdown document player. See example:

* [The Three Little Pigs](https://wonderchang.github.io/mdio/the-three-little-pigs.html) [[source](https://github.com/wonderchang/mdio/blob/master/dist/the-three-little-pigs.html)]

## Installation

For webpack

	$ npm install mdio


## Getting Started

Markup the content

```html
<div id='mdio'>
  # The Three Little Pigs

  ![cover](http://homepages.uni-paderborn.de/odenbach/wwwmath/pics/pigs/pig2.jpg)
  Once upon a time there was a mother pig who had three little pigs.
  The three little pigs grew so big that their mother said to them,
  ...
</div>
```

Setup the player

```js
const mdio = Mdio({
  selector: '#mdio',
  utteranceLang: 'en-US'
})
```

## Markup Instructions

### Title and Cover

The title should be the 1st token with heading1. And the cover should be the 2nd token which is the image type with 'cover' alt.

```
# This is the title

![cover](image-url)

...
```

### Speech under the Scene

```
![image-alt1](image-url-1)    
sentence 1
sentence 2
sentence 3

![image-alt2](image-url-2)
sentence 4
sentence 5
```

### Local Action Optional Settings

#### Image Scene

```
![image-alt1](image-url-1) <!-- {...} -->
```

#### Single Speech

```
sentence 1 <!-- {"utteranceRate": 0.4} -->
```

#### Multiple Speech
```
<!-- block {"utteranceRate": 0.4} -->
![image-alt1](image-url-1)
sentence 1
sentence 2
sentence 3
<!-- endblock -->
```

## Avaliable Options

* `selector`: the CSS selector for refering the element which the player will be set to. (default: `#mdio`)

---

* `utteranceLang`: The language of the utterance, See [`SpeechSynthesisUtterance.lang`](https://developer.mozilla.org/en-US/docs/Web/API/SpeechSynthesisUtterance/lang) (default: `en-US`)
* `utteranceRate`: The speed of the utterance, See [`SpeechSynthesisUtterance.rate`](https://developer.mozilla.org/en-US/docs/Web/API/SpeechSynthesisUtterance/rate) (default: `1`)
* `utterancePitch`: The pitch of the utterance, See [`SpeechSynthesisUtterance.lang`](https://developer.mozilla.org/en-US/docs/Web/API/SpeechSynthesisUtterance/pitch) (default: `1`)
* `utteranceVolume`: The volume of the utterance, See [`SpeechSynthesisUtterance.rate`](https://developer.mozilla.org/en-US/docs/Web/API/SpeechSynthesisUtterance/volume) (default: `1`)

## API

### `play(callback)`

...

### `pause(callback)`

...

### `stop(callback)`

...

### `forward(callback)`

...

### `backward(callback)`

...
