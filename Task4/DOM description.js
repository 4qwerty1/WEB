//Доступ к DOM начинается с объекта document. Из него можно добраться до любых узлов.
document
document.documentElement
document.body

//между узлами можно переходить с помощью основных ссылок
parentNode //parentElementNode
previousSibling //предыдущий родственный узел
nextSibling //следующий родственный узел
firstChild
lastChild   //Некоторые браузеры трактуют символы пробелов и переходы на новую строку как текстовые узлы
childNodes[i];


//методы получения DOM элементов
.getElementById;
.getElementsByTagName;
.getElementsByName;
.getElementsByClassName;
.querySelector;
.querySelectorAll;

//свойства узлов
.nodeType //тип узла
.nodeName //имя тега
.tagName  //имя тэга, только для узлов (не для текста)
innerTEXT //текст элемента без тегов HTML
outerTEXT //текст элемента без тегов HTML
innerHTML //содержит текст и HTML-элементы для данного тега (html-содержимое узла в виде строки)
outerHTML //содержит текст и HTML-элементы для данного и вложенных тегов (html-узел целиком)


					//РЕДАКТИРОВАНИЕ ДЕРЕВА
//УЗЛЫ
createElement() //создание нового узла-элемента
createTextNode() //создание нового узла-текста
appendChild() //добавление узла в конец коллекции childNodes узла, для которого метод был вызван
insertBefore() //добавление узла с возможностью указания места, куда вставляется новый узел
removeChild() //удаление потомка узла, для которого метод был вызван
remove() //удаление узла из документа

//АТРИБУТЫ УЗЛОВ
createAttribute() //создает новый атрибут узла
setAttribute() //присваивает значение атрибуту
removeAttribute() //удаляет атрибут
getAttribute() //возвращает текущее значение атрибута
replaceChild() //заменяет узел
replaceWith() //заменяет node заданными узлами или строками.

						//СОБЫТИЯ
//МЫШЬ
click //происходит, когда кликнули на элемент левой кнопкой мыши
contextmenu //происходит, когда кликнули на элемент правой кнопкой мыши
mouseover //возникает, когда на элемент наводится мышь
mousedown и mouseup //когда кнопку мыши нажали или отжали
mousemove //при движении мыши

//ЭЛЕМЕНТ УПРАВЛЕНИЯ
submit //посетитель отправил форму <form>
focus //посетитель фокусируется на элементе, например нажимает на <input>

//КЛАВИАТУРА
keydown //когда посетитель нажимает клавишу
keyup //когда посетитель отпускает клавишу

//ДОКУМЕНТ
DOMContentLoaded //когда HTML загружен и обработан, DOM документа полностью построен и доступен.

//ОБРАБОТЧИК СОБЫТИЯ - функция, которая сработает, как только событие произошло. Его можно назначить 3мя способами:
//1 ЧЕРЕЗ АТРИБУТ HTML
<input value="Нажми меня" onclick="alert('Клик!')" type="button">
<input value="Нажми меня" onclick="someFunction()" type="button">

//2 ЧЕРЕЗ СВОЙСТВА DOM-ОБЪЕКТА
<input id="elem" type="button" value="Нажми меня" />
<script> 
elem.onclick = function() {
	alert( 'Спасибо' );
};
</script>/

//3 ЧЕРЕЗ addEventListener
<input id="elem" type="button" value="Нажми меня"/>
<script>
	function handler1() { alert('Спасибо!'); };
	function handler2() { alert('Спасибо ещё раз!'); }
	elem.onclick = function() { alert("Привет"); };
	elem.addEventListener("click", handler1);
	elem.addEventListener("click", handler2);
</script>/

function addHandler(obj, msg) {
	function say() {
		alert(msg)
	}
	obj.addEventListener(’click’, say);
}


				//ОБЪЕКТ СОБЫТИЯ
//Когда происходит событие, браузер создаёт объект события,
//записывает в него детали и передаёт его в качестве аргумента функции-обработчику
elem.onclick = function(event) {}
