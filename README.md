# storyteller

Demo: [https://wonderchang.github.io/storyteller/?陳文成事件](https://wonderchang.github.io/storyteller/?%E9%99%B3%E6%96%87%E6%88%90%E4%BA%8B%E4%BB%B6)

## Build & Deploy

Clone the repository

1. Fork this repo
2. Clone the forked repo from your account

Build the app

	$ npm i
	$ npm run build
    
Deploy to gh-page

	$ ./gh-deploy
	
open browser with [https://your-username.github.io/storyteller/?陳文成事件](https://your-username.github.io/storyteller/?%E9%99%B3%E6%96%87%E6%88%90%E4%BA%8B%E4%BB%B6)

## Add a New Story

### File Location

Each story have its own folder to store the resource. The folder name is the title of the story, which corresponding the parameter given in the url. Inside the folder, conventionally, the story script write in `book.md`, and the related image shown in story should saved at `img/`. The file structure of the story should be as follow.

	app/
		story/
			story-title1/
				book.md
				img/
					p1.png
					p2.png
					....
			story-title2/
				book.md
				img/
					...
			story-title3/
				book.md
				img/
					...
							
It seems there are three stories in the folder. If build and deploy successfully, the stories could be access by opening the url

* [https://your-username.github.io/storyteller/?story-title1](https://your-username.github.io/storyteller/?story-title1)
* [https://your-username.github.io/storyteller/?story-title2](https://your-username.github.io/storyteller/?story-title2)
* [https://your-username.github.io/storyteller/?story-title3](https://your-username.github.io/storyteller/?story-title3)

### Story Editting Convention

The story content should be written at `book.md`, which the editting format is markdown. However, the editting format only allow three types of markdown syntax:

1. First Header, which indicates the story title
	
		# Story Title
		
2. Embadded Image 

		![three pigs](img/three-pigs.png)
			
3. Normal text with new line

		Once upon a time, high up in the mountains
		
		There lived a mother pig and her three piglets
		
For Example

	# Ｔhe Three Little Pigs
		
	![three pigs](img/three-pigs.png)
		
	Once upon a time, high up in the mountains
		
	There lived a mother pig and her three piglets.
		
	One day, she called her piglets together for an ...
		
	...

## Development

    $ npm start

Then open brower with http://localhost:8080/?[topic]
