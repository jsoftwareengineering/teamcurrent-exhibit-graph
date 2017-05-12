/*
	things to consider/do:
		hide exhibits given criteria
		how to handle exhibit overlap
		how to store/decide what colors to make museums
		legend for museum colors
		tooltips for details

		figure out load fonts
*/

x0 = 0
y0 = 0
xMax = 0
yMax = 0
xScaleMax = 50
yScaleMax = 50
exhibitArray = []
var maskImage
var cardo
var pathwayGothic

//these arrays paralell, used in total calculations
//could refactor to key value or something
possibleCategories = ['interaction', 'learning', 'emotionalResponse',
 'unpredictability', 'numberOfUsers']
xOnCategories = [true, true, true, true, true]
yOnCategories = [true, true, true, true, true]

function preload() {
	//load all exhibits and images
	maskImage = loadImage('images/mask.png')
	//table = loadTable('exhibitsbugged.csv', 'csv', 'header', function(table) {
	table = loadTable('exhibits.csv', 'csv', 'header', function(table) {
		for (i = 0 ; i < table.getRowCount() ; i++) {
			console.log(i + ' ok')
			var row = table.getRow(i)
			var exhibit = new Exhibit(row.getString(0), row.getString(1), row.getString(2), 'images/'+i+'.jpg',
				row.getNum(4), row.getNum(5), row.getNum(6), row.getNum(7), row.getNum(8))
			
			exhibit.fullImage = loadImage(exhibit.imageLink)
			exhibitArray.push(exhibit)
		}		
	})
	
	//cardo = loadFont('fonts/Cardo-Regular.otf')
	//pathwayGothic = loadFont('fonts/PathwayGothicOne-Regular.ttf')
	
}

function setup() {
	//create all circle images (can't get this to work in preload so leaving here for now)
	for(i = 0 ; i < exhibitArray.length ; i++) {
		exhibitArray[i].circleImage = createCircleImage(exhibitArray[i].fullImage)
	}

	calculateTotals()

	createCanvas(windowWidth, windowHeight)
	fill(0)
	calculate00AndMax()
	drawAxes()
	imageMode(CENTER)

	noFill()
	strokeWeight(15)
	stroke('blue')
	
	
	for(i = 0 ; i < exhibitArray.length ; i++) {
		x = exhibitArray[i].totalX
		y = exhibitArray[i].totalY

		ellipse(cX(x) , cY(y) , 100, 100)
		var photo = exhibitArray[i].circleImage
		image(photo, cX(x), cY(y), photo.width,
			photo.height)
	}
	var photo = exhibitArray[1].circleImage
	
	//image(photo, cX(20), cY(20), photo.width, photo.height)
	
}

function windowResized() {
	resizeCanvas(windowWidth, windowHeight)
	calculate00AndMax()
	drawAxes()
}

function draw() {
  
}

// ^^ sketch zone ^^
//-------------------------------------------------------------------------------------------//
// vv custom zone vv

function calculate00AndMax() {
	x0 = windowWidth / 4
	y0 = windowHeight / 5 * 4
	xMax = windowWidth / 7 * 6
	yMax = windowHeight / 6
}

function drawAxes() {
	strokeWeight(3)
	stroke('gray')

	//x axis
	line(x0,  y0,  xMax, y0)	
	//y axis
	line(x0, yMax, x0, y0)

	var tickSize = 5
	var numTicks = 5

	//x ticks and labels
	var division = (xMax - x0) / numTicks
	var tickNum = xScaleMax / numTicks
	textFont('Cardo')	
	fill('gray')
	for(i = 1 ; i <= 5 ; i++) {
		stroke('gray')
		line(x0 + division * i, y0 + tickSize, x0 + division * i, y0 - tickSize)
		stroke('none')
		text(rnd(tickNum * i), x0 + division * i - 3, y0 + tickSize * 4)
	}

	//y ticks
	division = (y0 - yMax) / numTicks
	tickNum = yScaleMax / numTicks
	for(i = 1 ; i <= 5 ; i++) {
		stroke('gray')
		line(x0 + tickSize, y0 - division * i, x0 - tickSize, y0 - division * i)
		stroke('none')
		text(rnd(tickNum * i), x0 - tickSize * 4, y0 - division * i +3)
	}
}

//these functions used to convert from coordinate x and y (as defined by x0, xMax, etc) 
//to p5 coordinate system
function cX(x) {
	return x0 + x*((xMax - x0) / xScaleMax)
}

function cY(y) {
	return y0 - y*((y0 - yMax) / yScaleMax)
}

function Exhibit(museum, location, name, imageLink, interaction,
	learning, emotionalResponse, unpredictability, numberOfUsers) {

	this.museum = museum
	this.location = location 
	this.name = name
	this.imageLink = imageLink
	this.interaction = interaction
	this.learning = learning 
	this.emotionalResponse = emotionalResponse
	this.unpredictability = unpredictability
	this.numberOfUsers = numberOfUsers

}

function createCircleImage(img) {
	var photo = img
	var width = photo.width
	var height = photo.height
	var dif = 0

	//resize based on bigger side, find difference (amount that needs to be removed to make square), 
	//take square from photo based on which side is longer (removing the extras) 
	//allowing us to mask using the square shaped masking circle
	if(width > height) {
		photo.resize(0, 100)
		width = photo.width
		height = photo.height
		dif = width - height

		photo = photo.get(round(dif/2), 0, width - dif, height)		

	} else if (height > width) {
		photo.resize(100, 0)
		width = photo.width
		height = photo.height
		dif = height - width

		photo = photo.get(0, round(dif/2), width, height - dif)
	}

	//console.log('w: ' + width + ' h: ' + height + ' dif: ' + dif)
	//console.log('w: ' + photo.width + ' h: ' + photo.height)

	photo.mask(maskImage)
	return photo
}

function calculateTotals() {
	xScaleMax = 0
	yScaleMax = 0
	for(i = 0 ; i < exhibitArray.length ; i++) {
		exhibitArray[i].totalX = 0
		exhibitArray[i].totalY = 0
		
		//find total using criteria
		for(j = 0 ; j < possibleCategories.length ; j++) {
			if(xOnCategories[j]) {
				exhibitArray[i].totalX += exhibitArray[i][possibleCategories[j]]
			}
			if(yOnCategories[j]) {
				exhibitArray[i].totalY += exhibitArray[i][possibleCategories[j]]
			}
		}

		//check to see if there are new max
		if(exhibitArray[i].totalX > xScaleMax) {
			xScaleMax = exhibitArray[i].totalX
		}

		if(exhibitArray[i].totalY > yScaleMax) {
			yScaleMax = exhibitArray[i].totalY
		}
	}
}

function rnd(num) {
	return Math.round(num * 10) / 10;
}