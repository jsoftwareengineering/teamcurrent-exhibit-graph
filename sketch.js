/*
	things to consider/do:
		hide exhibits given criteria
		how to handle exhibit overlap	right now, just random jitter
		legend for museum colors
		tooltips for details
*/

x0 = 0
y0 = 0
xMax = 0
yMax = 0
xScaleMax = 0
yScaleMax = 0
circleSize = 40
exhibitArray = []
var maskImage
var cardo
var pathwayGothic

//html text elements
var title
var subtitle
xAxisNumbers = []
yAxisNumbers = []

//poorly named checkbox arrays
checkX = []
checkY = []

//these arrays paralell, used in total calculations
//could refactor to key value or something
possibleCategories = ['interaction', 'learning', 'emotionalResponse',
 'unpredictability', 'numberOfUsers']
xOnCategories = [false, false, true, true, false]
yOnCategories = [false, true, false, false, false]
formattedCategories =['Interaction', 'Learning', 'Emotional Response',
 'Unpredictability', '# of Users']

colorsArray = ['#C09167','#ABE5D0', '#D79143', '#AD6463', '#484870', '#987E6D', '#194423', '#639E4A', '#298394', '#94DAF6']
museumsArray = []
museumsOnArray = []

function preload() {
	//load all exhibits and images
	maskImage = loadImage('images/mask.png')
	//table = loadTable('exhibitsbugged.csv', 'csv', 'header', function(table) {
	table = loadTable('exhibits.csv', 'csv', 'header', function(table) {
		for (i = 0 ; i < table.getRowCount() ; i++) {
			var row = table.getRow(i)
			var exhibit = new Exhibit(row.getString(0), row.getString(1), row.getString(2), 'images/'+i+'.jpg',
				row.getNum(4), row.getNum(5), row.getNum(6), row.getNum(7), row.getNum(8))

			if(museumsArray.indexOf(row.getString(0)) == -1) {
				museumsArray.push(row.getString(0))
				museumsOnArray.push(true)
				//console.log(row.getString(0) + ' ' + museumsArray.length)
			}
			
			exhibit.fullImage = loadImage(exhibit.imageLink)
			//console.log(i + ' ok')
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

	imageMode(CENTER)

	calculateExhibitTotals()
	createCanvas(windowWidth, windowHeight)
	fill(0)
	calculate00AndMax()
	drawAxes()
	plotExhibits()

	setupCheckBoxes()

	title = createElement('h1','Exhibit Graph');
	subtitle = createElement('p','<b>Comparing factor, factor, factor, factor </b>to <b>factor factor factor factor</b>');
	
	positionHTMLText()
	makeSubtitleText()

	//var photo = exhibitArray[1].circleImage
	//image(photo, cX(20), cY(20), photo.width, photo.height)
	
}

function windowResized() {
	resizeCanvas(windowWidth, windowHeight)
	calculate00AndMax()
	drawAxes()
	positionCheckBoxes()
	plotExhibits()
	positionHTMLText()
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
	stroke(51)

	//x axis
	line(x0,  y0,  xMax, y0)	
	//y axis
	line(x0, yMax, x0, y0)

	var tickSize = 5
	var numTicks = 5

	if(xAxisNumbers.length != numTicks) {
		xAxisNumbers = []
		for(i=0 ; i<numTicks ; i++) {
			xAxisNumbers.push(createElement('p','0'))	
		}
	}

	if(yAxisNumbers.length != numTicks) {
		yAxisNumbers = []
		for(i=0 ; i<numTicks ; i++) {
			yAxisNumbers.push(createElement('p','0'))	
		}
	}

	//x ticks and labels
	var division = (xMax - x0) / numTicks
	var tickNum = xScaleMax / numTicks
	textFont('Cardo')	
	fill('gray')
	for(i = 1 ; i <= numTicks ; i++) {
		stroke(51)
		line(x0 + division * i, y0 + tickSize, x0 + division * i, y0 - tickSize)
		stroke('none')
		xAxisNumbers[i-1].html(rnd(tickNum * i))
		xAxisNumbers[i-1].position(x0 + division * i - 3, y0 + tickSize)
	}

	//y ticks
	division = (y0 - yMax) / numTicks
	tickNum = yScaleMax / numTicks
	for(i = 1 ; i <= 5 ; i++) {
		stroke('gray')
		line(x0 + tickSize, y0 - division * i, x0 - tickSize, y0 - division * i)
		stroke('none')
		yAxisNumbers[i-1].html(rnd(tickNum * i))
		yAxisNumbers[i-1].position(x0 - tickSize * 6, y0 - division * (i+.3))
	}
}

function plotExhibits() {

	noFill()
	strokeWeight(circleSize / 6)
	
	for(i = 0 ; i < exhibitArray.length ; i++) {
		m = exhibitArray[i].museum
		j = museumsArray.indexOf(m)

		if(museumsOnArray[j]) {
			x = cX(exhibitArray[i].totalX) + random (-30, 30)
			y = cY(exhibitArray[i].totalY) + random (-30, 30)

			
			var photo = exhibitArray[i].circleImage
			stroke(colorsArray[museumsArray.indexOf(exhibitArray[i].museum)])

			ellipse(x , y , circleSize, circleSize)
			image(photo, x, y, photo.width,
				photo.height)	
		}
		
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

function checkBoxChanged(xOrY, index) {
	//console.log(xOrY + ' ' + index)
	if(xOrY === 'x') {
		xOnCategories[index] = !xOnCategories[index]
	} else if(xOrY === 'y') {
		yOnCategories[index] = !yOnCategories[index]
	}
	clear()
	calculateExhibitTotals()
	drawAxes()
	plotExhibits()
	makeSubtitleText()
}

function calculateExhibitTotals() {
	xScaleMax = 0
	yScaleMax = 0
	for(i = 0 ; i < exhibitArray.length ; i++) {
		exhibitArray[i].totalX = 0
		exhibitArray[i].totalY = 0
		
		//find total using criteria
		for(j = 0 ; j < possibleCategories.length ; j++) {
			if(xOnCategories[j]) {
				//console.log(possibleCategories[j] + ': ' + exhibitArray[i][possibleCategories[j]])
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

function createCircleImage(img) {
	
	var photo = img
	var width = photo.width
	var height = photo.height
	var dif = 0

	//resize based on bigger side, find difference (amount that needs to be removed to make square), 
	//take square from photo based on which side is longer (removing the extras) 
	//allowing us to mask using the square shaped masking circle
	if(width > height) {
		photo.resize(0, circleSize)
		width = photo.width
		height = photo.height
		dif = width - height

		photo = photo.get(round(dif/2), 0, width - dif, height)		

	} else if (height > width) {
		photo.resize(circleSize, 0)
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

function setupCheckBoxes() {

	for(i = 0 ; i < possibleCategories.length ; i++) {
		checkX[i] = createCheckbox(formattedCategories[i], xOnCategories[i]);
		checkX[i].position(windowWidth/6 * (i + 1), windowHeight/8 * 7);

		checkY[i] = createCheckbox(formattedCategories[i], yOnCategories[i]);
		checkY[i].position(10, windowHeight/20 * (i) + windowHeight / 2);
	}

	checkX[0].changed(function() {checkBoxChanged('x', 0)})
	checkX[1].changed(function() {checkBoxChanged('x', 1)})
	checkX[2].changed(function() {checkBoxChanged('x', 2)})
	checkX[3].changed(function() {checkBoxChanged('x', 3)})
	checkX[4].changed(function() {checkBoxChanged('x', 4)})

	checkY[0].changed(function() {checkBoxChanged('y', 0)})
	checkY[1].changed(function() {checkBoxChanged('y', 1)})
	checkY[2].changed(function() {checkBoxChanged('y', 2)})
	checkY[3].changed(function() {checkBoxChanged('y', 3)})
	checkY[4].changed(function() {checkBoxChanged('y', 4)})
}

function positionCheckBoxes() {
	for(i = 0 ; i < checkX.length ; i++) {
		checkX[i].position(windowWidth/6 * (i + 1), windowHeight/8 * 7);
		checkY[i].position(10, windowHeight/20 * (i) + windowHeight / 2);
	}
}

function positionHTMLText() {
	title.position(x0,10)
	subtitle.position(x0+160, 30)
}

function makeSubtitleText() {
	subText = 'Comparing <b>'
	subText += makeSubtitleTextForCat(yOnCategories)
	subText += '</b> to <b>'
	subText += makeSubtitleTextForCat(xOnCategories)
	subText += '</br>'
	subtitle.html(subText)
}

function makeSubtitleTextForCat(categories) {
	first = true
	foundIndeces = []
	subText = ''

	//find all indexes we need to write category name for
	for(i=0 ; i<categories.length ; i++) {
		if(categories[i]) {
			foundIndeces.push(i)
		}
	}

	//logic for commas and 'and'
	if(foundIndeces.length === 0) {
		subText += 'Nothing'
	} else if(foundIndeces.length === 1) {
		subText += formattedCategories[foundIndeces[0]]
	} else if(foundIndeces.length === 2) {
		subText += formattedCategories[foundIndeces[0]] + ' and ' +  formattedCategories[foundIndeces[1]]
	} else {
		for(i=0 ; i<foundIndeces.length-1 ; i++) {
			if(first) {
				subText += formattedCategories[foundIndeces[i]]
				first = false	
			} else {
				subText += ', ' + formattedCategories[foundIndeces[i]]
			}
		}
		subText += ', and ' + formattedCategories[foundIndeces[foundIndeces.length-1]]
	}

	return subText
}

function rnd(num) {
	return Math.round(num * 10) / 10;
}