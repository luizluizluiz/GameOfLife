// Script Notes:
// 14-12-2015: Coded canvas properties


// GOL Properties and Behavior
var life = (function () {
    var yCells,
        xCells,
        prev = [], // previous generation
        next = [], // next generation
        speed = 100,
        timeout,
        alive = false,
        x,
        y;

    function initLifeGrid(canvasSelector) {
        graphics.initCanvas(canvasSelector);
        life.xCells = Math.floor((graphics.canvas.width - 1) / graphics.cellSize);
        life.yCells = Math.floor((graphics.canvas.height - 1) / graphics.cellSize);
        

        graphics.ctx.fillStyle = graphics.offColour;
        graphics.ctx.fillRect(0, 0, life.xCells * graphics.cellSize, life.yCells * graphics.cellSize);
        graphics.ctx.fillStyle = graphics.gridColour;

        for (x = 0; x < life.xCells; x++) {
            life.prev[x] = [];
            life.next[x] = [];
            graphics.ctx.fillRect(x * graphics.cellSize, 0, 1, life.yCells * graphics.cellSize);
            for (y = 0; y < life.yCells; y++) {
                life.prev[x][y] = false;
            }
        }
        graphics.ctx.fillRect(life.xCells * graphics.cellSize, 0, 1, life.yCells * graphics.cellSize);
        for (y = 0; y < life.yCells; y++) {
            graphics.ctx.fillRect(0, y * graphics.cellSize, life.xCells * graphics.cellSize, 1);
        }
        graphics.ctx.fillRect(0, life.yCells * graphics.cellSize, life.xCells * graphics.cellSize, 1);
        $(canvasSelector).mousedown(graphics.handleMouse);
        $('body').mouseup(function (e) {
            $(graphics.canvasSelector).unbind('mousemove');
        });
    }

    function isAlive() {
        return alive;
    }

    return {
        yCells: yCells,
        xCells: xCells,
        prev: prev,
        next: next,
        universe: prev,
        speed: speed,
        initLifeGrid: initLifeGrid,
        isAlive: isAlive
    };
}());

// Canvas Properties and Behavior
var graphics = (function () {
    var canvas,
        ctx,
        canvasSelector,
        cellSize = 10, // px
        onColour = 'rgb(0, 0, 0)', //black
        offColour = 'rgb(255, 255, 255)', //white
        gridColour = 'rgb(50, 50, 50)'; //gray

    // Canvas Properties
    function initCanvas(canvasSelector) {
        graphics.canvas = $(canvasSelector).get(0);
        graphics.ctx = graphics.canvas.getContext('2d');
        graphics.canvasSelector = canvasSelector;
    }

    function drawCell(x, y, alive) {
        graphics.ctx.fillStyle = (alive) ? onColour : offColour;
        graphics.ctx.fillRect(x * cellSize + 1, y * cellSize + 1, cellSize - 1, cellSize - 1);
    }

    function handleMouse(e) {
        var that = this,
            state;

        function getCellPointUnderMouse(e) {
            return new Point(Math.floor((e.pageX - that.offsetLeft) / graphics.cellSize), Math.floor(((e.pageY - that.offsetTop) / graphics.cellSize)));
        }

        function processCell(cell) {
            var x = cell.x,
                y = cell.y;
            if (x > life.xCells - 1 || y > life.yCells - 1) {
                return;
            }
            if (typeof state === 'undefined') {
                state = !life.prev[x][y];
            }
            life.prev[x][y] = state;
            drawCell(x, y, state);
        }

        processCell(getCellPointUnderMouse(e));

        $(graphics.canvasSelector).mousemove(function (e) {
            processCell(getCellPointUnderMouse(e));
        });
    }

    return {
        canvas: canvas,
        ctx: ctx,
        canvasSelector: canvasSelector,
        cellSize: cellSize,
        onColour: onColour,
        offColour: offColour,
        gridColour: gridColour,
        initCanvas: initCanvas,
        drawCell: drawCell,
        handleMouse: handleMouse
    };
}());


// Coordinates pointer
var Point = function (x, y) {
    this.x = x;
    this.y = y;
};
