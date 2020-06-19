var canvas, ctx, figures, idTimer, allOrientation = 'up';
var minSpeed = 4, maxSpeed = 20;
Figure = new Class ({
	name: 'figure',
	X: 0,
	Y: 0,
	colFigure:"rgb(0,0,0)",
	orientation: 'up',
	speed: 4,

	initialize: function(pX, pY) {
		this.X = pX;
		this.Y = pY;
		this.colFigure = 'rgb('+Math.floor(Math.random()*256)+','+Math.floor(Math.random()*256)+','+Math.floor(Math.random()*256)+')';

		if (allOrientation == 'random') {
			var x = Math.floor(Math.random() * 4);
			switch (x) {
				case 0:
				this.orientation = 'up';
				break;
				case 1:
				this.orientation = 'right';
				break;
				case 2:
				this.orientation = 'down';
				break;
				case 3:
				this.orientation = 'left';
				break;
			}
		} else {
			this.orientation = allOrientation;
		}
	},
	move: function() {
		switch (this.orientation) {
			case 'up':
			moveUp(this);
			break;
			case 'down':
			moveDown(this);
			break;
			case 'right':
			moveRight(this);
			break;
			case 'left':
			moveLeft(this);
			break;
			default:
			moveChaos(this);
		}
		this.boost(3);
		this.speed = Math.min(maxSpeed, this.speed + 0.15);
	},
	boost: function(n) {},
	draw: function(ctx) {},
});
Ball = new Class ({
	Extends: Figure,
	name: 'circle',
	radius: 0,
	initialize: function(pX, pY) {
		this.parent(pX, pY);
		this.radius = 5+Math.random()*25;
	},
	colorFigure: function(ctx) {
		var gradient = ctx.createRadialGradient(this.X+this.radius/4, this.Y-this.radius/6, this.radius/8, 
			this.X, this.Y, this.radius);
		gradient.addColorStop(0, '#fff');
		gradient.addColorStop(0.85, this.colFigure);
		return gradient;
	},
	draw : function(ctx) {
		ctx.fillStyle = this.colorFigure(ctx);
		ctx.beginPath();
		ctx.arc(this.X, this.Y, this.radius, 0, 2*Math.PI, false);
		ctx.closePath();
		ctx.fill();
	},
	boost: function(n) {
		this.radius += n / 16;
	}
});
Rect = new Class({
	Extends: Figure,
	name: 'rect',
	w: 0,
	h: 0,
	initialize: function(pX, pY) {
		this.w = 10+Math.random()*60;
		this.h = 10+Math.random()*60;
		this.parent(pX - this.w/2, pY - this.h/2);
	},
	colorFigure: function(ctx) {
		var gradient = ctx.createLinearGradient(this.X, this.Y, this.X + this.w, this.Y + this.h);
		gradient.addColorStop(1, this.colFigure);
		gradient.addColorStop(0, '#fff');
		return gradient;
	},
	draw: function(ctx) {
		ctx.fillStyle = this.colorFigure(ctx);
		ctx.beginPath();
		ctx.fillRect(this.X, this.Y, this.w, this.h); 
		ctx.closePath();
	},
	boost: function(n) {
		this.w += n / 8;
		this.h += n / 8;
	}
});
Star = new Class({
	Extends: Ball,
	tops: 4,
	initialize: function(pX, pY) {
		this.tops = Math.floor(Math.random()*5) + 4;
		this.parent(pX, pY);
	},
	colorFigure: function(ctx) {
		var gradient = ctx.createRadialGradient(this.X, this.Y, this.radius/9, this.X, this.Y, this.radius);
		gradient.addColorStop(0, '#fff');
		gradient.addColorStop(1, this.colFigure);
		return gradient;
	},
	draw: function(ctx) {
		ctx.fillStyle = this.colorFigure(ctx);

		var rot = Math.PI / 2 * 3;

		var x = this.X;
		var y = this.Y;
		var step = Math.PI / this.tops;

		ctx.beginPath();
		ctx.moveTo(this.X, this.Y - this.radius);
		for (let i = 0; i < this.tops; i++) {
			x = this.X + Math.cos(rot) * this.radius;
			y = this.Y + Math.sin(rot) * this.radius;
			ctx.lineTo(x, y);
			rot += step;

			x = this.X + Math.cos(rot) * this.radius / 2;
			y = this.Y + Math.sin(rot) * this.radius / 2;
			ctx.lineTo(x, y);
			rot += step;
		}
		ctx.lineTo(this.X, this.Y - this.radius);
		ctx.closePath();
		ctx.fill();
	},
});


function drawBack(ctx,col1,col2,w,h) {
	// закрашиваем канвас градиентным фоном
	ctx.save(); //Сохраняет текущее состояние стилей рисования, используя для этого стек
	var g = ctx.createLinearGradient(0,0,0,h); //Создает линейный градиент вдоль линии, задаваемой координатами
	g.addColorStop(1,col1); //опорные точки определяющие цвет //col1 - цвет, 0 - начало градиента, 1 - конец
	g.addColorStop(0,col2);
	ctx.fillStyle = g;
	ctx.fillRect(0,0,w,h);
	ctx.restore();
}
// инициализация работы
function init() {
	canvas = document.getElementById('canvas');
	if (canvas.getContext){
		ctx = canvas.getContext('2d'); //ctx - контекст
		//рисуем фон
		drawBack(ctx,'#202020','#aaa',canvas.width,canvas.height);
		//создаем 10 шариков, заноси их в массив и выводим на canvas
		figures = [];
		for (var i = 1; i<=10;i++) {
			// var item = new Rect(10+Math.random()*(canvas.width-30), 10+Math.random()*(canvas.height-30));
			var item;
			switch (Math.floor(Math.random() * 3)) {
				case (0):
				item = new Ball(10+Math.random()*(canvas.width-30), 10+Math.random()*(canvas.height-30));
				break;
				case (1):
				item = new Rect(10+Math.random()*(canvas.width-30), 10+Math.random()*(canvas.height-30));
				break;
				case (2):
				item = new Star(10+Math.random()*(canvas.width-30), 10+Math.random()*(canvas.height-30));
				break;
			}
			item.draw(ctx);
			figures.push(item);
		}
	}
}
// создаем новый шарик по щелчку мыши, добавляем его в массив шариков и рисуем его
function goInput(event) {
	var elem = canvas.getBoundingClientRect(); //координаты canvas, отностително окна

	var x = event.clientX - elem.x;
	var y = event.clientY - elem.y;
	// var item = new Ball(x,y);
	var item;
	switch (Math.floor(Math.random() * 3)) {
		case (0):
		item = new Ball(x, y);
		break;
		case (1):
		item = new Rect(x, y);
		break;
		case (2):
		item = new Star(x, y);
		break;
	}
	item.draw(ctx);
	figures.push(item);
}
function moveFigures() {
	//реализация движения шариков, находящихся в массиве figures
	drawBack(ctx,'#202020','#aaa',canvas.width,canvas.height);
	for (var i = 0; i < figures.length;i) {
		figures[i].move();
		figures[i].draw(ctx);
		if (isAbroad(figures[i]) || isCrossed(figures[i]) || isBig(figures[i])) 
			figures.splice(i,1);
		else 
			i++;
	}
}

//функции движения
function changeDirection(direction) {
	allOrientation = direction;
	for (let i of figures) {
		i.orientation = direction;
		i.speed = minSpeed;
	}
}
function allRandom() {
	allOrientation = 'random';
	for (let i of figures) {
		i.speed = minSpeed;
		let x = Math.floor(Math.random() * 4);
		switch (x) {
			case 0:
			i.orientation = 'up';
			break;
			case 1:
			i.orientation = 'right';
			break;
			case 2:
			i.orientation = 'down';
			break;
			case 3:
			i.orientation = 'left';
			break;
		}
	}
}
function allChaos() {
	allOrientation = 'chaos';
	for (let i of figures) {
		i.orientation = 'chaos';
		i.speed = minSpeed;
	}
}
function moveUp(figure) {
	figure.X = figure.X + (Math.random()*4-2);
	figure.Y = figure.Y + (Math.random()*2-figure.speed);
}
function moveDown(figure) {
	figure.X = figure.X + (Math.random()*4-2);
	figure.Y = figure.Y + (-Math.random()*2+figure.speed);
}
function moveRight(figure) {
	figure.X = figure.X + (-Math.random()*2+figure.speed);
	figure.Y = figure.Y + (Math.random()*4-2);
}
function moveLeft(figure) {
	figure.X = figure.X + (Math.random()*2-figure.speed);
	figure.Y = figure.Y + (Math.random()*4-2);
}
function moveChaos(figure) {
	let x = Math.floor(Math.random() * 4);
	figure.speed = minSpeed;
	switch (x) {
		case 0:
		moveUp(figure);
		break;
		case 1:
		moveDown(figure);
		break;
		case 2:
		moveRight(figure);
		break;
		case 3:
		moveLeft(figure);
		break;
	}
}


function isCrossed(figure) {
	for (let i of figures) {
		//ball && ball
		if (figure.name == 'circle' && i.name == "circle" && figure != i) {
			let s = Math.sqrt(Math.pow(i.X - figure.X, 2) + Math.pow(i.Y - figure.Y, 2));
			if (s < figure.radius + i.radius) {
				return true;
			}

			//rect && rect (line && line)
		} else if (figure.name == 'rect' && i.name == 'rect' && figure != i) {
			let linesI = getLines(i);
			let linesFigure = getLines(figure);

			for (let j = 0; j < linesFigure.length / 2; j++) {
				for (let k = 0; k < linesI.length / 2; k++) {
					if (isLineCrossed(linesFigure[j*2], linesFigure[j*2+1], linesI[k*2], linesI[k*2+1]))
						return true;
				}
			}

			if (isInside(figure, i))
				return true;
		} else if (figure.name != i.name && figure != i) {
			let ball = (figure.name == 'ball') ? figure : i;
			let f = (figure.name != 'ball') ? figure : i;

			let toUp = Math.abs(ball.Y - f.Y);
			let toFront = Math.abs(ball.X - f.X);
			let toDown = Math.abs(ball.Y - f.Y - f.h);
			let toBack = Math.abs(ball.X - f.X - f.w);

			if ((toUp < ball.radius && ball.X + ball.radius >= f.X && ball.X - ball.radius <= f.X + f.w) ||
				(toFront < ball.radius && ball.Y + ball.radius >= f.Y && ball.Y - ball.radius <= f.Y + f.h) ||
				(toDown < ball.radius && ball.X + ball.radius >= f.X && ball.X - ball.radius <= f.X + f.w) ||
				(toBack < ball.radius && ball.Y + ball.radius >= f.Y && ball.Y - ball.radius <= f.Y + f.h))
			{
				return true;
			}
			if (isInside(figure, i))
				return true;
		} 
	}
	return false;
}
//передаем координаты отрезков ввиде объектов с свойствами x, y
function isLineCrossed(a, b, c, d) {
	function area(X, Y, Z) {
		return (Y.x - X.x) * (Z.y - X.y) - (Y.y - X.y) * (Z.x - X.x);
	}
	function onLine(x1, x2, x3, x4) {
		if (x1 > x2) {
			let t = x1;
			x1 = x2;
			x2 = t;
		}
		if (x3 > x4) {
			let t = x3;
			x3 = x4;
			x4 = t;
		}
		return Math.max(x1, x3) <= Math.min(x2, x4);
	}
	return onLine(a.x, b.x, c.x, d.x) && onLine(a.y, b.y, c.y, d.y) && (area(a,b,c) * area(a,b,d) <= 0) && (area(c,d,a) * area(c,d,b) <= 0);
}
//возвращает массив линий объекта, линий - отрезок, обозначаемый 2-мя точками, с координатами x, y
function getLines(figure) {
	let lines = [];
	if (figure.name == 'rect') {
		let a = {
			x: figure.X,
			y: figure.Y,
		};
		let b = {
			x: figure.X + figure.w,
			y: figure.Y,
		};
		let c = {
			x: figure.X + figure.w,
			y: figure.Y + figure.h,
		};
		let d = {
			x: figure.X,
			y: figure.Y + figure.h,
		}

		lines.push(a);
		lines.push(b);

		lines.push(b);
		lines.push(c);

		lines.push(c);
		lines.push(d);

		lines.push(d);
		lines.push(a);
	}

	return lines;
}
// function isInside(f1, f2) {
// 	//f2 внутри f1
// 	if (f1.w > f2.w && f1.h > f2.h) {
// 		//преверяем a.x
// 		if (f1.X > f2.X)
// 			return false;
// 		//преверяем a.y
// 		if (f1.Y > f2.Y)
// 			return false;
// 		//преверяем c.x
// 		if (f1.X + f1.w < f2.X + f2.w)
// 			return false;
// 		//преверяем c.y
// 		if (f1.Y + f1.h < f2.Y + f2.h)
// 			return false;
// 		return true;
// 	}
// 	//f1 внутри f2
// 	if (f1.w < f2.w && f1.h < f2.h) {
// 		//преверяем a.x
// 		if (f1.X < f2.X)
// 			return false;
// 		//преверяем a.y
// 		if (f1.Y < f2.Y)
// 			return false;
// 		//преверяем c.x
// 		if (f1.X + f1.w > f2.X + f2.w)
// 			return false;
// 		//преверяем c.y
// 		if (f1.Y + f1.h > f2.Y + f2.h)
// 			return false;
// 		return true;
// 	}
// 	return false;
// }
function isInside(f1, f2) {
	let max = (f1.X > f2.X) ? f1 : f2;
	let min = (f1.X < f2.X) ? f1 : f2;

	if (min.name == 'circle')
		return false;

	if (max.Y > min.Y && max.X - min.X < min.w && max.Y - min.Y < min.h)
		return true;
	
	return false;
}

function isBig(figure) {
	if (figure.name == 'ball') {
		return figure.radius >= 55;
	}
	if (figure.name == 'rect') {
		return figure.w >= 110 || figure.h >= 110;
	}
	return false; //во избежание ошибок
}
function isAbroad(figure) {
	var x = figure.X > canvas.width || figure.X < 0 || figure.Y < 0 || figure.Y > canvas.height;
	return x;
}

function startMove() {
	clearInterval(idTimer);
	idTimer = setInterval('moveFigures();',50);
}