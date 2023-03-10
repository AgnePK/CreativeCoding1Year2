class HStackedChart {
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
		_yTotal,
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
		this.yTotal = _yTotal;

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
		for (let x = 0; x < this.data.getRowCount(); x++) {
			if (int(this.data.rows[x].obj[this.yTotal]) > maxNum) {
				maxNum = int(this.data.rows[x].obj[this.yTotal]);
			}
		}

		// console.log(maxNum);

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
		let minNum = 0;
		for (let x = 0; x < this.data.getRowCount(); x++) {
			minNum = min(this.data.rows[x].obj[this.yValue[x]]);
			// console.log(minNum);
		}
		return minNum;
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
		push();
		translate(0,-this.margin);
		for (let x = 0; x < this.data.getRowCount(); x++) {
			push();
			for (let y = 0; y < this.yValue.length; y++) {
				let current = this.yValue[y];
				let height = this.data.rows[x].obj[current];
				fill(color(this.palette[y % this.palette.length]));
				stroke(255);
				strokeWeight(1);
				rect( 0,-this.barUnit * x, this.scaler(height),-this.barWidth);
				translate(this.scaler(height),0);
			}
			translate(this.barSpacing * x, 0);
			pop();

			//X axis year labels
			noStroke();
			fill(230);
			textSize(15);
			textAlign(CENTER, CENTER);
			text(
				this.data.rows[x].obj[this.xValue],
				-30,
				-x * this.barUnit + -this.barWidth / 2
			);
			//XAXIS LABELS
			push();
			translate(this.width / 2, 50);
			noStroke();
			fill(230);
			textSize(20);
			textAlign(CENTER, CENTER);
			text(this.yTotal, 0, 0);
			pop();

			push();
			// Legend
			for (let l = 0; l < this.yValue.length; l++) {
				translate(0, 40);
				let current = this.yValue[l];
				let xPos = this.width + 30;
				let yPos = -this.height;

				//circles
				fill(color(this.palette[l % this.palette.length]));
				stroke(255);
				circle(xPos - 15, yPos, 10);

				// current ledgend
				textAlign(LEFT, RIGHT);
				textSize(16);
				fill(230);
				noStroke();
				text(current, xPos, yPos);
			}
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
		textSize(25);
		textAlign(CENTER, CENTER);
		textWrap(WORD);
		text(this.name, 0, -this.height - 50, this.width);
	}
	ticks() {
		for (let t = 0; t < this.ticksNum + 1; t++) {
			//drawing each tick
			strokeWeight(1);
			stroke(230);
			line(this.tickSpace * t, 0, this.tickSpace * t,  10);

			//horizontal lines
			strokeWeight(0.5);
			stroke(160);
			line(t * this.tickSpace, 0, t * this.tickSpace, -this.width);

			//number labels
			let labelNums = this.maxNum / this.ticksNum;

			if (this.labels == 1) {
				noStroke();
				fill(230);
				textSize(15);
				textAlign(CENTER, CENTER);
				text(int(t * labelNums) / 10000 + "k", t * this.tickSpace, 20);
			}
			//YAXIS LABEL
			push();
			translate(-70, -this.height / 2);
			rotate(55);
			noStroke();
			fill(230);
			textSize(20);
			textAlign(CENTER, CENTER);
			text(this.xValue, 0, 0);
			pop();
			////////////
		}
	}
}
