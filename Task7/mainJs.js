var canvas = document.getElementById('canvas'), ctx, gun, g = 10, idTimer;
var bullets = [], pause = true;
Gun = new Class({
	length: 40,
	corner: Math.PI / 4,
	color: 'black',

	initialize: function() {
		this.draw();
	},
	aim: function(pX, pY) {
		pX = Math.max(pX, 0);
		this.corner = Math.atan((canvas.height - pY) / pX);
	},
	draw: function() {
		ctx.fillStyle = this.color;
		ctx.lineWidth = 20;

		ctx.beginPath();
		ctx.moveTo(0, canvas.height);
		ctx.lineTo(this.length * Math.cos(this.corner), canvas.height - this.length * Math.sin(this.corner));
		ctx.stroke();
	},
});
Bullet = new Class({
	x: 0, 
	y: 0,
	aX: 0, 
	aY: 0,
	radius: 5,
	time: 0,
	speed: 0,
	corner: 0,
	initialize: function() {
		this.x = gun.length * Math.cos(gun.corner);
		this.y = canvas.height - gun.length * Math.sin(gun.corner);
		this.corner = gun.corner;

		this.aX = this.speed * Math.cos(this.corner);
		this.aY = this.speed * Math.sin(this.corner);
	},
	move: function() {
		this.time++;
		this.x += this.aX;
		this.y += -this.aY + g * this.time / 2;
	},
	draw: function() {
		ctx.fillStyle = this.color;
		ctx.beginPath();
		ctx.arc(this.x, this.y, this.radius, 0, 2*Math.PI, false);
		ctx.closePath();
		ctx.fill();
	},
});
Bullet1 = new Class({
	Extends: Bullet,
	color: 'green',
	speed: 66,
	damage: 1,
});
Bullet2 = new Class({
	Extends: Bullet,
	color: 'red',
	speed: 50,
	damage: 2,
});
function init() {
	canvas = document.getElementById('canvas');
	if (canvas.getContext) {
		ctx = canvas.getContext('2d');
		clearCanvas();
		gun = new Gun();

		startPlay();
	}
}
function clearCanvas() {
	ctx.save(); //Сохраняет текущее состояние стилей рисования, используя для этого стек
	var g = ctx.createLinearGradient(0, 0, 0, canvas.height); //Создает линейный градиент вдоль линии, задаваемой координатами
	g.addColorStop(1, '#87BCDE'); //опорные точки определяющие цвет //col1 - цвет, 0 - начало градиента, 1 - конец
	g.addColorStop(0, '#CAECF9');
	ctx.fillStyle = g;
	ctx.fillRect(0, 0, canvas.width, canvas.height);
	ctx.restore();
}
function mouseMove(event) {
	var elem = canvas.getBoundingClientRect();

	var x = event.clientX - elem.x;
	var y = event.clientY - elem.y;
	gun.aim(x, y);

	if (pause) {
		clearCanvas();
		for (let i of bullets)
			i.draw();
	}
	gun.draw();
}
function plaing() {
	clearCanvas();
	gun.draw();
	for (var i = 0; i < bullets.length; i) {
		bullets[i].move();
		bullets[i].draw();
		if (isAbroad(bullets[i])) {
			bullets.splice(i,1);
		}
		else 
			i++;
	}
}
function goInput(event) {
	if (event.which == 1)
		bullets.push(new Bullet1());
	else if (event.which == 3)
		bullets.push(new Bullet2());
}
function rightClick() {
	bullets.push(new Bullet2());
}
function isAbroad(shape) {
	var x = shape.x > canvas.width || shape.x < 0 || shape.y < 0 || shape.y > canvas.height;
	return x;
}

function startPlay() {
	clearInterval(idTimer);
	pause = false;
	idTimer = setInterval('plaing();', 50);
}
function stopPlay() {
	pause = true;
	clearInterval(idTimer);
}