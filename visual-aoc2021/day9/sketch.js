let heightmap = [];
let lowpoints = [];
let basins = [];
let iterationCount = 0;
let rows = 40;
let cols = 40;
let cellSize = 0;
let lastAdjacent = [];
let data;
let lowpointsFound = false;
let basinsFlooded = false;

let basin = [];
let visited = [];

function preload() {
    data = loadStrings("input50.txt");
}

function setup() {
    let canvas = createCanvas(500, 500);
    background(200);
    canvas.parent("sketch");
    
    //populateRandomHeightmap();
    heightmapFromFile();
    cellSize = width / cols;
    //frameRate(30);
    const sz = width / cols;
    for(let r = 0; r < rows; r++) {
        for(let c = 0; c < cols; c++) {
            resetCell(r, c);
        }
    }
}

function draw() {
    if (!lowpointsFound) {
        findLowpoints();
        iterationCount++;
    }
    else if (!basinsFlooded) {
        floodBasins();
    }    
}

const getHeight = (r, c) => heightmap[r][c];

function resetCell(r, c) {
    // To fill with different shades of blue:
    // const sat = 100 * (1 - heightmap[r][c] / 9); 
    // colorMode(HSB, 100);
    // fill(65, sat, 85);

    fill(100 + 155 * (heightmap[r][c] / 9));
    strokeWeight(1);
    stroke(192);
    rect(c * cellSize, r * cellSize, cellSize, cellSize);
}

function heightmapFromFile() {
    rows = data.length;
    cols = data[0].length;
    for(let line of data) {
        let ac = []
        for(let char of line) {
            ac.push(parseInt(char));
        }
        heightmap.push(ac);
    }
}

function populateRandomHeightmap() {
    const scale = 1;
    for (let r = 0; r < rows; r++) {
        let ac = [];
        for (let c = 0; c < cols; c++) {
            const height = Math.floor(10 * noise(c * scale, r * scale));
            ac.push(height);
        }
        heightmap.push(ac);
    }
}

function fillCell(r, c, color) {
    const sz = width / cols;
    fill(color);
    rect(c * cellSize, r * cellSize, cellSize, cellSize);
}



function findLowpoints() {
    const i = iterationCount;
    const row = Math.floor(i / cols);
    const col = i - (row * cols);
    if (row > rows || col > cols) return;

    let adjacent = [];
    if (row > 0)
        adjacent.push({ row: row - 1, col: col }); // N
    if (col < cols - 1)
        adjacent.push({ row: row, col: col + 1 }); // E
    if (row < rows - 1)
        adjacent.push({ row: row + 1, col: col }); // S
    if (col > 0)
        adjacent.push({ row: row, col: col - 1 }); // W

    for (var ci of lastAdjacent) {
        resetCell(ci.row, ci.col);
    }
    let minHeight = 9;
    for (var a of adjacent) {
        minHeight = Math.min(minHeight, getHeight(a.row, a.col));
        fillCell(a.row, a.col, '#00aaff');
    }

    if (heightmap[row][col] < minHeight) {
        lowpoints.push({ row: row, col: col });
    }

    lastAdjacent = adjacent;
    for (var lp of lowpoints) {
        fillCell(lp.row, lp.col, '#00aaff');
    }

    if (row === rows - 1 && col === cols - 1) {
        resetCell(rows - 2, cols - 1);
        resetCell(rows - 1, cols - 2);

        lowpointsFound = true;
        iterationCount = -1;
    }
}

function floodBasins() {
    const lowpoint = lowpoints[iterationCount];
    if (visited.length) {
        let pos = visited.shift();
        
        if (pos == null || basin.some((e) => e.col === pos.col && e.row === pos.row )) {
            return;
        }
        
        const height = heightmap[pos.row][pos.col]; // getHeight(pos.row, pos.col);
        if (height < 9) {
            const row = pos.row;
            const col = pos.col;
            basin.push(pos);
            fillCell(row, col, "RGBA(0, 0, 255, .50)");
        
            if (col > 0)
                visited.push({ row: row, col: col - 1 }); // E
            if (col < cols - 1)
                visited.push({ row: row, col: col + 1 }); // W
            if (row > 0)
                visited.push({ row: row - 1, col: col }); // N
            if (row < rows - 1)
                visited.push({ row: row + 1, col: col }); // S
        }
    }
    else {
        visited.push(lowpoint);
        if (basin.length) {
            basins.push(basin);
            basin = [];
        }
        iterationCount++;
    }

    if (iterationCount > lowpoints.length ) {
        basinsFlooded = true;
        return;
    }

}