var rusMonth_Rp = ["января", "февраля", "марта", "апреля", "мая", "июня", "июля", "августа", "сентября", "октября", "ноября", "декабря"];
var rusMonth_Ip = ["Январь", "Февраль", "Март", "Апрель", "Май", "Июнь", "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь"];
var curDate = new Date(), chosenItem, chosenDay = new Date();
var step = 0; //шаг в месяцах



$(document).ready(function(){
	makeDaysGrid();
	moveGrid(0);
	setInterval(showCurTime);


	$('.day').bind('click', function() {
		if (chosenItem)
			chosenItem.classList.remove('chosen');

		$(this).addClass('chosen');
		chosenItem = $(this)[0];

		var indent;
		if (chosenItem.classList.contains("passive")) {
			indent = (chosenItem.id.slice(1) < 6) ? -1 : 1;
		} else {
			indent = 0;
		}
		chosenDay = new Date();
		chosenDay.setDate(1);
		chosenDay.setMonth(chosenDay.getMonth() + step + indent);
		chosenDay.setDate(chosenItem.innerHTML);

		$('#inf').text(char2(chosenDay.getDate()) + '.' + char2(chosenDay.getMonth()+1) + '.' + chosenDay.getFullYear());
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
function redrawGrid(month) {
	var m = $('#month span').first();
	m.text(rusMonth_Ip[month.getMonth()] + " " + month.getFullYear());



	var days = $('.day');
	//день недели 1го числа месяца
	var start = (6 + month.getDay()) % 7;

	//заполнение дней этого месяца
	var daysInMonth = numberOfDays(month);
	for (var i = 0; i < daysInMonth; i++) {
		days[start + i].innerHTML = i + 1;
		days[start + i].classList.remove('passive');
		days[start + i].classList.remove('curDay');
		days[start + i].classList.remove('chosen');
	}

	//заполнение пустых дней впереди
	for (var i = start + daysInMonth; i < days.length; i++) {
		days[i].innerHTML = i - start - daysInMonth + 1;
		days[i].classList.add('passive');
	}
	//заполнение пустых дней сзади
	var dayInPreviousMonth = numberOfPreviousDays(month);
	for (var i = start - 1; i >= 0; i--) {
		days[i].innerHTML = dayInPreviousMonth;
		dayInPreviousMonth--;
		days[i].classList.add('passive');
	}

	//отмечаем текущий день
	if (month.getMonth() == curDate.getMonth() && month.getFullYear() == curDate.getFullYear())
		days[start + curDate.getDate() - 1].classList.add('curDay');

	//отмечеам выбранный день
	dayInPreviousMonth = numberOfPreviousDays(month);
	switch (chosenInGrid(month)) {
		//предыдущий месяц
		case -1:
		days[start - dayInPreviousMonth + chosenDay.getDate() - 1].classList.add('chosen');
		chosenItem = days[start - dayInPreviousMonth + chosenDay.getDate() - 1];
		break;

		//текущий месяц
		case 0:
		days[start + chosenDay.getDate() - 1].classList.add('chosen');
		chosenItem = days[start + chosenDay.getDate() - 1];
		break;

		//следующий месяц
		case 1:
		days[start + daysInMonth + chosenDay.getDate() - 1].classList.add('chosen');
		chosenItem = days[start + daysInMonth + chosenDay.getDate() - 1];

	}
}


function moveGrid(a) {
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
function toChosen() {
	step = chosenDay.getMonth() - curDate.getMonth() + 12 * (chosenDay.getFullYear() - curDate.getFullYear());

	var buff = new Date(chosenDay);
	buff.setDate(1);

	redrawGrid(buff);
}
function chosenInGrid(month) {
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
