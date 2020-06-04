// // var el = document.getElementById("myid");
// // el.ClassName = 

// // document.getElementByName("div");
window.document.write('<h1>Hello, world!</h1>');
res = window.confirm('ДА или НЕТ');  //выводит окно с вопросом, результат - true или false
console.log('res = ' + res);
 
res = window.prompt("title", "default"); //выводит окно с заголовком title, полем для ввода текста, заполненным строкой по умолчанию default
console.log('res = ' + res); //возвращает введенную строку или null


// alert("Hello, world"); //сообщение во всплывающем окне
// console.log("Hello, world") //вывод сообщения в консоль

//ПЕРЕМЕННЫЕ
//var - для объявления переменной (a-z, A-Z, 0-9, $, _), вида везде, аже до объявления
//let - для объявления переменной видимой в рамках блока {...}, в котором объявлена (локальные переменные)
//const - 
var message;
var myMessege = "Сообщение";
let variable = 12;

//в переменные можно помещать:
var myNumber = 10; //-10; 10.3
var myString = "Message"; //можно использовать одинарные кавычки
var myBoolean = true;
var myNull = null;
var myUndefined = undefined; //отсутствует какое-либо значение
var myObject = { //{} - создание объекта
name: "Ivan", 
age: 25
};
var myArr = [myNumber, myString, myBoolean, myNull, myUndefined, myObject, [1, 2, 3]];


//ЧИСЛА
console.log(Math.round(myNumber)); //округление числа
console.log(Math.ceil(5.4)); //округление в большую сторону
console.log(Math.floor(5.4));  //округление в меньшую сторону

var newNumber = 2.437;
console.log(newNumber.toFixed(1)); //округление до 1 знака после запятой


//СТРОКИ
console.log('40' + myNumber); //произойдет конкатенация строк
console.log(myString.toLowerCase()); //все буквы в строке - в нижнем регистре (.toUpperCase)


//МАССИВЫ
var names = ['Ivan', 'Andrew', 'Hello', 1, false]; // [] - создают массив
console.log(names[4]);
names.push([1, 2, 3]);
console.log(names[5]);
names.length - длина массива


//УСЛОВИЯ
if ("5" == 5) { //условие истинно (т.к. е обращается нимание на типы)
	console.log("Условие 1");
}
//=== - строгое равно, на ответ влияет тип оъектов ('5' === 5 - false)
//!== - строгие не равно
//&& - логическое 'и'
//|| - лигоческое "или"
if ("ivan" == "petia") {
	console.log("Условие 2");
} else{

}


//ЦИКЛЫ
for (var i = 0; i < 10; i++) {
	console.log(i);
}


// //ФУНКЦИИ
function test() {
	console.log("function test");
}
//function declaration - предпочтительно
function sum(x, y) {
	return x + y;
}
var sum = function(a, b) {
	return a + b;
}
sum(1, 3);

var Alert = [];
for (let i = 0; i < 10; i++) {
	a.push(function() {
		alert(i);
	})
}
Alert[3]();

var userName = 'Ivan';
function showMessage() {
	var message = 'Hello, my name is ' + userName; //можно использовать внешии переменные
	alert(message); 
}
showMessage(); //Hello, my name is Ivan


//ОБЪЕКТЫ
var object = {
	name: "Ivan",
	surname: "Ivanov",
	age: 25,

	getFullName: function() {
		return this.name + " " + this.surname;
	}
}
object.name = "Petia";
console.log(object.getFullName());


//ОБЪЕКТЫ - встроенные, браузера, пользовательские

//ВСТРОЕННЫЕ ОБЪЕКТЫ
Array //для работы с массивами
Date //для работы с датой и временем
	today = new Date(); //Дата представляет число миллисекунд, прошедших с 1 января 1970 года
	today = new Date('Jan 1 2020 00:00:01'); //1 сутки = 86 400 000 миллисекунд
	today = new Date(2020, 11, 31);
	//МЕТОДЫ
	today.setDay(1); //день недели (число от 0 до 6) от 'воскресенья' до 'субботы'
	today.setDate(31); //день (число от 1 до 31)
	today.setMonth(0); //месяц (число от 0 до 11)
	today.setTime(); //время в милисекундах

	today.getDay();
	today.getDate();
	today.getMonth();
	today.getYear();
	today.getTime();
String //для работы со строками
	//СВОЙСТВО
	length
	//МЕТОДЫ
	charAt(); //возвращает символ, находящийся в указанной позиции
	indexOf(); //возвращает позицию подстроки в строке, -1, если подстрока не найдена
	//и т.д.
Math //для выполнения математических функций
	pow(2, 53); //2 в степени 53 (можно дробные степени)
	round(); //математическое округление
	ceil(); //округление вверх
	floor(); //округление вниз
	abs(); 
	max(); //можно несколько элементов
	random(); //случайное число 0 <= x <= 1
	sqrt();
RegExp //для работы с регулярными выражениями
console //для отладки программного кода

//ОБЪЕКТЫ БРАУЗЕРА
window //для работы с окном браузера
document //для работы с html документами
history //для работы с историей

// //ПРАКТИКА
