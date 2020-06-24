var fieldSize = 4, score = 0, bestScore = 0;
var colors = ['#', '#eee4da', '#ede0c8', '#f2b179', '#f59563', '#f67c5f', '#f65e3b', '#edcf72', '#edcc61', '#edc850', '#edc53f', '#edc22e'];
var numbers = [], isChanged = [], isGameOver = false;


function init() {
	makeTable();
	getLocalStorage();

	if (isNumbersEmpty()) {
		insertNumber();
		insertNumber();
	}

	showTable();
}
function restart() {
	score = 0;
	createEmptyNumbers();
	setLocalStorage();

	deleteMSG();
	init();
}
function reSize() {
	if (isGameOver) {
		restart();
	} else {
		setLocalStorage();
	}
	

	var sizeSelect = $('#sizes')[0];
	fieldSize = Number(sizeSelect.options[sizeSelect.selectedIndex].value);

	$('#playingField').css('width', `${54 * fieldSize}px`);
	$('#header').css('width', `${54 * fieldSize}px`);
	$('#footer').css('width', `${54 * fieldSize}px`);

	init();
}
function gameOver() {
	isGameOver = true;

	var field = $('#playingField')[0];
	var msg = $('<div id="gameOver" class="gameOver"><div>Game over!</div></div>');
	msg.css('width', `${field.clientWidth}px`);
	msg.css('height', `${field.clientWidth}px`);
	msg.appendTo(field);

	msg.css('margin-left', `${(window.innerWidth - field.clientWidth) / 2}px`);
	msg.css('margin-right', `${(window.innerWidth - field.clientWidth) / 2}px`);
}


function makeTable() {
	$('div .row').remove();

	var table = $('#playingField');
	table.css('width', `${54 * fieldSize}px`);
	for (let i = 0; i < fieldSize; i++) {
		let row = $('<div class="row"></div>');
		row.appendTo(table);
		for (let j = 0; j < fieldSize; j++) {
			$('<div class="item"></div>').appendTo(row);
		}
	}
}
function insertNumber() {
	var flag = false;
	while (!flag) {
		let i = Math.floor(Math.random() * fieldSize);
		let j = Math.floor(Math.random() * fieldSize);

		if (numbers[i][j] == 0) {
			numbers[i][j] = Math.random() < 0.9 ? 2 : 4;
			flag = true;
		}
	}
}
function showTable() {
	var items = $('.item');
	for (let i = 0; i < fieldSize; i++) {
		for (let j = 0; j < fieldSize; j++) {
			if (numbers[i][j] > 0) {
				items[fieldSize * i + j].innerHTML = numbers[i][j];
				items[fieldSize * i + j].style.background = `${colors[Math.log2(numbers[i][j])]}`;
			} else {
				items[fieldSize * i + j].innerHTML = '';
				items[fieldSize * i + j].style.background = '';
			}

			if (numbers[i][j] >= 8)
				items[fieldSize * i + j].style.color = '#f9f6f2';
			else
				items[fieldSize * i + j].style.color = '';
		}
	}
	$('#score span')[0].innerHTML = score;
	$('#bestScore span')[0].innerHTML = bestScore;
}
function isCanMove() {
	for (var i = 0; i < fieldSize; i++) {
		for (var j = 0; j < fieldSize; j++) {
			//up
			if (i - 1 >= 0 && (numbers[i][j] == numbers[i - 1][j] || numbers[i - 1][j] == 0))
				return true;
			//right
			if (j + 1 < fieldSize && (numbers[i][j] == numbers[i][j + 1] || numbers[i][j + 1] == 0))
				return true;
			//down
			if (i + 1 < fieldSize && (numbers[i][j] == numbers[i + 1][j] || numbers[i + 1][j] == 0))
				return true;
			//left
			if (j - 1 >= 0 && (numbers[i][j] == numbers[i][j - 1] || numbers[i][j - 1] == 0))
				return true;
		}
	}
	return false;
}
function createEmptyNumbers() {
	numbers = [];
	for (var i = 0; i < fieldSize; i++) {
		let n = [];
		for (var j = 0; j < fieldSize; j++)
			n.push(0);
		numbers.push(n);
	}
}
function isNumbersEmpty() {
	for (var i = 0; i < fieldSize; i++) {
		for (var j = 0; j < fieldSize; j++) {
			if (numbers[i][j] > 0) 
				return false;
		}
	}
	return true;
}


function moveUp() {
	clearIsChanged();

	var change = false;
	for (let i = 0; i < fieldSize; i++) {
		var flag;
		do {
			flag = false;
			for (let j = 1; j < fieldSize; j++) {
				if (numbers[j][i] > 0) {
					//верхняя клетка пуста
					if (numbers[j - 1][i] == 0) {
						numbers[j - 1][i] += numbers[j][i];
						numbers[j][i] = 0;
						flag = true;

						change = true;

						//верхняя клетка равна данной и не изменялась на этом шаге
					} else if (numbers[j - 1][i] == numbers[j][i] && !isChanged[j - 1][i] && !isChanged[j][i]) {
						numbers[j - 1][i] += numbers[j][i];
						numbers[j][i] = 0;
						flag = true;
						change = true;

						isChanged[j - 1][i] = true;
						scoreUp(numbers[j - 1][i]);
					}
				}
			}
			showTable();
		} while (flag);
	}
	showTable();
	return change;
}
function moveDown() {
	clearIsChanged();

	var change = false;
	for (let i = 0; i < fieldSize; i++) {
		var flag;
		do {
			flag = false;
			for (let j = fieldSize - 2; j >= 0; j--) {
				if (numbers[j][i] > 0) {
					//верхняя клетка пуста
					if (numbers[j + 1][i] == 0) {
						numbers[j + 1][i] += numbers[j][i];
						numbers[j][i] = 0;
						flag = true;

						change = true;

						//верхняя клетка равна данной и не изменялась на этом шаге
					} else if (numbers[j + 1][i] == numbers[j][i] && !isChanged[j + 1][i] && !isChanged[j][i]) {
						numbers[j + 1][i] += numbers[j][i];
						numbers[j][i] = 0;
						flag = true;
						change = true;

						isChanged[j + 1][i] = true;
						scoreUp(numbers[j + 1][i]);
					}
				}
			}
			showTable();
		} while (flag);
	}
	showTable();
	return change;
}
function moveRight() {
	clearIsChanged();

	var change = false;
	for (let i = 0; i < fieldSize; i++) {
		var flag;
		do {
			flag = false;
			for (let j = fieldSize - 2; j >= 0; j--) {
				if (numbers[i][j] > 0) {
					//верхняя клетка пуста
					if (numbers[i][j + 1] == 0) {
						numbers[i][j + 1] += numbers[i][j];
						numbers[i][j] = 0;
						flag = true;

						change = true;

						//верхняя клетка равна данной и не изменялась на этом шаге
					} else if (numbers[i][j + 1] == numbers[i][j] && !isChanged[i][j + 1] && !isChanged[i][j]) {
						numbers[i][j + 1] += numbers[i][j];
						numbers[i][j] = 0;
						flag = true;
						change = true;

						isChanged[i][j + 1] = true;
						scoreUp(numbers[i][j + 1]);
					}
				}
			}
			showTable();
		} while (flag);
	}
	showTable();
	return change;
}
function moveLeft() {
	clearIsChanged();

	var change = false;
	for (let i = 0; i < fieldSize; i++) {
		var flag;
		do {
			flag = false;
			for (let j = 1; j < fieldSize; j++) {
				if (numbers[i][j] > 0) {
					//верхняя клетка пуста
					if (numbers[i][j - 1] == 0) {
						numbers[i][j - 1] += numbers[i][j];
						numbers[i][j] = 0;
						flag = true;

						change = true;

						//верхняя клетка равна данной и не изменялась на этом шаге
					} else if (numbers[i][j - 1] == numbers[i][j] && !isChanged[i][j - 1] && !isChanged[i][j]) {
						numbers[i][j - 1] += numbers[i][j];
						numbers[i][j] = 0;
						flag = true;
						change = true;

						isChanged[i][j - 1] = true;
						scoreUp(numbers[i][j - 1]);
					}
				}
			}
			showTable();
		} while (flag);
	}
	showTable();
	return change;
}
function clearIsChanged() {
	isChanged = [];

	for (let i = 0; i < fieldSize; i++) {
		let c = [];
		for (let j = 0; j < fieldSize; j++)
			c.push(false);
		isChanged.push(c);
	}
}


function scoreUp(x) {
	score += x;
	bestScore = Math.max(score, bestScore);
}
function deleteMSG() {
	if (isGameOver)
		$('#gameOver').remove();
	isGameOver = false;
}


document.addEventListener('keydown', function(event) {
	if (isGameOver)
		return;

	var change;
	switch (event.code) {
		case 'ArrowDown':
		change = moveDown();
		break;
		case 'ArrowLeft':
		change = moveLeft();
		break;
		case 'ArrowRight':
		change = moveRight();
		break;
		case 'ArrowUp':
		change = moveUp();
		break;

		case 'KeyA':
		change = moveLeft();
		break;
		case 'KeyS':
		change = moveDown();
		break;
		case 'KeyD':
		change = moveRight();
		break;
		case 'KeyW':
		change = moveUp();
		break;
		default:
		return;
	}
	if (change) {
		insertNumber();
		showTable();
	}
	if (!isCanMove()) {
		gameOver();
	}
});
function windowResize() {
	if (isGameOver) {
		deleteMSG();
		gameOver();
	}
}
function getLocalStorage() {
	score = localStorage.getItem('score' + fieldSize);
	score = (score == undefined) ? 0 : Number(score);

	bestScore = localStorage.getItem('bestScore' + fieldSize);
	bestScore = (bestScore == undefined) ? 0 : Number(bestScore);

	var str = localStorage.getItem('numbers' + fieldSize);
	parseNumbers(str);
}
function setLocalStorage() {
	localStorage.setItem('bestScore' + fieldSize, bestScore);
	localStorage.setItem('score' + fieldSize, score);
	localStorage.setItem('numbers' + fieldSize, numbers);
}
function parseNumbers(str) {
	if (!str) {
		score = 0;
		createEmptyNumbers();
		return;
	}

	numbers = [];
	var buff = str.split(',');
	for (let i = 0; i < fieldSize; i++) {
		let n = [];
		for (let j = 0; j < fieldSize; j++)
			n.push(Number(buff[i * fieldSize + j]));
		numbers.push(n);
	}
}