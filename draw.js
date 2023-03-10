let table;
let charts = [];
let chart2;
function preload() {
	table = loadTable("langData/langReport.csv", "csv", "header");
}

function setup() {
	pixelDensity(3);
	// DEGREES()
	createCanvas(1400, 2000);
	// _data, _width, _height, _xPos, _yPos, _ticks, _labels, _name, _xValue, _yValue, _lineValue

	charts.push(
		new BarChart({
			_data: table,
			_width: 400,
			_height: 400,
			_xPos: 100,
			_yPos: 1200,
			_ticks: 7,
			_labels: 1,
			_name: "All primary school pupils 2017 - 2022",
			_xValue: "Year",
			_yValue: "AllPupils",
			_lineValue: ["EnglishIrish"]
		})
	);
	charts.push(
		new HbarChart({
			_data: table,
			_width: 300,
			_height: 300,
			_xPos: 800,
			_yPos: 1200,
			_ticks: 5,
			_labels: 1,
			_name: "Amount of primary school pupils speaking a foreign tongue",
			_xValue: "Year",
			_yValue: "ForeignTongue",
		})
	);
	charts.push(
		new StackedChart({
			_data: table,
			_width: 400,
			_height: 400,
			_xPos: 100,
			_yPos: 500,
			_ticks: 7,
			_labels: 1,
			_name: "The amount of children in primary school and their first language",
			_xValue: "Year",
			_yValue: ["EnglishIrish","NotEnglishIrish","NotKnown"],
			_yTotal: "AllPupils",
		})
	);
	charts.push(
		new HStackedChart({
			_data: table,
			_width: 400,
			_height: 400,
			_xPos: 800,
			_yPos: 500,
			_ticks: 7,
			_labels: 1,
			_name: "The amount of children in primary school and their first language",
			_xValue: "Year",
			_yValue: ["EnglishIrish","ForeignTongue"],
			_yTotal: "AllPupils",
		})
	);
}

function draw() {
	background(70, 110, 105);
	for (let x = 0; x < charts.length; x++) {
		charts[x].render();
	}
}
