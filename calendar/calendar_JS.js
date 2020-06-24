var rusMonth_Rp = ["января", "февраля", "марта", "апреля", "мая", "июня", "июля", "августа", "сентября", "октября", "ноября", "декабря"];
var rusMonth_Ip = ["январь", "февраль", "март", "апрель", "май", "июнь", "июль", "август", "сентябрь", "октябрь", "ноябрь", "декабрь"];
var curTime, chosenItem;

$(document).ready(function(){
	setInterval(showTime);


	function showTime() {
		var item = $('#time');
		curTime = new Date();

		var seconds = curTime.getSeconds().toString();
		seconds = (seconds.length == 2) ? seconds : '0' + seconds;

		var minutes = curTime.getMinutes().toString();
		minutes = (minutes.length == 2) ? minutes : '0' + minutes;

		item.text(`${curTime.getHours()}:${minutes}:${seconds}`);

		showDate();
	}
	function showDate() {
		var item = $('#date');

		//24 июня 2020 г.
		item.text(`${curTime.getDate()} ${rusMonth_Rp[curTime.getMonth()]} ${curTime.getFullYear()} г.`);
	}

	$('.day').bind('click', function() {
		if (chosenItem)
			chosenItem.removeClass('chosen');

		$(this).addClass('chosen');
		chosenItem = $(this);
	});
});