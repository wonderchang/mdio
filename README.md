# markteller

[![Build Status](https://travis-ci.org/wonderchang/markteller.svg?branch=master)](https://travis-ci.org/wonderchang/markteller)

For Example, [The Three Little Pigs](http://markteller.iwonder.tw/?https://hackmd.io/s/By_aEVUd), which the story are written at [HackMD](https://hackmd.io/EbAmwRgFgiFoDMAGBB2OUCsBjUcCcSATPnAIb4BsRAZlFKpQBwRFA===)

## How to use it
	
For browser,
	
	<script src='markteller-min.js'></script>

For webpack,

	npm install markteller
	var Markteller = require('markteller')
	
After involving it, simple example

	<div id='markteller'></div>
	<div id='progress'></div>
	<script>
		var markdown = '# Markteller Test!\n\n[](http://ww.share001.org/imgs/image/16/1600072.jpg)\nline1\nline2\nline3'
		var options = {
			render: '#markteller',
			speechLang: 'en-US',
			onEndAction: function(it) {
				document.getElementById('progress').innerHTML = it.actionUI + '/' + it.totalActionNum
			}
		}
		var markteller = new Markteller(markdown, options)
		markteller.play()
	</script>
	
