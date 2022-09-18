import { box } from "./public/Box";

let canvas = document.querySelector(`canvas`)
let ctx = canvas.getContext(`2d`)
const gameSpeed = 2.5
startAnimating(720)
// initialize the timer variables and start the animation

let bird = new box(140, 50, 30,30)

let gameOver = false
   
let jump = () => {
	bird.y -=50   
	if(bird.y <= -25) {
		bird.y += 25    
	}
}
 
let fall = () => {
	bird.y += 2.3
 
	if(bird.y >= canvas.height-bird.height) {
		bird.y = canvas.height-bird.height
		
		gameOver = true
	}
}

let generate5boxes = (lastPipeX = 0) => {

	if(gameOver == true) 
		return

	let i = 0
	let boxes = []
	let lastX = (lastPipeX > 0)? lastPipeX : 0


	do {
		
		let x = (i == 0) ? 450 : lastX+200
		
		let startUp = Math.floor(Math.random() * 200);
		let pipeUp = new box(x, 0, 50, startUp)
		boxes.push(pipeUp)


		let startDown = 400 - startUp

		let pipeDown = new box(x, startUp+100, 50, startDown)
		boxes.push(pipeDown)

		lastX = x 
		i++
	} while(i < 5)

	return boxes
	
}

let generate1box = (lastPipeX) => {
	
	// if(gameOver == true) 
	// 	return

	let startUp = Math.floor(Math.random() * 200);
	let pipeUp = new box(lastPipeX+200, 0, 50, startUp)
	let startDown = 400 - startUp
	let pipeDown = new box(lastPipeX+200, startUp+100, 50, startDown)
	

	boxes.push(pipeUp)
	boxes.push(pipeDown)
	

	
}

let removeFirstBox = () => {
	boxes.splice(0, 2)
}

var boxes = generate5boxes()

window.addEventListener(`keydown`, (e) => {
	let key = e.key

	if(key.toString() == ` `) {
		jump()
	}

	if(key.toString() == `p`) {
		pause()
	}
	
})

var stop = false;
var frameCount = 0;

var pause = () => {
	stop = (stop == true)? false : true

	if(stop == false) {
		startAnimating(60)
	}
}

var fps, fpsInterval, startTime, now, then, elapsed;

function startAnimating(fps) {
  fpsInterval = 1000 / fps;
  then = Date.now();
  startTime = then;
  animate();
}



var counter = 0

function animate() {

  // request another frame

 if(stop == true) {
	return
 }

 requestAnimationFrame(animate);
  
  

  // calc elapsed time since last loop

  now = Date.now();
  elapsed = now - then;

  // if enough time has elapsed, draw the next frame

  if (elapsed > fpsInterval) {
	ctx.clearRect(0, 0, 400, 400)
	fall()

	ctx.fillStyle = `red` 

	ctx.fillRect(bird.x, bird.y, bird.width, bird.height)

      // Get ready for next frame by setting then=now, but also adjust for your
      // specified fpsInterval not being a multiple of RAF's interval (16.7ms)
    then = now - (elapsed % fpsInterval);



	ctx.fillStyle = `black` 

	for(let i in boxes) {
		let pipe = boxes[i]
		pipe.x -= gameSpeed
		ctx.fillRect(pipe.x, pipe.y, pipe.width, pipe.height)

	}

	

	for(let i in boxes) {
		let pipe = boxes[i]

		if(collided(pipe, bird)) {
			console.log(`Bateu`)
		}

		if(i%2==0) {
			if(Math.floor(pipe.x) == Math.floor(bird.x+bird.width)) {
				counter++	
				console.log(counter)
				document.querySelector(`#counter`).innerHTML = counter
				generate1box(boxes[boxes.length-1].x)
				
				if(counter%5==0) {
					removeFirstBox()
					removeFirstBox()
				}

			}
		}
	}


      // Put your drawing code here

  }
}



function collided(pipe, bird) {

	if(pipe.y <= bird.y+ bird.height) {
		if(pipe.y+ pipe.height >= bird.y) {
			if(pipe.x <= bird.x+bird.width) {
				if(pipe.x + pipe.width >= bird.x) {
					pause()
					return true
				}
			}
		}
	}

	return false
}


