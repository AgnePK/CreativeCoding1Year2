class HbarChart {
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
	}) {
		this.data = _data;
		this.width = _width;
		this.height = _height;
		this.xPos = _xPos;
		this.yPos = _yPos;
		this.ticksNum = _ticks;
		this.labels = _labels;
		this.name = _name;
		this.margin = 0;
		this.barSpacing = 5;
		this.rounding = 10000;
		this.xValue = _xValue;
		this.yValue = _yValue;

		//calculations
		this.maxNum = this.findMax();
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
	render() {
		push();
		translate(this.xPos, this.yPos);
		this.ticks();
		this.bars();
		this.xyAxis();
		pop();
	}
	bars() {
		fill(91, 166, 150);
		push();
		translate(this.margin, 0);
		for (let x = 0; x < this.data.getRowCount(); x++) {
			let barHeight = int(-this.data.rows[x].obj[this.yValue]);
			fill(color(this.palette[x % this.palette.length]));
			rect(0, -x * this.barUnit, -this.scaler(barHeight), -this.barWidth);

			//data value on the bars
			noStroke();
			fill(80);
			textSize(15);
			textAlign(CENTER, CENTER);
			text(
				this.data.rows[x].obj[this.yValue],
				this.width / 2,
				-x * this.barUnit + -this.barWidth / 2
			);
			fill(230);
			text(
				this.data.rows[x].obj[this.xValue],
				-30,
				-x * this.barUnit + -this.barWidth / 2
			);
			push();
			translate(this.width / 2, 50);
			noStroke();
			fill(230);
			textSize(15);
			textAlign(CENTER, CENTER);
			text(this.yValue, 0, 0);
			pop();
		}

		pop();
	}
	scaler(_val) {
		return map(_val, 0, this.maxNum, 0, this.height);
	}
	xyAxis() {
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
		textSize(20);
		textAlign(CENTER);
		textWrap(WORD);
		text(this.name, 0, -this.height - 50, this.width);
	}
	ticks() {
		for (let t = 0; t < this.ticksNum + 1; t++) {
			//drawing each tick
			strokeWeight(1);
			stroke(230);
			line(this.tickSpace * t, 0, this.tickSpace * t, 10);

			//horizontal lines
			strokeWeight(0.5);
			stroke(160);
			line(t * this.tickSpace, 0, t * this.tickSpace, -this.width);

			//number labels
			let labelNums = (this.maxNum / this.ticksNum).toFixed();

			if (this.labels == 1) {
				push();
				translate(t * this.tickSpace, 30);
				rotate(75);
				noStroke();
				fill(230);
				textSize(15);
				textAlign(CENTER, CENTER);
				text(int(t * labelNums) / 10000 + "k", 0, 0);
				pop();
			}
			//YAXIS LABEL
			push();
			translate(-70, -this.height / 2);
			rotate(55);
			noStroke();
			fill(230);
			textSize(15);
			textAlign(CENTER, CENTER);
			text(this.xValue, 0, 0);
			pop();
		}
	}
}
