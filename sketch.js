/*
	things to consider/do:
		totals given criteria for x and y plotting
		hide exhibits given criteria
		how to handle exhibit overlap
		axis tick marks
		how to store/decide what colors to make museums
		legend for museum colors
		tooltips for details
*/

x0 = 0
y0 = 0
xMax = 0
yMax = 0
xScaleMax = 10
yScaleMax = 10
exhibitArray = []
var maskImage

function preload() {
	//load all exhibits and images
	maskImage = loadImage('images/mask.png')
	table = loadTable('exhibits.csv', 'csv', 'header', function(table) {
		for (i = 0 ; i < table.getRowCount() ; i++) {
			var row = table.getRow(i)
			var exhibit = new Exhibit(row.getString(0), row.getString(1), row.getString(2),
				row.getNum(3), row.getNum(4), row.getNum(5), row.getNum(6), row.getNum(7))
			
			exhibit.fullImage = loadImage(exhibit.imageLink)
			exhibitArray.push(exhibit)
		}		
	})
	
	
}

function setup() {
	//create all circle images (can't get this to work in preload so leaving here for now)
	for(i = 0 ; i < exhibitArray.length ; i++) {
		exhibitArray[i].circleImage = createCircleImage(exhibitArray[i].fullImage)
	}

	createCanvas(windowWidth, windowHeight)
	fill(0)
	calculate00AndMax()
	drawAxes()
	imageMode(CENTER)

	noFill()
	strokeWeight(15)
	stroke('blue')
	
	
	for(i = 0 ; i < exhibitArray.length ; i++) {
		ellipse(cX(i) , cY(i) , 100, 100)
		var photo = exhibitArray[i].circleImage
		image(photo, cX(i), cY(i), photo.width,
			photo.height)
	}
	var photo = exhibitArray[1].circleImage
	
	//image(photo, cX(20), cY(20), photo.width, photo.height)
	
}

function windowResized() {
	resizeCanvas(windowWidth, windowHeight)
	calculate00AndMax()
	drawAxes()
	line(cX(20), cY(10), cX(0), cY(0))
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
	strokeWeight(3)
	stroke('gray')
	line(x0, yMax, x0, y0)
	line(x0,  y0,  xMax, y0)
}

//these functions used to convert from coordinate x and y (as defined by x0, xMax, etc) 
//to p5 coordinate system
function cX(x) {
	return x0 + x*((xMax - x0) / xScaleMax)
}

function cY(y) {
	return y0 - y*((y0 - yMax) / yScaleMax)
}

function Exhibit(museum, location, imageLink, interaction,
	learning, emotionalResponse, unpredictability, numberOfUsers) {

	this.museum = museum
	this.location = location 
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

	//alert('w: ' + width + ' h: ' + height + ' dif: ' + dif)
	//alert('w: ' + photo.width + ' h: ' + photo.height)

	photo.mask(maskImage)
	return photo
}