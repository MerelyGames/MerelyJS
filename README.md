# ** Merely-js-engine **
### Игровой движок Merely Games.

### *API Документация:*
Минимальный игровой код:

        var display, draw;
        function init() {
        	MerelyJS.consoleLog("Page Loaded", "window");

        	display = MerelyJS.newDisplay(897, 526, "black");
        	draw = MerelyJS.drawElements;

        	MerelyJS.newLoop(function () {
        		display.clear();   
        	}, display, 60);
        }

    	window.onload = init;
      
'MerelyJS' - самый главный ~~основной~~ объект, содержащий все необходимые свойства и методы.

'newDisplay(width, height, bgColor)' - создает новый элемент canvas, имеет методы:
1. setPosition(x, y) - позиционирование.
2. setSize(width, height) - размер.
3. clear() - очищает холст.

'consoleLog(text, type)' - аналог console.log();

'newLoop(function, display, fps)' - создает простой игровой цикл.
