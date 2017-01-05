/**

* ----- Merely-js-engine -----
* https://merelygames.ru
* Copyright Merely Games 2016-2017
* programmer: Rodion Kraynov - rodion_kraynov@mail.ru

**/

"use strict";

window.onerror = function (a, b, c) {
	alert("[MerelyJS - engine]Error - " + a + ", " + b + ", " + c);
};

var MerelyJS = {
	width: 0,
	height: 0,

	version: "v-0.2.1",

	mouseX: 0,
	mouseY: 0,
	click: false,

	display: null,
	ctx: null,

	newDisplay: function (width, height, bgColor) {
		let _canvas = document.createElement("canvas");
		_canvas.width = width; _canvas.height = height;
		this.width = width;
		this.height = height;
		_canvas.style.background = bgColor;
		_canvas.style.position = "absolute";
		_canvas.style.top = 0;
		_canvas.style.left = 0;
		_canvas.innerHTML = "You dont support canvas or javascript! Ваш браузер не поддерживает canvas или javascript!";
		document.body.appendChild(_canvas);

		let _ctx2D = _canvas.getContext("2d");
		this.ctx = _ctx2D;

		display = {
			canvas: _canvas,
			ctx2D: _ctx2D,

			haveLoop: false,

			setPosition: function (x, y) {
				this.canvas.style.top = y + "px"
				this.canvas.style.left = x + "px";
			},

			setSize: function (width, height) {
				this.canvas.width = width;
				this.canvas.height = height;
			},

			clear: function () {
				this.ctx2D.clearRect(0, 0, this.width, this.height);
			}
		}

		return display;
	},

	newLoop: function (func, dis) {
		if(!dis.haveLoop) setInterval(func, 1000/60);
		dis.haveLoop = true;
	},

	drawElements: {
		drawRect: function(x, y, width, height, color, alpha, dis) {
			let ctx = dis.ctx2D;

			ctx.save();

			ctx.fillStyle = color;
			ctx.globalAlpha = alpha;
			ctx.fillRect(x, y, width, height);

			ctx.restore();
		},

		drawBox: function(x, y, width, height, color, dis) {
			let ctx = dis.ctx2D;

			ctx.save();

			ctx.strokeStyle = color;
			ctx.strokeRect(x, y, width, height);

			ctx.restore();
		},

		drawImage: function(img, x, y, width, height, dis) {
			let ctx = dis.ctx2D;

			ctx.save();

			ctx.drawImage(img, x, y, width, height);

			ctx.restore();
		}
	},

	spriteObjs: {
		buttonSprite: function (path, x, y, width, height, action) {
			var _img = new Image();
			_img.src = path;

			var _draw = function(dis) {
				let ctx = dis.ctx2D;

				ctx.save();

				ctx.drawImage(_img, this.x, this.y, this.width, this.height);

				if(MerelyJS.click) {
					if(MerelyJS.mouseX >= x && MerelyJS.mouseX <= x + width && MerelyJS.mouseY >= y && MerelyJS.mouseY <= y + height) {
						action();
					}
				}

				ctx.restore();
			}

			let sprite = {
				x: x,
				y: y,
				width: width,
				height: height,
				img: _img,
				draw: _draw
			}

			return sprite;
		},

		bgSprite: function (path, repeat) {
			var _img = new Image();
			_img.src = path;

			var _draw;

			if(!repeat) {
				_draw = function(dis) {
					let ctx = dis.ctx2D;

				    ctx.save();

				    ctx.drawImage(_img, 0, 0, MerelyJS.width, MerelyJS.height);

				    ctx.restore();
				}
			}

			let sprite = {
				img: _img,
				draw: _draw
			}

			return sprite;
		}
	}
}

window.addEventListener("click", function (e) {
	MerelyJS.mouseY = e.pageY;
	MerelyJS.mouseX = e.pageX;
	MerelyJS.click = true;
	setTimeout(function (){MerelyJS.click = false;}, 1000/60);
}, false);
