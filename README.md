# markteller

[![Build Status](https://travis-ci.org/wonderchang/markteller.svg?branch=master)](https://travis-ci.org/wonderchang/markteller)

A text-to-speech robot via markdown. We build an [web application](http://markteller.iwonder.tw) applying this module for whom could easily create a simple HTML-based animation video by editing markdown document from [HackMD](https://hackmd.io/). 

For Example, [The Three Little Pigs](http://markteller.iwonder.tw/?https://hackmd.io/s/By_aEVUd), which the story are written at [here](https://hackmd.io/EbAmwRgFgiFoDMAGBB2OUCsBjUcCcSATPnAIb4BsRAZlFKpQBwRFA===)

## How to use it
	
For browser
	
	<script src='markteller-min.js'></script>

For webpack

	$ npm install markteller
	var Markteller = require('markteller')
	
After involving it, simple example

	<div id='markteller'></div>
	<div id='progress'></div>
	<div id='play-btn'></div>
	
the script

	var markdown = '# Markteller Test!\n\n\
					[](http://goo.gl/lvHnk4)\n\
					line1\n\
				  	line2\n\
					line3'
						
	var options = {
		render: '#markteller',
		speechLang: 'en-US',
		onEndAction: function(it) {
			$('#progress).html(it.actionI + '/' + it.totalAction)
		}
	}
		
	var markteller = new Markteller(markdown, options)
		
	$('#play-btn').click(function() {
		markteller.play()
	})
	
## License

MIT
	
