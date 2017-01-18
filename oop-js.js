
"use strict";

;function MerelyJS() {
	this._canvas_ = null;
	this._ctx2D_  = null;
	this._numLoops_ = 0;
	this._width_ = 0;
	this._height_ = 0;
	this._fps_ = 60;

	var _this = this;
	var version = "v. 0.0.2";

	var loadedRes = 0, totalRes = 0;

	var numObjs = 0;

	var timeLine = 0;

	// ----------- Display -----------
	this.Display = function (width, height, bg) {
		var canvas = document.createElement("canvas");
		var meta   = document.createElement("meta");
		meta.name  = "viewport";
		meta.content = "width=device-width,user-scalable=no";

		canvas.width = width; canvas.height = height;
		canvas.style.background = bg;
		document.body.style.margin = "0";
		canvas.innerHTML = "You dont support canvas or javascript! Ваш браузер не поддерживает canvas или javascript!";
		document.body.appendChild(canvas);
		document.head.appendChild(meta);

		this._width_ = width;
		this._height_ = height;

		this._canvas_ = canvas;
		this._ctx2D_ = canvas.getContext("2d");

		var dis = {
			clearDisplay: function () {
			    _this._ctx2D_.clearRect(0, 0, _this._width_, _this._height_);
		    },

		    width: _this._width_,
		    height: _this._height_,
		    bg: bg
	    }

		console.log("[MerelyJS] *** Canvas и ctx2D инициализированы! Display, MerelyJS готовы к работе! ***");

		return dis;
	}

	// ----------- Game Loop -----------
	this.GameLoop = function (func, fps) {
		var time = new Date, lastTime = 0, newFps = 0;
		if(typeof(fps) != "Number") {
			var loop = function () {
				lastTime = new Date;
				newFps = Math.round(1000/(lastTime - time));
				time = lastTime;
				if(timeLine >= 20) {
				    _this._fps_ = newFps;
				    if(_this._fps_ > 60) _this._fps_ = 60;
				    timeLine = 0;
			    }

				func();

				timeLine++;
				requestAnimationFrame(loop, _this._canvas_);
			}
			requestAnimationFrame(loop, _this._canvas_);
			_this._fps_ = 60;
		}else {
			setInterval(func, 1000/fps);
			_this._fps_ = fps;
		}

		console.log("[MerelyJS] Игровой цикл с id " + this._numLoops_ + " - запущен!");
		this._numLoops_++;
	}

	// ----------- Draw Elements -----------
	this.DrawElements = function () {
		var ctx = this._ctx2D_;

		var drEl = {
			drawRect: function (x, y, w, h, color, alpha) {
				ctx.save();

				ctx.fillStyle = color;
				ctx.globalAlpha = alpha;
				ctx.fillRect(x, y, w, h);

				ctx.restore();
			},

			drawText: function (text, x, y, font, color, align, alpha) {
				ctx.save();

				ctx.fillStyle = color;
				ctx.globalAlpha = alpha;
				ctx.font = font;
				ctx.textBaseline = align;
				ctx.textAlign = align;
				ctx.fillText(text, x, y);

				ctx.restore();
			},

			drawImage(img, x, y, w, h, alpha) {
				ctx.save();

				ctx.globalAlpha = alpha;
				ctx.drawImage(img, x, y, w, h);

				ctx.restore();
			}
		}

		return drEl;
	},

	this.CreateGameObject = function(x, y, w, h, src, alpha, data) {
		var img = new Image();
		img.src = src;

		totalRes++;

		var obj = {
			alpha: alpha,
			x: x,
			y: y,
			width: w,
			height: h,
			img: img,
			loaded: false,
			rotated: false,
			id: numObjs,

			draw: function () {
				if(!this.rotated) {
				    let ctx = _this._ctx2D_;

				    ctx.save();
				    ctx.globalAlpha = this.alpha;
				    ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
				    ctx.restore();
			    }
			},

			rotate: function (deg) {
				let ctx = _this._ctx2D_;
				this.rotated = false;

				ctx.save();
				ctx.translate(this.x + this.width/2, this/y + this.height/2);
				ctx.rotate(deg*Math.PI/180);
				ctx.translate(-(this.x + this.width/2), -(this/y + this.height/2));
				this.draw();
				this.rotated = true;
				ctx.restore();
			},

			move: function(dir, sp) {
				if(typeof(this.speed) != "undefined")
					sp = this.speed;

				switch(dir) {
					case "up":
					    this.y -= sp;
					    break;
					case "down":
					    this.y += sp;
					    break;
					case "left":
					    this.x -= sp;
					    break;
					case "right":
					    this.x += sp;
					    break;
				}
			}
		}

		img.onload = function () {
			obj.loaded = true;
			loadedRes++;
			console.log("[MerelyJS] Объект с id " + obj.id + " - создан и загружен!");
		}

		if(typeof data == "object") {
			for(let key in data) {
				if(data.hasOwnProperty(key))
				    obj[key] = key in data ? data[key] : obj[key];
			}
		}

		numObjs++;
		return obj;
	},

	// ----------- System -----------
	this.System = function () {

		var sys = {
			getVersion: function () {
				return version;
			},

			getCanvas: function () {
				return _this._canvas_;
			},

			getContext: function () {
				return _this._ctx2D_;
			},

			getFPS: function () {
				return _this._fps_;
			},

			getLoadingStatus: function () {
				return Math.round((loadedRes/totalRes)*100);
			},

			allResLoaded: function () {
				if(totalRes == loadedRes)
					return true;

				return false;
			},

			drawArrObjs: function (arr){
				for(let i in arr) {
					if(arr[i].x >= -arr[i].width && arr[i].x <= _this._width_ + arr[i].width && arr[i].y >= -arr[i].height && arr[i].y <= _this._height_ + arr[i].height)
					    arr[i].draw();
				}
			}
		}

		return sys;
	},

	// ----------- Events -----------
	this.Events = function () {
		var events = {
			MouseEvent: {
				x: 0,
				y: 0,
				clicked: false,

				onClickObj: function (obj) {
					if(this.clicked)
					    if(this.x >= obj.x && this.x < obj.x + obj.width && this.y >= obj.y && this.y < obj.y + obj.height)
						    return true;

					return false;
				}
			}
		}

		_this._canvas_.addEventListener("mousemove", function (e) {
			events.MouseEvent.x = e.pageX;
			events.MouseEvent.y = e.pageY;
		}, false);
		_this._canvas_.addEventListener("click", function () {
			events.MouseEvent.clicked = true;
			setTimeout(function () {events.MouseEvent.clicked = false;}, 1000/_this._fps_);
		}, false);

		return events;
	}
}
