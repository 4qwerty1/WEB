var canvas = document.getElementById('canvas');
var ctx;
var gun;
var g = 10;
var idTimer;
var enemiesTimer;
var enemies = [];
var bullets = [];
var pause = true;
var gameOver = false;
var level = 1;
var maxEnemesInTime = 10;
var countEn = 0;
var maxLevel = 10;
var shotTB1 = Date.now();
var shotTB2 = Date.now();
var reloadB1 = 100;
var reloadB2 = 100;
var userHealth = 3;
var userName;
var score = 0;
var players = [];
var Player = null;

//images
var alienSprites = [];
for (let i = 0; i < 4; i++) {
	let en = new Image();
	en.src = `alien_sprites/_${i + 1}.png`;
	alienSprites.push(en)
}
var planeSprites = [];
for (let i = 0; i < 3; i++) {
	let en = new Image();
	en.src = `plane_sprites/_${i + 1}.png`;
	planeSprites.push(en);
}
var back = new Image();
back.src = 'background.jpg';



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


		// //отрисовка промежутков
		// ctx.beginPath();
		// ctx.fillStyle = 'black';
		// ctx.moveTo(this.lastX, this.lastY);
		// ctx.lineTo(this.x, this.y);
		// ctx.closePath();
		// ctx.stroke();

		// //отрисовка области попадания
		// let rect = {
		// 	x: Math.min(this.x, this.lastX), 
		// 	y: Math.min(this.y, this.lastY),
		// 	width: Math.max(this.x, this.lastX) - Math.min(this.x, this.lastX),
		// 	height: Math.max(this.y, this.lastY) - Math.min(this.y, this.lastY),
		// };
		// ctx.beginPath();
		// ctx.fillStyle = 'red';
		// ctx.strokeRect(rect.x, rect.y, rect.width, rect.height);
		// ctx.closePath();

		// //отрисовка промежуточных состояний пули
		// ctx.beginPath();
		// ctx.fillStyle = 'blue';
		// let count = Math.round(Math.max(rect.width, rect.height) / this.radius);
		// for (let i = 1; i < count; i++) {
		// 	let m = (this.y - this.lastY > 0) ? -1 : 1;
		// 	let bX = rect.x + i * rect.width / count; //координата x на отрезке
		// 	let bY = rect.y + rect.height * (1/2 + m/2);
		// 	bY -= m * rect.height / rect.width * i * rect.width / count; //y = x * tg(algha)
		// 	ctx.arc(bX, bY, this.radius, 0, 2*Math.PI, false);
		// }
		// ctx.closePath();
		// ctx.fill();
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
	width: 0,
	height: 0,
	maxHealth: 0,
	speed: 1,
	
	health: 0,
	img: null,
	initialize: function(type) {
		//type == 1 - слабые, type == 2 - сильные
		this.width = 30 + Math.random() * 40;
		this.height = this.width;

		this.x = canvas.width - 10;
		this.y = 30 + Math.random() * (canvas.height - 65 - this.width);

		if (type == 1)
			this.img = planeSprites[Math.floor(Math.random() * planeSprites.length)];
		else
			this.img = alienSprites[Math.floor(Math.random() * alienSprites.length)];

		this.health = type + Math.floor(level / 2);
		this.maxHealth = this.health;

		this.speed = (type == 1) ? 2 : 1;
	},
	move: function() {
		this.x -= this.speed + level;
	},
	draw: function() {
		ctx.drawImage(this.img, this.x, this.y, this.width, this.width);
	}
});

function init() {
	canvas = document.getElementById('canvas');
	if (canvas.getContext) {
		ctx = canvas.getContext('2d');
		clearCanvas();
		gun = new Gun();

		changePlayer();
		startPlay();
	}
}
function clearCanvas() {
	ctx.save(); //Сохраняет текущее состояние стилей рисования, используя для этого стек
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	ctx.drawImage(back, 0, 0);
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
	showUserHealth();
	for (var i = 0; i < bullets.length; i) {
		bullets[i].move();
		// bullets[i].draw();
		if (isAbroad(bullets[i]) || Hit(bullets[i])) {
			bullets.splice(i,1);
		}
		else {
			bullets[i].draw();
			i++;
		}
	}

	for (var i = 0; i < enemies.length; i) {
		if (enemies[i].health <= 0) {
			scoreUp(enemies[i]);
			enemies.splice(i,1);

		} else if (isAbroad(enemies[i])) {
			userHealth = Math.max(0, userHealth - 1);
			enemies.splice(i, 1);

		} else {
			enemies[i].move();
			enemies[i].draw();
			i++;
		}
	}	
}
function createEnemeis() {
	let chanse = Math.floor( Math.random() * Math.min(6 + level, maxEnemesInTime));
	if (chanse >= 4) {
		let x = 1 + Math.floor( Math.random() * (2 + level));
		for (let i = 0; i < x; i++) {
			countEn++;
			enemies.push(new Enemy(1 + Math.floor(Math.random() * 2)));
		}
	}
	levelUp();
}
function levelUp() {
	level = Math.min(1 + Math.floor(countEn / 30), maxLevel);
	document.getElementById('level').innerHTML = level;
	document.getElementById('enemies').innerHTML = countEn;
}
function scoreUp(enemy) {
	if (enemy && enemy.health <= 0) {
		score += enemy.maxHealth;

		Player.value = score;
		rewriteResultTable();
	}
	document.getElementById('score').innerHTML = score;
}
function reloadBullets() {
	let x = document.getElementById('bullet1');
	reloadB1 = Math.min(100, reloadB1 + Math.round((Date.now() - shotTB1) / 10));
	x.innerHTML = (reloadB1 == 100) ? 'READY' : reloadB1;

	x = document.getElementById('bullet2');
	reloadB2 = Math.min(100, reloadB2 + Math.round((Date.now() - shotTB2) / 100));
	x.innerHTML = (reloadB2 == 100) ? 'READY' : reloadB2;
}

var heartbeat = 0;
function showUserHealth() {
	let size = 20;
	let step = 5;
	let indent = (size + step) * userHealth;

	heartbeat = (userHealth == 1) ? (heartbeat + 1) % 11 : 0;
	size -= heartbeat;
	for (let i = 0; i < userHealth; i++) {
		if (userHealth == 1)
			drawHeart(canvas.width - indent - size/2 + step*3/2, step * 3 - size/2, size);
		else
			drawHeart(canvas.width - indent, step, size);
		indent -= step + size;
	}

	if (userHealth == 0) {
		endGame();
	}
}
function drawHeart(x, y, width) {
	ctx.save();
	ctx.beginPath();

	ctx.strokeStyle = "black";
	ctx.lineWidth = 3;
	ctx.fillStyle = "red";	
	

	ctx.moveTo(x, y + width / 4);
	ctx.quadraticCurveTo(x, y, x + width / 4, y);
	ctx.quadraticCurveTo(x + width / 2, y, x + width / 2, y + width / 4);
	ctx.quadraticCurveTo(x + width / 2, y, x + width * 3/4, y);
	ctx.quadraticCurveTo(x + width, y, x + width, y + width / 4);
	ctx.quadraticCurveTo(x + width, y + width / 2, x + width * 3/4, y + width * 3/4);
	ctx.lineTo(x + width / 2, y + width);
	ctx.lineTo(x + width / 4, y + width * 3/4);
	ctx.quadraticCurveTo(x, y + width / 2, x, y + width / 4);
	ctx.stroke();
	ctx.fill();

	ctx.closePath();
	ctx.restore();
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
		if (crossRectRect(enemy, rect) || crossBallRect(bullet, enemy)) {
			let count = Math.round(Math.max(rect.width, rect.height) / bullet.radius / 2);
			for (let i = 1; i < count; i++) {
				let m = (bullet.y - bullet.lastY > 0) ? -1 : 1; //летит вверх или вниз
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
		if (reloadB1 == 100 && !pause) {
			shotTB1 = Date.now();
			reloadB1 = 0;
			// bullets.push(new Bullet1());
			bullets.push(new Bullet1());
		}
	}
	// else if (event.which == 3) {
	// 	if (reloadB2 == 100 && !pause) {
	// 		shotTB2 = Date.now();
	// 		reloadB2 = 0;
	// 		bullets.push(new Bullet2());
	// 	}
	// }
}
function rightClick() {
	if (reloadB2 == 100) {
		shotTB2 = Date.now();
		reloadB2 = 0;
		bullets.push(new Bullet2());
	}
}
function startPlay() {
	if (gameOver)
		Player.value = 0;

	removeGameOverScreen();

	clearInterval(idTimer);
	clearInterval(enemiesTimer);
	pause = false;
	idTimer = setInterval('reloadWindow();', 50);
	enemiesTimer = setInterval('createEnemeis();', 1000);

	rewriteResultTable();
}
function stopPlay() {
	pause = true;
	clearInterval(idTimer);
	clearInterval(enemiesTimer);
}
function clearWindow() {
	enemies = [];
	bullets = [];
	level = 1;
	countEn = 0;
	reloadB1 = 100;
	reloadB2 = 100;
	userHealth = 3;
	score = 0;
	levelUp();
	scoreUp();
	reloadWindow();
}




function endGame() {
	stopPlay();
	showGameOverScreen();

	clearWindow();

	setLocalStorage();
	// Player.value = 0;
}
function restart() {
	clearWindow();
	Player.value = 0;

	startPlay();
}
function changePlayer() {
	userName = '';
	while (!userName)
		userName = prompt("Введите ваше имя:", 'Tom');

	if (Player)
		setLocalStorage();

	players = [];
	Player = null;
	clearWindow();
	getLocalStorage();
	rewriteResultTable();

	startPlay();
}
function showGameOverScreen() {
	var screen = document.getElementById('pauseScreen');
	screen.style.display = '';

	gameOver = true;
}
function removeGameOverScreen() {
	var screen = document.getElementById('pauseScreen');
	screen.style.display = 'none';

	gameOver = false;
}




function getLocalStorage() {
	for (let i = 0; i < localStorage.length; i++) {
		let player = {};
		player.name = localStorage.key(i);
		player.value = Number(localStorage.getItem(player.name));

		players.push(player);

		if (player.name == userName) {
			Player = player;
			Player.value = 0;
		}
	}

	if (Player == null) {
		Player = {};
		Player.name = userName;
		Player.value = 0;

		players.push(Player);
	}
}
function setLocalStorage() {

	localStorage.setItem(Player.name, Player.value);
}
function rewriteResultTable() {
	players.sort((a, b) => b.value - a.value);

	document.getElementById('results').remove();

	var table = document.createElement('table');
	table.setAttribute('id', 'results');
	for (let i of players) {
		var tr = document.createElement('tr');
		table.appendChild(tr);

		var th = document.createElement('th');
		tr.appendChild(th);
		th.innerHTML = i.name;

		var td = document.createElement('td');
		tr.appendChild(td);
		td.innerHTML = i.value;

		if (i == Player) {
			tr.style.backgroundColor = '#CAECF9';
		}
	}

	document.body.insertBefore(table, document.getElementById('buttons'));
}
