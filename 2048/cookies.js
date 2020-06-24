var cookie = document.cookie; //выводит все куки этого сайта
//Значение document.cookie состоит из пар 'ключ=значение', разделённых ';'
document.cookie = "user=John"; // обновляем только куки с именем 'user'

// специальные символы (пробелы), требуется кодирование
//для правильного форматирования следует использовать встроенную функцию encodeURIComponent
var name = 'my name';
var value = 'John Smith';
document.cookie = encodeURIComponent(name) + '=' + encodeURIComponent(value);

//НАСТРОЙКИ COOKIES
//expires - Дата истечения срока действия куки, когда браузер удалит его автоматически.(без этого cookie удалиться при закрытии браузера)
var date = new Date(Date.now() + 86400e3); // +1 день от текущей даты
date = date.toUTCString(); //чтобы получить правильную дату
document.cookie = "user=John; expires=" + date;

//max-age - определяет срок действия куки в секундах с текущего момента
//604800 - количество секунд в неделе