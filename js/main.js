// Script Notes:
// 14-12-2015: Coded canvas properties
// 15-12-2015: Applied GOL Logic and basic buttons
// 16-12-2015: Developed canvas to be responsive

// GOL Properties and Behavior
var life = (function () {
    var yCells,
        xCells,
        prev = [], // previous generation
        next = [], // next generation
        speed = 100, // default speed
        timeout,
        timer,
        alive = false,
        x,
        y,
        underPopulated = 2,
        stablePopulation = 3;


    // adjust cell processing speed
    function adjustCellSpeed(faster) {
        if (faster) {
            // if speed is set to 0 don't do anything
            if (life.speed === 0) {
                return;
            }
            life.speed -= 10;

        } else {
            // if speed is greated than 1k dont do anything
            if (life.speed === 990) {
                return;
            }
            life.speed += 10;
        }
        if (alive) {
            clearInterval(timeout);
            timeout = setInterval(life.nextLife, life.speed);
        }
    }

    // Toggle cell grid's behaviour based on speed
    function startStopLife() {
        if (!alive) {
            alive = true;
            timeout = setInterval(life.nextLife, this.speed);
        } else {
            alive = false;
            clearInterval(timeout);
        }
    }

    // Check the grid's neighbor count    
    function checkNeighbours(x, y) {
        var l = life,
            count = 0,
            i,
            neighbours = [
                life.prev[x][(y - 1 + life.yCells) % life.yCells], 
                life.prev[(x + 1 + life.xCells) % life.xCells][(y - 1 + life.yCells) % life.yCells],
                life.prev[(x + 1 + life.xCells) % life.xCells][y],
                life.prev[(x + 1 + life.xCells) % life.xCells][(y + 1 + life.yCells) % life.yCells],
                life.prev[x][(y + 1 + life.yCells) % life.yCells],
                life.prev[(x - 1 + life.xCells) % life.xCells][(y + 1 + life.yCells) % life.yCells],
                life.prev[(x - 1 + life.xCells) % life.xCells][y],
                life.prev[(x - 1 + life.xCells) % life.xCells][(y - 1 + life.yCells) % life.yCells]
            ];

        for (i = 0; i < neighbours.length; i++) {
            // if neighbor cell state is true increment neighbor alive count
            if (neighbours[i]) {
                count++;
            }
        }

        return count;
    }


    // Logic for Cell Behavior
    function nextLife() {
        var l = life,
            g = graphics,
            count;

        // Pass prev generation cell stat to next generation
        for (x = 0; x < life.xCells; x++) {
            for (y = 0; y < life.yCells; y++) {
                life.next[x][y] = life.prev[x][y];
            }
        }

        for (x = 0; x < life.xCells; x++) {
            for (y = 0; y < life.yCells; y++) {
                count = checkNeighbours(x, y);
            
               if (prev[x][y]) {

                    // If cell is under populated or overpopulated : Cell will die
                    if (count < underPopulated || count > stablePopulation) {
                        next[x][y] = false;
                        graphics.drawCell(x, y, life.next[x][y]);
                    }

                // Cell will live
                } else if (count === stablePopulation) {
                    next[x][y] = true;
                    graphics.drawCell(x, y, life.next[x][y]);
                }
            }
        }

        // Next generation will become the current generation
        for (x = 0; x < life.xCells; x++) {
            for (y = 0; y < life.yCells; y++) {
                life.prev[x][y] = life.next[x][y];
            }
        }

    }


    // Clear Grid Function
    function reset() {
        var x,
            y;

        // Select all next generation cell state and clear
        for (x = 0; x < life.xCells; x++) {
            for (y = 0; y < life.yCells; y++) {
                life.next[x][y] = false;
                graphics.drawCell(x, y, life.next[x][y]);
            }
        }

        // Select all previous generation cell state and clear
        for (x = 0; x < life.xCells; x++) {
            for (y = 0; y < life.yCells; y++) {
                life.prev[x][y] = false;
                graphics.drawCell(x, y, life.prev[x][y]);
            }
        }
    }

    function initLifeGrid(canvasSelector, isFirstLoad) {

        if (isFirstLoad){
            graphics.initCanvas(canvasSelector);
        }else{
             graphics.ctx.canvas.width = $(window).width();
        }

        life.xCells = Math.floor((graphics.canvas.width - 1) / graphics.cellSize);
        life.yCells = Math.floor((graphics.canvas.height - 1) / graphics.cellSize);

        graphics.ctx.fillStyle = graphics.offColour;
        graphics.ctx.fillRect(0, 0, life.xCells * graphics.cellSize, life.yCells * graphics.cellSize);
        graphics.ctx.fillStyle = graphics.gridColour;

        // Create Grid Logic
        for (x = 0; x < life.xCells; x++) {
            life.prev[x] = [];
            life.next[x] = [];
            graphics.ctx.fillRect(x * graphics.cellSize, 0, 1, life.yCells * graphics.cellSize);
            for (y = 0; y < life.yCells; y++) {
                life.prev[x][y] = false;
            }
        }
        for (y = 0; y < life.yCells; y++) {
            graphics.ctx.fillRect(0, y * graphics.cellSize, life.xCells * graphics.cellSize, 1);
        }
        
        // draw edges
        graphics.ctx.fillRect(life.xCells * graphics.cellSize, 0, 1, life.yCells * graphics.cellSize);
        graphics.ctx.fillRect(0, life.yCells * graphics.cellSize, life.xCells * graphics.cellSize, 1);
       
        if (isFirstLoad){
            $(canvasSelector).mousedown(graphics.handleMouse);
            $('body').mouseup(function (e) {
                $(graphics.canvasSelector).unbind('mousemove');
            });
        }
        
    }

    function isAlive() {
        return alive;
    }

    // Summons the Dark Lord
    function createDarthVader(){

        if (life.xCells > 75){
            alert("Temporarily removed the Clear and Dark Side buttons. \n The Dark Side will not be stopped!");
            $("#resetBtn").css({"color":"#888888", display: "none"})
            $("#vaderBtn").css({"color":"#888888", display: "none"})
            life.reset();
            var darth = [];
            var i = 0;
            darth = summonDarkLord();
            var darthLength = darth.length;
            var vid = document.getElementById("imperial");
            vid.play();
            (function iterator() {
                eval(darth[i]);

                if(++i<darthLength) {
                    setTimeout(iterator, 45);
                }else{
                    vid.pause();
                    vid.currentTime = 0;
                    $("#resetBtn").css({"color":"#FFFFFF", display: "block"})
                    $("#vaderBtn").css({"color":"#000000", display: "block"})
                }
            })();
        }else{
            alert("The Dark Side needs more grid! Set it to landscape or try it on a larger screen.");
        }
    }

    return {
        yCells: yCells,
        xCells: xCells,
        prev: prev,
        next: next,
        universe: prev,
        speed: speed,
        initLifeGrid: initLifeGrid,
        isAlive: isAlive,
        reset: reset,
        nextLife: nextLife,
        startStopLife: startStopLife,
        adjustCellSpeed: adjustCellSpeed,
        createDarthVader: createDarthVader
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
        graphics.ctx.canvas.width = $(window).width();
        graphics.canvasSelector = canvasSelector;
    }

    // Fill specific grid based on alive variable
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
            console.log("life.drawCell(" + x + "," + y + ", true");
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
