var canvas, ctx, gun;
Shape = new Class({
	x: 0,
	y: 0,
	speed: 0,
	iniinitialize: function (pX, pY) {},
	draw: function() {},
});
Gun = new Class({
	length: 40,
	corner: Math.PI / 4,
	color: 'black',

	initialize: function() {
		this.draw();
	},
	aim: function(pX, pY) {
		pX = Math.max(pX, 0);
		this.corner = Math.atan((canvas.height - pY) / pX);
		drawBack();
		this.draw();
	},
	draw: function() {
		ctx.fillStyle = this.color;
		ctx.lineWidth = 20;

		ctx.beginPath();
		ctx.moveTo(0, canvas.height);
		ctx.lineTo(this.length * Math.cos(this.corner), canvas.height - this.length * Math.sin(this.corner));
		ctx.stroke();
	},
});
function init() {
	canvas = document.getElementById('canvas');
	if (canvas.getContext) {
		ctx = canvas.getContext('2d');
		drawBack();
		gun = new Gun();
	}
}
function drawBack() {
	ctx.save(); //Сохраняет текущее состояние стилей рисования, используя для этого стек
	var g = ctx.createLinearGradient(0, 0, 0, canvas.height); //Создает линейный градиент вдоль линии, задаваемой координатами
	g.addColorStop(1, '#87BCDE'); //опорные точки определяющие цвет //col1 - цвет, 0 - начало градиента, 1 - конец
	g.addColorStop(0, '#CAECF9');
	ctx.fillStyle = g;
	ctx.fillRect(0, 0, canvas.width, canvas.height);
	ctx.restore();
}
function mouseMove(event) {
	var elem = canvas.getBoundingClientRect();

	var x = event.clientX - elem.x;
	var y = event.clientY - elem.y;
	gun.aim(x, y);
}