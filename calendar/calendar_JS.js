var rusMonth_Rp = ["января", "февраля", "марта", "апреля", "мая", "июня", "июля", "августа", "сентября", "октября", "ноября", "декабря"];
var rusMonth_Ip = ["Январь", "Февраль", "Март", "Апрель", "Май", "Июнь", "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь"];
var curDate = new Date(), chosenItem, chosenDay = new Date();
var step = 0; //шаг в месяцах


$(document).ready(function(){
	makeDaysGrid();
	moveGrid(0);
	showNoteChosenItem();
	setInterval(showCurTime);


	$('.day').bind('click', function() {
		saveNote(chosenDay);

		if (chosenItem)
			chosenItem.removeClass('chosen');

		$(this).addClass('chosen');
		chosenItem = $(this);

		var indent; //если chosenDay в этом месяце - 0, в прошлом - -1, в слудующем - 1
		if (chosenItem.hasClass("passive")) {
			indent = (chosenItem.attr('id').slice(1) < 6) ? -1 : 1;
		} else {
			indent = 0;
		}
		chosenDay = new Date();
		chosenDay.setDate(1);
		chosenDay.setMonth(chosenDay.getMonth() + step + indent);
		chosenDay.setDate(chosenItem.text());

		$('#inf').text(char2(chosenDay.getDate()) + '.' + char2(chosenDay.getMonth()+1) + '.' + chosenDay.getFullYear());
		showNoteChosenItem();
	});
});


function showCurTime() {
	var item = $('#curTime');
	var date = new Date();

	var seconds = char2(date.getSeconds().toString());
	var minutes = char2(date.getMinutes().toString());

	item.text(`${date.getHours()}:${minutes}:${seconds}`);

	showCurDate();
	curDate = new Date();
}
function showCurDate() {
	var item = $('#curDate');
	var date = new Date();
	item.text(`${date.getDate()} ${rusMonth_Rp[date.getMonth()]} ${date.getFullYear()} г.`);
}
function makeDaysGrid() {
	var grid = $('#grid');
	grid.empty();

	for (var i = 0; i < 6; i++) {
		let row = $('<div class="row"></div>');
		for (var j = 0; j < 7; j++) {
			if (j < 5)
				$(`<div id="_${i*7 + j}" class="day">1</div>`).appendTo(row);
			else
				$(`<div id="_${i*7 + j}" class="day weekend">1</div>`).appendTo(row);
		}
		row.appendTo(grid);
	}
}
function clearGrid() {
	var days = $('.day');

	for (var i = 0; i < 42; i++) {
		days.eq(i).removeClass('passive');
		days.eq(i).removeClass('curDay');
		days.eq(i).removeClass('chosen');
		days.eq(i).removeClass('note');
	}
}
function redrawGrid(month) {
	var m = $('#month span').first();
	m.text(rusMonth_Ip[month.getMonth()] + " " + month.getFullYear());
	clearGrid();


	var days = $('.day');
	//день недели 1го числа месяца
	var start = (6 + month.getDay()) % 7;

	//заполнение дней этого месяца
	var daysInMonth = numberOfDays(month);
	for (var i = 0; i < daysInMonth; i++) {
		days.eq(start + i).text(i + 1);
	}

	//заполнение пустых дней впереди
	for (var i = start + daysInMonth; i < days.length; i++) {
		days.eq(i).text(i - start - daysInMonth + 1);
		days.eq(i).addClass('passive');
	}
	//заполнение пустых дней сзади
	var dayInPreviousMonth = numberOfPreviousDays(month);
	for (var i = start - 1; i >= 0; i--) {
		days.eq(i).text(dayInPreviousMonth);
		days.eq(i).addClass('passive');
		dayInPreviousMonth--;
	}

	//отмечаем текущий день
	if (month.getMonth() == curDate.getMonth() && month.getFullYear() == curDate.getFullYear())
		days.eq(start + curDate.getDate() - 1).addClass('curDay');

	//отмечеам выбранный день
	dayInPreviousMonth = numberOfPreviousDays(month);
	switch (isChosenDateInGrid(month)) {
		//предыдущий месяц
		case -1:
		days.eq(start - dayInPreviousMonth + chosenDay.getDate() - 1).addClass('chosen');
		chosenItem = days.eq(start - dayInPreviousMonth + chosenDay.getDate() - 1);
		break;

		//текущий месяц
		case 0:
		days.eq(start + chosenDay.getDate() - 1).addClass('chosen');
		chosenItem = days.eq(start + chosenDay.getDate() - 1);
		break;

		//следующий месяц
		case 1:
		days.eq(start + daysInMonth + chosenDay.getDate() - 1).addClass('chosen');
		chosenItem = days.eq(start + daysInMonth + chosenDay.getDate() - 1);
	}

	showMonthNotes();
}


function moveGrid(a) {
	saveNote(chosenDay);

	step += a;

	var buff = new Date();
	buff.setDate(1);
	buff.setMonth(buff.getMonth() + step);

	redrawGrid(buff);
}
function toNowadays() {
	step = 0;
	var buff = new Date();
	buff.setDate(1);

	redrawGrid(buff);
}
function toChosenDate() {
	step = chosenDay.getMonth() - curDate.getMonth() + 12 * (chosenDay.getFullYear() - curDate.getFullYear());

	var buff = new Date(chosenDay);
	buff.setDate(1);

	redrawGrid(buff);
}
function isChosenDateInGrid(month) {
	var buff = new Date(month);
	buff.setDate(1);

	var firstDay = new Date(month);
	firstDay.setDate(1);
	var start = (6 + firstDay.getDay()) % 7;

	//часть предыдущего месяца
	buff.setMonth(month.getMonth() - 1);
	if (chosenDay.getFullYear() == buff.getFullYear() && chosenDay.getMonth() == buff.getMonth()) {
		if (numberOfDays(buff) - start + 1 <= chosenDay.getDate() && chosenDay.getDate() <= numberOfDays(buff))
			return -1;
	}

	//текущий месяц
	buff.setMonth(month.getMonth());
	if (chosenDay.getFullYear() == buff.getFullYear() && chosenDay.getMonth() == buff.getMonth())
		return 0;

	//часть следующего месяца
	buff.setMonth(month.getMonth() + 1);
	if (chosenDay.getFullYear() == buff.getFullYear() && chosenDay.getMonth() == buff.getMonth()) {
		if (chosenDay.getDate() <= 42 - start - numberOfDays(month))
			return 1;
	}

	return 2;
}


//возвращает число дней в этом месяце
function numberOfDays(month) {
	var buff = new Date(month);
	buff.setMonth(buff.getMonth() + 1, 0);
	return buff.getDate();
}
//возвращает число дней в предыдущем месяце
function numberOfPreviousDays(month) {
	var buff = new Date(month);
	buff.setDate(0);
	return buff.getDate();
}
//возвращает строку длиной 2 (при необходимости вставляет 0 вперед)
function char2(str) {
	str = str.toString();
	str = (str.length == 2) ? str : '0' + str;
	return str;
}



var Notes = [
{
	day: '26.5.2020',
	text: 'first note',
},
{
	day: '24.5.2020',
	text: 'test note',
}
];

//показывет точки на сетке
function showMonthNotes(month) {
	var days = $('.day');
	for (var i = 0; i < 42; i++) {
		var d = getDateFromCell(days.eq(i));
		addNoteToCell(d, days.eq(i));
	}
}

//показывает заметку выбранного дня
function showNoteChosenItem() {
	var textarea = $('#note');
	if (chosenItem.hasClass('note')) {
		for (var i of Notes) {
			if (i.day == `${chosenDay.getDate()}.${chosenDay.getMonth()}.${chosenDay.getFullYear()}`) {
				textarea.prop('value', i.text);
				return;
			}
		}
	} else {
		textarea.prop('value', '');
	}
}

//добавляет "точку" к ячейке
function addNoteToCell(date, cell) {
	for (var i of Notes) {
		if (i.day == `${date.getDate()}.${date.getMonth()}.${date.getFullYear()}`) {
			cell.addClass('note');
			return;
		}
	}
}

function saveNote(date) {
	var textarea = $('#note');
	if (textarea.prop('value').length > 0) {
		//изменение существующей заметки
		for (var i of Notes) {
			if (i.day == `${date.getDate()}.${date.getMonth()}.${date.getFullYear()}`) {
				i.text = textarea.prop('value');
				return;
			}
		}

		//добавление новой заметки
		Notes.push({
			day: `${date.getDate()}.${date.getMonth()}.${date.getFullYear()}`,
			text: textarea.prop('value'),
		});
		getCellFromDate(date).addClass('note');
	} else {
		//удаление заметки
		var cell = getCellFromDate(date);
		cell.removeClass('note');

		for (var i = 0; i < Notes.length; i++) {
			if (Notes[i].date == `${date.getDate()}.${date.getMonth()}.${date.getFullYear()}`) {
				Notes.splice(i,1);
				return;
			}
		}
	}
}

function getDateFromCell(cell) {
	var month = new Date();
	month.setDate(1);
	month.setMonth(month.getMonth() + step);

	var start = (6 + month.getDay()) % 7;
	var n = Number(cell.attr('id').slice(1));

	//предыдущий месяц
	if (n < start) {
		month.setMonth(month.getMonth() - 1);
		month.setDate(numberOfDays(month) - start + n + 1);

		return month;
	}

	//показанный месяц
	if (n >= start && n < start + numberOfDays(month)) {
		month.setDate(n - start + 1);
		return month;
	}

	//слудеющий месяц
	if (n >= start + numberOfDays(month)) {
		month.setDate(n - start + 1);
		return month;
	}
}
function getCellFromDate(date) {
	var days = $('.day');

	var buff = new Date(date);
	buff.setDate(1);
	var start = (6 + buff.getDay()) % 7;

	return days.eq(start + date.getDate() - 1);
}
