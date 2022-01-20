let octopuses = 
    [[5,4,8,3,1,4,3,2,2,3],
     [2,7,4,5,8,5,4,7,1,1],
     [5,2,6,4,5,5,6,1,7,3],
     [6,1,4,1,3,3,6,1,4,6],
     [6,3,5,7,3,8,5,4,7,8],
     [4,1,6,7,5,2,4,6,4,5],
     [2,1,7,6,8,4,1,7,2,1],
     [6,8,8,2,8,8,1,1,3,4],
     [4,8,4,6,8,4,8,5,5,4],
     [5,2,8,3,7,5,1,5,2,6]];

let flashers = [];
let flashed = [];
let counter = 0;
let currStep = 0;
let prevStep = -1;

const MARGIN = 40;
const COLS = 10;
const ROWS = 10;

function setup() {
    let canvas = createCanvas(500, 500);
    canvas.parent("sketch");
    frameRate(60);
}

function draw() {
    const sx = (width - MARGIN) / ROWS;
    const sy = (height - MARGIN) / COLS;
    background(33);

    update();

    for (let row = 0; row < 10; row++) {
        for (let col = 0; col < 10; col++) {
            const amt = octopuses[row][col] / 10;
            const c1 = color(212, 186, 85);
            const c2 = color(2255, 204, 0);
            fillColor = lerpColor(c1, c2, amt);
            fill(fillColor);
            const dim = 5 + Math.pow(octopuses[row][col], 1.33333);
            ellipse(MARGIN + col * sx, MARGIN + row * sy, dim);
        }
    }
}

function update() {
    if (currStep !== prevStep) {
        flashers.length = 0;
        flashed.length = 0;
        for (let row = 0; row < ROWS; row++) {
            for (let col = 0; col < COLS; col++) {
                octopuses[row][col] += 1;
                if (octopuses[row][col] > 9) {
                    flashers.push({row: row, col: col})
                }
            }
        }
    }
    
    let octopus = flashers.shift();
    if (octopus) {
        prevStep = currStep;
        flash(octopus);
    }  else {
        currStep++;
        // Reset flashed
        for (let row = 0; row < ROWS; row++) {
            for (let col = 0; col < COLS; col++) {
                if (octopuses[row][col] > 9) {
                    octopuses[row][col] = 0;
                }
            }
        }
    }
}

function incrementOctopus(octopus) {
    if(octopus.row < 0 || octopus.row > ROWS - 1 || octopus.col < 0 || octopus.col > COLS - 1) {
        return;
    }
    
    octopuses[octopus.row][octopus.col] += 1;
    if (octopuses[octopus.row][octopus.col] > 9 && !flashers.some(f => f.row === octopus.row && f.col === octopus.col)) {
        flashers.push(octopus);
    }
}

function flash(octopus) {
    if (flashed.some(f => f.row === octopus.row && f.col === octopus.col)) {
        return;
    }
    flashed.push(octopus);

    // Clockwise
    incrementOctopus({row: octopus.row - 1, col: octopus.col});
    incrementOctopus({row: octopus.row - 1, col: octopus.col + 1});
    incrementOctopus({row: octopus.row, col: octopus.col + 1});
    incrementOctopus({row: octopus.row + 1, col: octopus.col + 1});
    incrementOctopus({row: octopus.row + 1, col: octopus.col});
    incrementOctopus({row: octopus.row + 1, col: octopus.col - 1});
    incrementOctopus({row: octopus.row - 1, col: octopus.col - 1});
    incrementOctopus({row: octopus.row, col: octopus.col - 1});
}