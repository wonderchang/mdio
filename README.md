# markdown-player

[![Build Status](https://travis-ci.org/wonderchang/markteller.svg?branch=master)](https://travis-ci.org/wonderchang/markteller)

A markdown text-to-speech robot.

## Installation

For browser
	
	<script src='markteller-min.js'></script>

For webpack

	$ npm install markteller
	var Markteller = require('markteller')

## Usage
	
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
