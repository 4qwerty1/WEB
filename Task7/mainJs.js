var canvas = document.getElementById('canvas'), ctx, gun, g = 10, idTimer, enemiesTimer, enemies = [];
var bullets = [], pause = true, level = 1, maxEnemesInTime = 10, countEn = 1, maxLevel = 10;
var shotTB1 = Date.now(), shotTB2 = Date.now(), reloadB1 = 100, reloadB2 = 100;
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

		ctx.lineWidth = 1;
	},
});

Bullet = new Class({
	x: 0, 
	y: 0,
	aX: 0, 
	aY: 0,
	radius: 8,
	time: 0,
	speed: 0,
	corner: 0,
	
	lastX: 0,
	lastY: 0,
	initialize: function() {
		this.x = gun.length * Math.cos(gun.corner);
		this.y = canvas.height - gun.length * Math.sin(gun.corner);
		this.corner = gun.corner;

		this.aX = this.speed * Math.cos(this.corner);
		this.aY = this.speed * Math.sin(this.corner);
	},
	move: function() {
		this.lastX = this.x;
		this.lastY = this.y;

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


		//отрисовка промежутков
		ctx.beginPath();
		ctx.fillStyle = 'black';
		ctx.moveTo(this.lastX, this.lastY);
		ctx.lineTo(this.x, this.y);
		ctx.closePath();
		ctx.stroke();

		//отрисовка области попадания
		let rect = {
			x: Math.min(this.x, this.lastX), 
			y: Math.min(this.y, this.lastY),
			width: Math.max(this.x, this.lastX) - Math.min(this.x, this.lastX),
			height: Math.max(this.y, this.lastY) - Math.min(this.y, this.lastY),
		};
		ctx.beginPath();
		ctx.fillStyle = 'red';
		ctx.strokeRect(rect.x, rect.y, rect.width, rect.height);
		ctx.closePath();

		//отрисовка промежуточных состояний пули
		ctx.beginPath();
		ctx.fillStyle = 'blue';
		let count = Math.round(Math.max(rect.width, rect.height) / this.radius);
		for (let i = 1; i < count; i++) {
			let m = (this.y - this.lastY > 0) ? -1 : 1;
			let bX = rect.x + i * rect.width / count; //координата x на отрезке
			let bY = rect.y + rect.height * (1/2 + m/2);
			bY -= m * rect.height / rect.width * i * rect.width / count; //y = x * tg(algha)
			ctx.arc(bX, bY, this.radius, 0, 2*Math.PI, false);
		}
		ctx.closePath();
		ctx.fill();
	},
});
Bullet1 = new Class({
	Extends: Bullet,
	color: 'green',
	speed: 68,
	damage: 1,
});
Bullet2 = new Class({
	Extends: Bullet,
	color: 'red',
	speed: 55,
	damage: 2,
});

Enemy = new Class({
	x: 0,
	y: 0,
	color: "rgb(0,0,0)",
	initialize: function() {
		this.x = canvas.width - 1;
		this.y = 20 + Math.random() * (canvas.height - 50);
		this.color = 'rgb('+Math.floor(Math.random()*256)+','+Math.floor(Math.random()*256)+','+Math.floor(Math.random()*256)+')';
		// this.speed = this.speed + level;
	},
	move: function() {
		this.x -= this.speed + level;
	},
});
Ball = new Class({
	Extends: Enemy,
	speed: 2,
	radius: 0,
	health: 0,
	name: 'ball',
	initialize: function() {
		this.parent();
		this.radius = 15 + Math.random() * 20;
		this.health += Math.floor(level / 2);
	},
	draw: function () {
		ctx.beginPath();
		ctx.fillStyle = this.color;
		ctx.arc(this.x, this.y, this.radius, 0, 2*Math.PI, false);
		ctx.fill();
		ctx.fillStyle = 'black';
		ctx.stroke();
		ctx.closePath();
	}
});
Rect = new Class({
	Extends: Enemy,
	speed: 1,
	widht: 0,
	height: 0,
	health: 1,
	name: 'rect',
	initialize: function() {
		this.parent();
		this.width = 30 + Math.random() * 40;
		this.height = this.width;
		this.health += level;
	},
	draw: function() {
		ctx.beginPath();
		ctx.fillStyle = this.color;
		ctx.fillRect(this.x, this.y, this.width, this.width);
		ctx.fillStyle = 'black';
		ctx.strokeRect(this.x, this.y, this.width, this.width);
		ctx.closePath();
	}
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
	if (canvas) {
		var elem = canvas.getBoundingClientRect();

		var x = event.clientX - elem.x;
		var y = event.clientY - elem.y;
		gun.aim(x, y);
	}
}
function reloadWindow() {
	clearCanvas();
	gun.draw();
	reloadBullets();
	for (var i = 0; i < bullets.length; i) {
		bullets[i].move();
		bullets[i].draw();
		if (isAbroad(bullets[i]) || Hit(bullets[i])) {
			bullets.splice(i,1);
		}
		else {
			// bullets[i].draw();
			i++;
		}
	}

	for (var i = 0; i < enemies.length; i) {
		if (isAbroad(enemies[i]) || enemies[i].health <= 0) {
			enemies.splice(i,1);
		}
		else {
			enemies[i].move();
			enemies[i].draw();
			i++;
		}
	}	
}
function createEnemes() {
	levelUp();
	let chanse = Math.floor( Math.random() * Math.min(6 + level, maxEnemesInTime));
	if (chanse >= 4) {
		for (let i = 0; i < Math.floor( Math.random() * (2 + level)); i++) {
			countEn++;
			switch(Math.floor(Math.random() * 2)) {
				case (0):
				enemies.push(new Ball());
				break;
				case (1):
				enemies.push(new Rect());
				break;
			}

		}
	}
}
function levelUp() {
	level = 1 + Math.floor(countEn / 30);
	document.getElementById('level').innerHTML = level;
	document.getElementById('enemies').innerHTML = countEn;
}
function reloadBullets() {
	let x = document.getElementById('bullet1');
	reloadB1 = Math.min(100, reloadB1 + Math.round((Date.now() - shotTB1) / 10));
	x.innerHTML = (reloadB1 == 100) ? 'READY' : reloadB1;

	x = document.getElementById('bullet2');
	reloadB2 = Math.min(100, reloadB2 + Math.round((Date.now() - shotTB2) / 100));
	x.innerHTML = (reloadB2 == 100) ? 'READY' : reloadB2;
}	



function isAbroad(shape) {
	var x = shape.x > canvas.width || shape.x < 0 || shape.y < 0 || shape.y > canvas.height;
	return x;
}
function Hit(bullet) {
	let rect = {
		x: Math.min(bullet.x, bullet.lastX), 
		y: Math.min(bullet.y, bullet.lastY),
		width: Math.max(bullet.x, bullet.lastX) - Math.min(bullet.x, bullet.lastX),
		height: Math.max(bullet.y, bullet.lastY) - Math.min(bullet.y, bullet.lastY),
	};

	for (let enemy of enemies) {
		// enemy.draw();
		if (enemy.name == 'ball') {
			if (crossBallRect(enemy, rect)) {
				let count = Math.round(Math.max(rect.width, rect.height) / bullet.radius);
				for (let i = 1; i < count; i++) {
					let m = (bullet.y - bullet.lastY > 0) ? -1 : 1;
					let bX = rect.x + i * rect.width / count; //координата x на отрезке
					let bY = rect.y + rect.height * (1/2 + m/2);
					bY -= m * rect.height / rect.width * i * rect.width / count; //y = x * tg(algha)

					let tmpBullet = {
						x: bX,
						y: bY,
						radius: bullet.radius,
					};
					if (crossBallBall(enemy, tmpBullet)){
						enemy.health -= bullet.damage;
						return true;
					}
				}
			}
		} else {
			if (crossRectRect(enemy, rect) || crossBallRect(bullet, enemy)) {
				let count = Math.round(Math.max(rect.width, rect.height) / bullet.radius / 2);
				for (let i = 1; i < count; i++) {
					let m = (bullet.y - bullet.lastY > 0) ? -1 : 1;
					let bX = rect.x + i * rect.width / count; //координата x на отрезке
					let bY = rect.y + rect.height * (1/2 + m/2);
					bY -= m * rect.height / rect.width * i * rect.width / count; //y = x * tg(algha)

					let tmpBullet = {
						x: bX,
						y: bY,
						radius: bullet.radius,
					};
					if (crossBallRect(tmpBullet, enemy)){
						enemy.health -= bullet.damage;
						return true;
					}
				}
				if (crossBallRect(bullet, enemy)) {
					enemy.health -= bullet.damage;
					return true;
				}
			}
		}
	}
	return false;
}
function crossBallBall(f1, f2) {
	let s = Math.sqrt(Math.pow(f1.x - f2.x, 2) + Math.pow(f1.y - f2.y, 2));
	if (s < f2.radius + f1.radius) 
		return true;
	return false;
}
function crossBallRect(ball, rect) {
	let toUp = Math.abs(ball.y - rect.y);
	let toFront = Math.abs(ball.x - rect.x);
	let toDown = Math.abs(ball.y - rect.y - rect.width);
	let toBack = Math.abs(ball.x - rect.x - rect.width);

	if ((toUp < ball.radius && ball.x + ball.radius >= rect.x && ball.x - ball.radius <= rect.x + rect.width) ||
		(toFront < ball.radius && ball.y + ball.radius >= rect.y && ball.y - ball.radius <= rect.y + rect.height) ||
		(toDown < ball.radius && ball.x + ball.radius >= rect.x && ball.x - ball.radius <= rect.x + rect.width) ||
		(toBack < ball.radius && ball.y + ball.radius >= rect.y && ball.y - ball.radius <= rect.y + rect.height))
	{
		return true;
	}
	return false;
}
function crossRectRect(f1, f2) {
	let linesF1 = getLines(f1);
	let linesF2 = getLines(f2);

	for (let j = 0; j < linesF2.length / 2; j++) {
		for (let k = 0; k < linesF1.length / 2; k++) {
			if (isLineCrossed(linesF2[j*2], linesF2[j*2+1], linesF1[k*2], linesF1[k*2+1])) {
				return true;
			}
		}
	}
	if (isInside(f1, f2))
		return true;

	return false;
}
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
function getLines(f) {
	let lines = [];
	
	let a = {
		x: f.x,
		y: f.y,
	};
	let b = {
		x: f.x + f.width,
		y: f.y,
	};
	let c = {
		x: f.x + f.width,
		y: f.y + f.height,
	};
	let d = {
		x: f.x,
		y: f.y + f.height,
	}

	lines.push(a);
	lines.push(b);

	lines.push(b);
	lines.push(c);

	lines.push(c);
	lines.push(d);

	lines.push(d);
	lines.push(a);

	return lines;
}
function isInside(f1, f2) {
	let max = (f1.x > f2.x) ? f1 : f2;
	let min = (f1.x < f2.x) ? f1 : f2;

	if (min.name == 'ball')
		return false;

	if (max.y > min.y && max.x - min.x < min.width && max.y - min.y < min.height)
		return true;
	
	return false;
}





function goInput(event) {
	if (event.which == 1) {
		if (reloadB1 == 100) {
			shotTB1 = Date.now();
			reloadB1 = 0;
			bullets.push(new Bullet1());
		}
	}
	else if (event.which == 3) {
		if (reloadB2 == 100) {
			shotTB2 = Date.now();
			reloadB2 = 0;
			bullets.push(new Bullet2());
		}
	}
}
function rightClick() {
	if (reloadB2 == 100) {
		shotTB2 = Date.now();
		reloadB2 = 0;
		bullets.push(new Bullet2());
	}
}
function startPlay() {
	clearInterval(idTimer);
	pause = false;
	idTimer = setInterval('reloadWindow();', 50);
	enemiesTimer = setInterval('createEnemes();', 1000);

}
function stopPlay() {
	pause = true;
	clearInterval(idTimer);
	clearInterval(enemiesTimer);
}