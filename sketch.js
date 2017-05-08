x0 = 0
y0 = 0
xMax = 0
yMax = 0
xScaleMax = 40
yScaleMax = 40

function preload() {

}

function setup() {
	createCanvas(windowWidth, windowHeight)
	fill(0)
	calculate00AndMax()
	drawAxes()
	line(cX(20), cY(10), x0, y0)
}

function windowResized() {
	resizeCanvas(windowWidth, windowHeight)
	calculate00AndMax()
	drawAxes()
}

function draw() {
  
}

function calculate00AndMax() {
	x0 = windowWidth / 4
	y0 = windowHeight / 5 * 4
	xMax = windowWidth / 7 * 6
	yMax = windowHeight / 6
}

function drawAxes() {
	//the non 0 values are used to 
	line(x0, yMax, x0, y0)
	line(x0,  y0,  xMax, y0)
}

//these functions used to convert from coordinate x and y (as defined by x0, xMax, etc) 
//to p5 coordinate system
function cX(x) {
	return x0 + x*((xMax - x0) / xScaleMax)
}

function cY(y) {
	return y0 - y*((y0 - yScaleMax) / yScaleMax)
}

