class BarChart {
	constructor({
		_data,
		_width = 300,
		_height = 300,
		_xPos = 100,
		_yPos = 500,
		_ticks = 5,
		_labels = 1,
		_name = "Insert Name",
		_xValue,
		_yValue,
		_lineValue,
	}) {
		this.data = _data;
		this.width = _width;
		this.height = _height;
		this.xPos = _xPos;
		this.yPos = _yPos;
		this.ticksNum = _ticks;
		this.labels = _labels;
		this.name = _name;
		this.margin = 8;
		this.barSpacing = 5;
		this.rounding = 10000;
		this.xValue = _xValue;
		this.yValue = _yValue;
		this.lineValue = _lineValue;

		//calculations
		this.maxNum = this.findMax();
		this.minNum = this.findMin();
		this.tickSpace = this.height / this.ticksNum;
		this.widthLeft =
			this.width -
			this.margin * 2 -
			(this.data.getRowCount() - 1) * this.barSpacing;
		this.barWidth = this.widthLeft / this.data.getRowCount();
		this.barUnit = this.barWidth + this.barSpacing;

		//colour palette
		this.palette = ["#b687d6", "#c59fde", "#d3b7e6"];
	}

	findMax() {
		let maxNum = 0;
		//gets the maximum number
		for (let x = maxNum; x < this.data.getRowCount(); x++) {
			if (int(this.data.rows[x].obj[this.yValue]) > maxNum) {
				maxNum = int(this.data.rows[x].obj[this.yValue]);
			}
		}
		// rounds the number so the multiply into nicer whole numbers
		for (let x = maxNum; x < 1000000; x++) {
			if (x % this.ticksNum == 0 && x % this.rounding == 0) {
				maxNum = x;
				break;
			}
		}
		return maxNum;
	}
	findMin() {
		//finding the minimum number by looping through the array of yValue then checking which of those are the minimum and setting the smallest value to that minNum.
		//I was going to use this to scale from the minimum number but it didnt end up working
		let minNum = 0;
		let numsArray = [];
		for (let x = 0; x < this.data.getRowCount(); x++) {
			if (this.data.rows[x].obj[this.yValue[x]]) {
				numsArray.push(this.data.rows[x].obj[this.yValue[x]]);
				minNum = min(this.data.rows[x].obj[this.yValue[x]]);
			}
		}
		minNum = Math.min(...numsArray);
		return minNum;
	}
	render() {
		//drawing all my functions
		push();
		translate(this.xPos, this.yPos);
		this.ticks();
		this.bars();
		this.xyAxis();
		this.lineChart();

		pop();
	}
	bars() {
		fill(91, 166, 150);
		//These loops go through the data and builds the bars using the loop that goes though the rows.
		push();
		translate(this.margin, 0);
		for (let x = 0; x < this.data.getRowCount(); x++) {
			let barHeight = int(-this.data.rows[x].obj[this.yValue]);
			fill(color(this.palette[x % this.palette.length]));
			rect(x * this.barUnit, 0, this.barWidth, this.scaler(barHeight));
			//data value on the bars
			noStroke();
			fill(230);
			textSize(15);
			textAlign(CENTER, CENTER);
			//text gets the y value for the chart
			text(
				this.data.rows[x].obj[this.yValue],
				x * this.barUnit + this.barWidth / 2,
				this.scaler(barHeight) - 5
			);
			//text gets the x value for the chart
			text(
				this.data.rows[x].obj[this.xValue],
				x * this.barUnit + this.barWidth / 2,
				20
			);
			//Xaxis label
			push();
			translate(this.width / 2, 50);
			noStroke();
			fill(230);
			textSize(20);
			textAlign(CENTER, CENTER);
			text(this.xValue, 0, 0);
			pop();
		}
		pop();
	}
	scaler(_val) {
		//scaling the data from the maximum to be the size of height of the chart
		return map(_val, 0, this.maxNum, 0, this.height);
		// return map(_val, this.minNum, this.maxNum, 0, this.height);
		// console.log(this.minNum)
	}
	xyAxis() {
		//drawing the x and y axis

		//line colour and weight
		strokeWeight(1);
		stroke(230);
		//X Axis
		line(0, 0, this.width, 0);
		//Y Axis
		line(0, 0, 0, -this.height);

		//Chart name
		noStroke();
		fill(230);
		textSize(25);
		textAlign(CENTER);
		textWrap(WORD);
		text(this.name, 0, -this.height - 50, this.width);
	}
	ticks() {
		//this loop makes the amount of ticks that is stated in the constructor
		for (let t = 0; t < this.ticksNum + 1; t++) {
			//drawing each tick
			strokeWeight(1);
			stroke(230);
			line(0, -this.tickSpace * t, -10, -this.tickSpace * t);
			//horizontal lines
			strokeWeight(0.5);
			stroke(160);
			line(0, t * -this.tickSpace, this.width, t * -this.tickSpace);
			//number labels
			let labelNums = (this.maxNum / this.ticksNum).toFixed(0);
			if (this.labels == 1) {
				noStroke();
				fill(230);
				textSize(15);
				textAlign(RIGHT, CENTER);
				text(int(t * labelNums) / 10000 + "k", -20, -t * this.tickSpace);
			}
			//YAXIS LABEL
			push();
			translate(-70, -this.height / 2);
			rotate(55);
			noStroke();
			fill(230);
			textSize(20);
			textAlign(CENTER, CENTER);
			text(this.yValue, 0, 0);
			pop();
		}
	}
	lineChart() {
		//this loop draws a vertex (line) from each bar to the next bar and a circle in the middle of the bar.
		//drawing a vertex needs a beginshape and an endshape for it to work and i put it in a push and pop and translated it to the usual margin i use in my regular bars
		push();
		translate(this.margin, 0);
		beginShape();
		for (let l = 0; l < this.data.getRowCount(); l++) {
			let lineHeight = -this.data.rows[l].obj[this.lineValue];
			let linePos = l * this.barWidth + l * this.barSpacing;
			//circle
			noStroke();
			fill(0);
			circle(linePos + this.barWidth / 2, this.scaler(lineHeight), 5);
			//line
			stroke(1);
			noFill();
			vertex(linePos + this.barWidth / 2, this.scaler(lineHeight));
		}
		endShape();
		// Legend
		//this ledgend shows what th line is from the dataset
		for (let l = 0; l < this.lineValue.length; l++) {
			translate(0, 40);
			let current = this.lineValue[l];
			let xPos = this.width + 40;
			let yPos = -this.height;
			//circles
			stroke(3);
			line(xPos - 30, yPos + 5, xPos - 5, yPos - 15);
			// current ledgend
			textAlign(LEFT, RIGHT);
			textSize(16);
			fill(230);
			noStroke();
			text(current, xPos, yPos);
		}
		pop();
	}
}
