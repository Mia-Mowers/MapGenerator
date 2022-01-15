const fs = require('fs');

const jsdom = require("jsdom");
const { JSDOM } = jsdom;

var f = 'output.html';

var Simplex = require('perlin-simplex')
var simplex = new Simplex()

var gridWidth = 25.4;
var height = 100;
var width = height;

var lowFeq = 3;
var midFeq = 0.05;
var highFreq = 0.05;

// var lowAmp = 1;
// var midAmp = .5;
// var highAmp = .25;

var lowAmp = 1;
var midAmp = .5;
var highAmp = .25;

const dom = new JSDOM();
const document = dom.window.document;

var svg = document.createElement("svg");
svg.setAttribute('height', height * gridWidth);
svg.setAttribute('width', width * gridWidth);

// var test = document.createElement("line");
// test.setAttribute('style', 'stroke:rgb(255,0,0);stroke-width:2');
// test.setAttribute('x1', 0);
// test.setAttribute('y1', 0);
// test.setAttribute('x2', 200);
// test.setAttribute('y2', 200);
// svg.appendChild(test);

// var myNoiseMap = GenNoiselMap(width, height);
// var myNoiseMap = GenNoiselMap(height, height);

var myNoiseMap = GenNoiselMap(height, width);
var myLargerNoiseMap = multiplyNoiseMap(myNoiseMap);

var slopeMap = genSlopeMap(myLargerNoiseMap);

// for (var i = 0; i < slopeMap.length; i++) {
// 	var printout = "";
// 	for (var j = 0; j < slopeMap[i].length; j++) {
// 		printout = printout + " " + slopeMap[i][j];
// 	}
// 	console.log(printout);
// }

var DeepOceanBool = boolMapTrue();
var OceanBool = boolMapFromNoiselMap(myNoiseMap, .40);
var CoastalBool = boolMapFromNoiselMap(myNoiseMap, .53);
var HillBool = boolMapFromNoiselMap(myNoiseMap, .64);
var MountainBool = boolMapFromNoiselMap(myNoiseMap, .73);

var DeepOceanSquare = marchSquareMapFromBoolMap(DeepOceanBool);
var OceanSquare = marchSquareMapFromBoolMap(OceanBool);
var CoastalSquare = marchSquareMapFromBoolMap(CoastalBool);
var HillSquare = marchSquareMapFromBoolMap(HillBool);
var MountainSquare = marchSquareMapFromBoolMap(MountainBool);

var DeepOceanLines = LinesFromMarchSquareMap(DeepOceanSquare);
var OceanLines = LinesFromMarchSquareMap(OceanSquare);
var CoastalLines = LinesFromMarchSquareMap(CoastalSquare);
var HillLines = LinesFromMarchSquareMap(HillSquare);
var MountainLines = LinesFromMarchSquareMap(MountainSquare);

LinesToSVG(DeepOceanLines, "fill:#2e3f4b;stroke:#2e3f4b;stroke-width:3;stroke-linejoin:round");
LinesToSVG(OceanLines, "fill:#495c6c;stroke:#495c6c;stroke-width:3;stroke-linejoin:round");
LinesToSVG(CoastalLines, "fill:#a4a463;stroke:#a4a463;stroke-width:3;stroke-linejoin:round");
LinesToSVG(HillLines, "fill:#957347;stroke:#957347;stroke-width:3;stroke-linejoin:round");
LinesToSVG(MountainLines, "fill:#5a483e;stroke:#5a483e;stroke-width:3;stroke-linejoin:round");

drawRivers(slopeMap, "stroke:#000000;stroke-width:2");

pointGrid('black', gridWidth / 30);

// gridFromBoolLess(OceanBool, CoastalBool, 'rgb(179, 218, 255)', gridWidth / 4);
// gridFromBoolLess(CoastalBool, HillBool, 'rgb(77, 153, 0)', gridWidth / 4);
// gridFromBoolLess(HillBool, MountainBool, 'rgb(102, 51, 0)', gridWidth / 4);
// gridFromBool(MountainBool, 'rgb(47, 47, 30)', gridWidth / 4);

// gridFromBoolLess(OceanBool, CoastalBool, 'rgb(232,232,232)', gridWidth / 8);
// gridFromBoolLess(CoastalBool, HillBool, 'rgb(190,190,190)', gridWidth / 8);
// gridFromBoolLess(HillBool, MountainBool, 'rgb(105,105,105)', gridWidth / 8);
// gridFromBool(MountainBool, 'rgb(0,0,0)', gridWidth / 8);

// gridFromBool(DeepOceanBool, 'black', gridWidth / 8);

function genSlopeMap(inputMap) {
	var outputMap = [];
	for (var i = 0; i < inputMap.length; i++) {
		outputMap.push([]);
		for (var j = 0; j < inputMap[i].length; j++) {
			outputMap[i].push(-1);
		}
	}

	for (var i = 0; i < inputMap.length; i++) {
		outputMap[i][0] = 6;
		outputMap[i][inputMap[i].length - 1] = 2;
	}

	for (var i = 0; i < inputMap[0].length; i++) {
		outputMap[0][i] = 0;
		outputMap[inputMap.length - 1][i] = 4;
	}

	outputMap[0][inputMap[0].length - 1] = 1;
	outputMap[inputMap.length - 1][inputMap[inputMap.length - 1].length - 1] = 3;
	outputMap[inputMap.length - 1][0] = 5;
	outputMap[0][0] = 7;

	for (var i = 1; i < inputMap.length - 1; i++) {
		for (var j = 1; j < inputMap[i].length - 1; j++) {
			var north = inputMap[i - 1][j];
			var northEast = inputMap[i - 1][j + 1];
			var east = inputMap[i][j + 1];
			var southEast = inputMap[i + 1][j + 1];
			var south = inputMap[i + 1][j];
			var southWest = inputMap[i + 1][j - 1];
			var west = inputMap[i][j - 1];
			var northWest = inputMap[i - 1][j - 1];

			var currentLowestVal = north;
			outputMap[i][j] = 0;

			if (northEast < currentLowestVal) {
				currentLowestVal = northEast;
				outputMap[i][j] = 1;
			}
			if (east < currentLowestVal) {
				currentLowestVal = east;
				outputMap[i][j] = 2;
			}
			if (southEast < currentLowestVal) {
				currentLowestVal = southEast;
				outputMap[i][j] = 3;
			}
			if (south < currentLowestVal) {
				currentLowestVal = south;
				outputMap[i][j] = 4;
			}
			if (southWest < currentLowestVal) {
				currentLowestVal = southWest;
				outputMap[i][j] = 5;
			}
			if (west < currentLowestVal) {
				currentLowestVal = west;
				outputMap[i][j] = 6;
			}
			if (northWest < currentLowestVal) {
				currentLowestVal = northWest;
				outputMap[i][j] = 7;
			}
		}
	}
	return outputMap;
}

function multiplyNoiseMap(inputNoiseMap) {
	var outputNoiseMap = [];

	for (var i = 0; i < (height * 2) - 1; i++) {
		outputNoiseMap.push([]);
	}
	for (var i = 0; i < (height * 2) - 1; i++) {
		var debugOutput = "";

		for (var j = 0; j < (width * 2) - 1; j++) {
			var inHeight = Math.floor(i/2);
			var inWidth = Math.floor(j/2);

			var debugOutput = debugOutput + ` ${inHeight},${inWidth}`;
			// console.log(i);
			// console.log(outputNoiseMap[i]);
			// console.log(inHeight + 1);

			if (i % 2 == 0 && j % 2 == 0) {
				var nw = inputNoiseMap[inHeight][inWidth];
				outputNoiseMap[i].push(nw);
			} else if (j % 2 == 0) {
				var nw = inputNoiseMap[inHeight][inWidth];
				var sw = inputNoiseMap[inHeight + 1][inWidth];
				outputNoiseMap[i].push((nw + sw) / 2);
			} else if (i % 2 == 0) {
				var nw = inputNoiseMap[inHeight][inWidth];
				var ne = inputNoiseMap[inHeight][inWidth + 1];
				outputNoiseMap[i].push((nw + ne) / 2);
			} else {
				var nw = inputNoiseMap[inHeight][inWidth];
				var ne = inputNoiseMap[inHeight][inWidth + 1];
				var sw = inputNoiseMap[inHeight + 1][inWidth];
				var se = inputNoiseMap[inHeight + 1][inWidth + 1];
				outputNoiseMap[i].push((nw + ne + sw + se) / 4);
			}
		}
		// console.log(debugOutput);
	}
	return outputNoiseMap;
}

function GenNoiselMap(xScale, yScale) {
	var noiseMap = [];

	for (var i = 0; i < height; i++) {
		noiseMap.push([]);
	}

	for (var i = 0; i < height; i++) {
		for (var j = 0; j < width; j++) {
			e = lowAmp * simplex.noise((i/yScale) * lowFeq, (j/xScale)* lowFeq);
			e += midAmp * simplex.noise((i+10/yScale) * 2 * midFeq, (j+10/xScale) * 2 * midFeq);
			e += highAmp * simplex.noise((i+50/yScale) * 4 * highFreq, (j+50/xScale) * 4 * highFreq);

			e = ((e / (lowAmp + midAmp + highAmp)) + 1 ) / 2;

			var d = 2 * Math.max(Math.abs(i/height - 0.5), Math.abs(j/width - 0.5));
			e = (1 + e - d) / 2

			//noiseMap[i][j] = Math.pow(e * 1.2, 3);
			noiseMap[i][j] = e;
		}
	}
	return noiseMap;
}

function boolMapFromNoiselMap(noiseMap, threshold) {
	var boolMap = [];

	for (var i = 0; i < height; i++) {
		boolMap.push([]);
	}

	for (var i = 0; i < height; i++) {
		for (var j = 0; j < width; j++) {
			// boolMap[i][j] = (noiseMap[i][j] - (((Math.abs(i - height * .5) / height) + (Math.abs(j - width * .5) / width))*4)) + 1.5 > 0.5;
			boolMap[i][j] = noiseMap[i][j] > threshold; // .55
		}
	}
	return boolMap;
}

function boolMapTrue() {
	var boolMap = [];

	for (var i = 0; i < height; i++) {
		boolMap.push([]);
	}

	for (var i = 0; i < height; i++) {
		for (var j = 0; j < width; j++) {
			boolMap[i][j] = true;
		}
	}
	return boolMap;
}

function marchSquareMapFromBoolMap(boolMap) {
	var marchSquareMap = [];

	for (var i = 0; i < height - 1; i++) {
		marchSquareMap.push([]);
	}

	for (var i = 0; i < height - 1; i++) {
		for (var j = 0; j < width - 1; j++) {
			marchSquareMap[i][j] =
			Number(boolMap[i][j]) * 8 +
			Number(boolMap[i][j+1]) * 4 +
			Number(boolMap[i+1][j+1]) * 2 +
			Number(boolMap[i+1][j]) * 1;
		}
	}
	return marchSquareMap;
}

function LinesFromMarchSquareMap(marchSquareMap) {
	var lines = []

	for (var i = 0; i < height - 1; i++) {
		for (var j = 0; j < width - 1; j++) {
			var line;
			var value = marchSquareMap[i][j];
			if (!(value == 0)) {
				if (value == 1){
					// line = {x1:0 + j, y1:0.5 + i, x2:0.5 + j, y2:1 + i};
					line = (0 + j) * gridWidth + "," + (0.5 + i) * gridWidth;
					line += " " + (0.5 + j) * gridWidth + "," + (1 + i) * gridWidth;
					line += " " + (0 + j) * gridWidth + "," + (1 + i) * gridWidth;
				} else if (value == 2) {
					// line = {x1:0.5 + j, y1:1 + i, x2:1 + j, y2:0.5 + i};
					line = (0.5 + j) * gridWidth + "," + (1 + i) * gridWidth;
					line += " " + (1 + j) * gridWidth + "," + (0.5 + i) * gridWidth;
					line += " " + (1 + j) * gridWidth + "," + (1 + i) * gridWidth;
				} else if (value == 3) {
					// line = {x1:0 + j, y1:0.5 + i, x2:1 + j, y2:0.5 + i};
					line = (0 + j) * gridWidth + "," + (0.5 + i) * gridWidth;
					line += " " + (1 + j) * gridWidth + "," + (0.5 + i) * gridWidth;
					line += " " + (1 + j) * gridWidth + "," + (1 + i) * gridWidth;
					line += " " + (0 + j) * gridWidth + "," + (1 + i) * gridWidth;
				} else if (value == 4) {
					// line = {x1:1 + j, y1:0.5 + i, x2:0.5 + j, y2:0 + i};
					line = (1 + j) * gridWidth + "," + (0.5 + i) * gridWidth;
					line += " " + (0.5 + j) * gridWidth + "," + (0 + i) * gridWidth;
					line += " " + (1 + j) * gridWidth + "," + (0 + i) * gridWidth;
				} else if (value == 5) {
					// line = {x1:0 + j, y1:0.5 + i, x2:0.5 + j, y2:0 + i};
					// lines.push(line);
					// line = {x1:1 + j, y1:0.5 + i, x2:0.5 + j, y2:1 + i};
					line = (0 + j) * gridWidth + "," + (0.5 + i) * gridWidth;
					line += " " + (0.5 + j) * gridWidth + "," + (0 + i) * gridWidth;
					line += " " + (1 + j) * gridWidth + "," + (0 + i) * gridWidth;
					line += " " + (1 + j) * gridWidth + "," + (0.5 + i) * gridWidth;
					line += " " + (0.5 + j) * gridWidth + "," + (1 + i) * gridWidth;
					line += " " + (0 + j) * gridWidth + "," + (1 + i) * gridWidth;
				} else if (value == 6) {
					// line = {x1:0.5 + j, y1:0 + i, x2:0.5 + j, y2:1 + i};
					line = (0.5 + j) * gridWidth + "," + (0 + i) * gridWidth;
					line += " " + (0.5 + j) * gridWidth + "," + (1 + i) * gridWidth;
					line += " " + (1 + j) * gridWidth + "," + (1 + i) * gridWidth;
					line += " " + (1 + j) * gridWidth + "," + (0 + i) * gridWidth;
				} else if (value == 7) {
					// line = {x1:0.5 + j, y1:0 + i, x2:0 + j, y2:0.5 + i};
					line = (0.5 + j) * gridWidth + "," + (0 + i) * gridWidth;
					line += " " + (0 + j) * gridWidth + "," + (0.5 + i) * gridWidth;
					line += " " + (0 + j) * gridWidth + "," + (1 + i) * gridWidth;
					line += " " + (1 + j) * gridWidth + "," + (1 + i) * gridWidth;
					line += " " + (1 + j) * gridWidth + "," + (0 + i) * gridWidth;
				} else if (value == 8) {
					// line = {x1:0.5 + j, y1:0 + i, x2:0 + j, y2:0.5 + i};
					line = (0.5 + j) * gridWidth + "," + (0 + i) * gridWidth;
					line += " " + (0 + j) * gridWidth + "," + (0.5 + i) * gridWidth;
					line += " " + (0 + j) * gridWidth + "," + (0 + i) * gridWidth;
				} else if (value == 9) {
					// line = {x1:0.5 + j, y1:0 + i, x2:0.5 + j, y2:1 + i};
					line = (0.5 + j) * gridWidth + "," + (0 + i) * gridWidth;
					line += " " + (0.5 + j) * gridWidth + "," + (1 + i) * gridWidth;
					line += " " + (0 + j) * gridWidth + "," + (1 + i) * gridWidth;
					line += " " + (0 + j) * gridWidth + "," + (0 + i) * gridWidth;
				} else if (value == 10) {
					// line = {x1:0.5 + j, y1:0 + i, x2:1 + j, y2:0.5 + i};
					// lines.push(line);
					// line = {x1:0.5 + j, y1:1 + i, x2:0 + j, y2:0.5 + i};
					line = (0.5 + j) * gridWidth + "," + (0 + i) * gridWidth;
					line += " " + (1 + j) * gridWidth + "," + (0.5 + i) * gridWidth;
					line += " " + (1 + j) * gridWidth + "," + (1 + i) * gridWidth;
					line += " " + (0.5 + j) * gridWidth + "," + (1 + i) * gridWidth;
					line += " " + (0 + j) * gridWidth + "," + (0.5 + i) * gridWidth;
					line += " " + (0 + j) * gridWidth + "," + (0 + i) * gridWidth;
				} else if (value == 11) {
					// line = {x1:0.5 + j, y1:0 + i, x2:1 + j, y2:0.5 + i};
					line = (0.5 + j) * gridWidth + "," + (0 + i) * gridWidth;
					line += " " + (1 + j) * gridWidth + "," + (0.5 + i) * gridWidth;
					line += " " + (1 + j) * gridWidth + "," + (1 + i) * gridWidth;
					line += " " + (0 + j) * gridWidth + "," + (1 + i) * gridWidth;
					line += " " + (0 + j) * gridWidth + "," + (0 + i) * gridWidth;
				} else if (value == 12) {
					// line = {x1:1 + j, y1:0.5 + i, x2:0 + j, y2:0.5 + i};
					line = (0 + j) * gridWidth + "," + (0 + i) * gridWidth;
					line += " " + (1 + j) * gridWidth + "," + (0 + i) * gridWidth;
					line += " " + (1 + j) * gridWidth + "," + (0.5 + i) * gridWidth;
					line += " " + (0 + j) * gridWidth + "," + (0.5 + i) * gridWidth;
				} else if (value == 13) {
					// line = {x1:1 + j, y1:0.5 + i, x2:0.5 + j, y2:1 + i};
					line = (1 + j) * gridWidth + "," + (0.5 + i) * gridWidth;
					line += " " + (0.5 + j) * gridWidth + "," + (1 + i) * gridWidth;
					line += " " + (0 + j) * gridWidth + "," + (1 + i) * gridWidth;
					line += " " + (0 + j) * gridWidth + "," + (0 + i) * gridWidth;
					line += " " + (1 + j) * gridWidth + "," + (0 + i) * gridWidth;
				} else if (value == 14) {
					// line = {x1:0.5 + j, y1:1 + i, x2:0 + j, y2:0.5 + i};
					line = (0.5 + j) * gridWidth + "," + (1 + i) * gridWidth;
					line += " " + (0 + j) * gridWidth + "," + (0.5 + i) * gridWidth;
					line += " " + (0 + j) * gridWidth + "," + (0 + i) * gridWidth;
					line += " " + (1 + j) * gridWidth + "," + (0 + i) * gridWidth;
					line += " " + (1 + j) * gridWidth + "," + (1 + i) * gridWidth;
				} else if (value == 15) {
					line = (0 + j) * gridWidth + "," + (0 + i) * gridWidth;
					line += " " + (1 + j) * gridWidth + "," + (0 + i) * gridWidth;
					line += " " + (1 + j) * gridWidth + "," + (1 + i) * gridWidth;
					line += " " + (0 + j) * gridWidth + "," + (1 + i) * gridWidth;
				}
				lines.push(line);
			}
		}
	}
	return lines;
}


// for (var i = 0; i < lines.length; i++) {
//     console.log(lines[i]);
// }

function LinesToSVG(lines, style){
	for (var i = 0; i < lines.length; i++) {
		var el = document.createElement("polygon");
		el.setAttribute('style', style);
		el.setAttribute('points', lines[i]);
		svg.appendChild(el);
	}
}



// for (var i = 0; i < (height * 2) - 1; i++) {
//     for (var j = 0; j < (width * 2) - 1; j++) {
//         var dot = document.createElement("circle");
//         dot.setAttribute('fill', 'black');
//         dot.setAttribute('cx', (j) * gridWidth / 2);
//         dot.setAttribute('cy', (i) * gridWidth / 2);
//         dot.setAttribute('r', gridWidth / 20);
//         svg.appendChild(dot);
//     }
// }

// for (var i = 0; i < height; i++) {
//     for (var j = 0; j < width; j++) {
//         var dot = document.createElement("circle");
//         if (boolMap[i][j]){
//             dot.setAttribute('fill', 'red');
//         } else {
//             dot.setAttribute('fill', 'black');
//         }
//         dot.setAttribute('cx', j * gridWidth);
//         dot.setAttribute('cy', i * gridWidth);
//         dot.setAttribute('r', .125 * gridWidth);
//         svg.appendChild(dot);
//     }
// }
function drawRivers(inputMap, style){
	for (var i = 0; i < (height * 2) - 1; i++) {
		for (var j = 0; j < (width * 2) - 1; j++) {
			var line = document.createElement("line");
			line.setAttribute('x1', j * gridWidth / 2);
			line.setAttribute('y1', i * gridWidth / 2);
			if (inputMap[i][j] == 0) {
				line.setAttribute('x2', (j) * gridWidth / 2);
				line.setAttribute('y2', (i - 1) * gridWidth / 2);
			} else if (inputMap[i][j] == 1) {
				line.setAttribute('x2', (j + 1) * gridWidth / 2);
				line.setAttribute('y2', (i - 1) * gridWidth / 2);
			} else if (inputMap[i][j] == 2) {
				line.setAttribute('x2', (j + 1) * gridWidth / 2);
				line.setAttribute('y2', (i) * gridWidth / 2);
			} else if (inputMap[i][j] == 3) {
				line.setAttribute('x2', (j + 1) * gridWidth / 2);
				line.setAttribute('y2', (i + 1) * gridWidth / 2);
			} else if (inputMap[i][j] == 4) {
				line.setAttribute('x2', (j) * gridWidth / 2);
				line.setAttribute('y2', (i + 1) * gridWidth / 2);
			} else if (inputMap[i][j] == 5) {
				line.setAttribute('x2', (j - 1) * gridWidth / 2);
				line.setAttribute('y2', (i + 1) * gridWidth / 2);
			} else if (inputMap[i][j] == 6) {
				line.setAttribute('x2', (j - 1) * gridWidth / 2);
				line.setAttribute('y2', (i) * gridWidth / 2);
			} else {
				line.setAttribute('x2', (j - 1) * gridWidth / 2);
				line.setAttribute('y2', (i - 1) * gridWidth / 2);
			}
			line.setAttribute('style', style);
			svg.appendChild(line);
		}
	}
}

function pointGrid(color, size){
	for (var i = 0; i < (height * 2) - 1; i++) {
		for (var j = 0; j < (width * 2) - 1; j++) {
			var dot = document.createElement("circle");
			dot.setAttribute('fill', color);
			dot.setAttribute('cx', j * gridWidth / 2);
			dot.setAttribute('cy', i * gridWidth / 2);
			dot.setAttribute('r', size);
			dot.setAttribute('opacity', 0.25);
			svg.appendChild(dot);
		}
	}
}

function gridFromBool(boolMap, color, size){
	for (var i = 0; i < height; i++) {
		for (var j = 0; j < width; j++) {
			var dot = document.createElement("circle");
			dot.setAttribute('fill', color);
			dot.setAttribute('cx', j * gridWidth);
			dot.setAttribute('cy', i * gridWidth);
			dot.setAttribute('r', size);
			if (boolMap[i][j]){
				svg.appendChild(dot);
			}
		}
	}
}

function gridFromBoolLess(boolMap, AntiBoolMap, color, size){
	for (var i = 0; i < height; i++) {
		for (var j = 0; j < width; j++) {
			var dot = document.createElement("circle");
			dot.setAttribute('fill', color);
			dot.setAttribute('cx', j * gridWidth);
			dot.setAttribute('cy', i * gridWidth);
			dot.setAttribute('r', size);
			if (boolMap[i][j] && !(AntiBoolMap[i][j])){
				svg.appendChild(dot);
			}
		}
	}
}


document.body.appendChild(svg);

fs.writeFileSync(f, dom.serialize());

// for (var i = 0; i < height - 1; i++) {
//     for (var j = 0; j < width - 1; j++) {
//         var el = document.createElement("line");
//         el.setAttribute('fill', 'black');
//         el.setAttribute('x', i * gridWidth);
//         el.setAttribute('y', -1 * j * gridWidth);
//         el.innerHTML = i + ", " + j;
//         svg.appendChild(el);
//     }
// }


//
// for (var i = 0; i < height - 1; i++) {
//     var out = "" + marchSquareMap[i][0];
//     for (var j = 1; j < width - 1; j++) {
//         out = out + ", " + marchSquareMap[i][j];
//     }
//     console.log(out);
// }
