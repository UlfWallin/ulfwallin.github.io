let crabs = [];
let data;
let optimalPos = 0;

function preload() {
    data = loadStrings("input.txt");
}

function setup() {
    const marginX = 10;
    const marginY = 10;
    
    let canvas = createCanvas(500, 500);
    canvas.parent("sketch");
    
    let crabPos = data[0].split(',').map((c) => parseInt(c));
    const spacing = (width - (marginX * 2)) / crabPos.length;
    const posMin = Math.min(...crabPos);
    const posMax = Math.max(...crabPos);

    const m = median(crabPos.slice());
    optimalPos = width * (m / (posMax - posMin));

    for(let crab = 0; crab < crabPos.length; crab++) {
        const relativePos = crabPos[crab] / (posMax - posMin);
        const crabY = marginY + spacing * crab; 
        const crabX = lerp(marginX, height - marginX, relativePos);

        crabs.push(new Crab(crabX, crabY));
    }
}

function draw() {
    background(200);

    for(let crab of crabs) {
        if (frameCount > 90)
            crab.setDesiredLocation(optimalPos, crab.location.y);
        crab.update();
        crab.display();
    }

    if (frameCount > 30) {
        stroke('RGBA(55, 33, 44, 0.7)');
        strokeWeight(3);
        line(optimalPos, height, optimalPos, 0);
    }

}

function median(values) {
    values.sort( (a,b) => a-b);

    var half = Math.floor(values.length / 2);

    if (values.length % 2)
        return values[half];

    return (values[half - 1] + values[half]) / 2.0;
}