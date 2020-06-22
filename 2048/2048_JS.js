var fieldSize = 4;
var colors = ['#', '#eee4da', '#ede0c8', '#f2b179', '#f59563', '#f67c5f', '#f65e3b', '#edcf72', '#edcc61', '#edc850', '#edc53f', '#edc22e'];
var numbers = [], isChanged = [];

function init() {
	numbers = [];
	makeTable();

	insertNumber();
	insertNumber();

	showTable();
}
function makeTable() {
	$('div .row').remove();

	var table = $('#playingField')[0];
	$('#playingField')[0].style.width = `${54 * fieldSize}px`;
	for (let i = 0; i < fieldSize; i++) {
		let row = $('<div class="row"></div>');
		row.appendTo(table);
		for (let j = 0; j < fieldSize; j++) {
			$('<div class="item"></div>').appendTo(row);
		}
	}


	for (let i = 0; i < fieldSize; i++) {
		let n = [];
		for (let j = 0; j < fieldSize; j++)
			n.push(0);
		numbers.push(n);
	}
}
function reSize() {
	var sizeSelect = $('#sizes')[0];
	fieldSize = Number(sizeSelect.options[sizeSelect.selectedIndex].value);

	$('#playingField')[0].style.width = `${54 * fieldSize}px`;
	$('#header')[0].style.width = `${54 * fieldSize}px`;
	$('#footer')[0].style.width = `${54 * fieldSize}px`;

	init();
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
				items[fieldSize * i + j].style.background = colors[Math.log2(numbers[i][j])];
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
}


function moveUp() {
	clearIsChanged();

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

						//верхняя клетка равна данной и не изменялась на этом шаге
					} else if (numbers[j - 1][i] == numbers[j][i] && !isChanged[j - 1][i] && !isChanged[j][i]) {
						numbers[j - 1][i] += numbers[j][i];
						numbers[j][i] = 0;
						flag = true;

						isChanged[j - 1][i] = true;
					}
				}
			}
			showTable();
		} while (flag);
	}
	showTable();
}
function moveDown() {
	clearIsChanged();

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

						//верхняя клетка равна данной и не изменялась на этом шаге
					} else if (numbers[j + 1][i] == numbers[j][i] && !isChanged[j + 1][i] && !isChanged[j][i]) {
						numbers[j + 1][i] += numbers[j][i];
						numbers[j][i] = 0;
						flag = true;

						isChanged[j + 1][i] = true;
					}
				}
			}
			showTable();
		} while (flag);
	}
	showTable();
}
function moveRight() {
	clearIsChanged();

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

						//верхняя клетка равна данной и не изменялась на этом шаге
					} else if (numbers[i][j + 1] == numbers[i][j] && !isChanged[i][j + 1] && !isChanged[i][j]) {
						numbers[i][j + 1] += numbers[i][j];
						numbers[i][j] = 0;
						flag = true;

						isChanged[i][j + 1] = true;
					}
				}
			}
			showTable();
		} while (flag);
	}
	showTable();
}
function moveLeft() {
	clearIsChanged();

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

						//верхняя клетка равна данной и не изменялась на этом шаге
					} else if (numbers[i][j - 1] == numbers[i][j] && !isChanged[i][j - 1] && !isChanged[i][j]) {
						numbers[i][j - 1] += numbers[i][j];
						numbers[i][j] = 0;
						flag = true;

						isChanged[i][j - 1] = true;
					}
				}
			}
			showTable();
		} while (flag);
	}
	showTable();
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




document.addEventListener('keydown', function(event) {
	switch (event.code) {
		case 'ArrowDown':
		moveDown();
		break;
		case 'ArrowLeft':
		moveLeft();
		break;
		case 'ArrowRight':
		moveRight();
		break;
		case 'ArrowUp':
		moveUp();
		break;

		case 'KeyA':
		moveLeft();
		break;
		case 'KeyS':
		moveDown();
		break;
		case 'KeyD':
		moveRight();
		break;
		case 'KeyW':
		moveUp();
		break;
		default:
		return;
	}
	insertNumber();
	showTable();
});