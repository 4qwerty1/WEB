var date = new Date(); //объект Date с текущими датой и временем
//date = new Date(milliseconds) //объект Date с временем, равным количеству миллисекунд, прошедших с 1 января 1970
//date = new Date(datestring) //Алгоритм разбора – такой же, как в Date.parse
//date = new Date(year, month, date, hours, minutes, seconds, ms)

//ПОЛУЧЕНИЕ ДАТЫ
date.getFullYear(); //год - 4 цифры
date.getMonth(); // от 0 до 11
date.getDate(); //день месяца, от 1 до 31
date.getHours();
date.getMinutes();
date.getSeconds();
date.getMilliseconds();
date.getDay(); //Вернуть день недели от 0 (воскресенье) до 6 (суббота).
date.getTime(); //возвращает таймстамп
date.getTimezoneOffset(); //Возвращает разницу в минутах между местным часовым поясом и UTC
Date.now(); //возвращает текущую метку времени

//УСТАНОВКА ДАТЫ 
date.setFullYear(year, [month], [date]);
date.setMonth(month, [date]); 
date.setDate(date); //(У всех этих методов, кроме setTime(), есть UTC-вариант, например: setUTCHours().)
date.setHours(hour, [min], [sec], [ms]);
date.setMinutes(min, [sec], [ms]);
date.setSeconds(sec, [ms]);
date.setMilliseconds(ms);
date.setTime(milliseconds);

//!даты можно вычитать, в результате получаем разность в миллисекундах

//DATE.PARSE
var str = 'YYYY-MM-DDTHH:mm:ss.sssZ';
date = Date.parse(str); //считывает дату из строки, возвращает таймстамп

