function preload() {

}

function setup() {
	createCanvas(windowWidth, windowHeight)
	fill(0)
	drawAxes()
}

function windowResized() {
	resizeCanvas(windowWidth, windowHeight)
	drawAxes()
}

function draw() {
  
}

function drawAxes() {
	line(windowWidth / 4, windowHeight / 4, windowWidth / 4, windowHeight / 5 * 4)
	line(windowWidth / 4, windowHeight / 5 * 4 , windowWidth /7 * 6 , windowHeight / 5 * 4)
}