// var el = document.getElementById("myid");
// el.ClassName = 

// document.getElementByName("div");

//alert("Hello, world"); //сообщение во всплывающем окне
console.log("Hello, world") //вывод сообщения в консоль
//ПЕРЕМЕННЫЕ
//var - для объявления переменной (a-z, A-Z, 0-9, $, _)
var message;
var myMessege = "Сообщение";

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


// //ЧИСЛА
// console.log(Math.round(myNumber)); //округление числа
// console.log(Math.ceil(5.4)); //округление в большую сторону
// console.log(Math.floor(5.4));  //округление в меньшую сторону

// var newNumber = 2.437;
// console.log(newNumber.toFixed(1)); //округление до 1 знака после запятой


//СТРОКИ
// console.log('40' + myNumber); //произойдет конкатенация строк
// console.log(myString.toLowerCase()); //все буквы в строке - в нижнем регистре (.toUpperCase)


//МАССИВЫ
// var names = ['Ivan', 'Andrew', 'Hello', 1, false]; // [] - создают массив
// console.log(names[4]);
// names.push([1, 2, 3]);
// console.log(names[5]);
// names.length - длина массива


//УСЛОВИЯ
// if ("5" == 5) { //условие истинно (т.к. е обращается нимание на типы)
// 	console.log("Условие 1");
// }
// //=== - строгое равно, на ответ влияет тип оъектов ('5' === 5 - false)
// //!== - строгие не равно
// //&& - логическое 'и'
// //|| - лигоческое "или"
// if ("ivan" == "petia") {
// 	console.log("Условие 2");
// } else{

// }


//ЦИКЛЫ
// for (var i = 0; i < 10; i++) {
// 	//console.log(i);
// }


//ФУНКЦИИ
// function test() {
// 	console.log("function test");
// }
// function sum(x, y) {
// 	return x + y;
// }

// test();


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