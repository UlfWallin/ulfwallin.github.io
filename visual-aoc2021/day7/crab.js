class Crab {
    location;
    velocity;
    acceleration; 
    topspeed = 3;
    desiredLocation;

    constructor(x, y) {
        this.location = createVector(x, y);
        this.acceleration = createVector(0, 0);
        this.velocity = createVector(0, 0);
    }

    get location() {
        return this.location;
    }

    setDesiredLocation(x, y) {
        this.desiredLocation = createVector(x, y);
        let dir = p5.Vector.sub(this.desiredLocation, this.location);
        dir.normalize();
        dir.mult(0.4);
        this.acceleration = dir;
    }

    update() {
        this.velocity.add(this.acceleration);
        this.velocity.limit(this.topspeed);
        this.location.add(this.velocity);
    }

    display() {
        fill('RGBA(255, 33, 100, 0.33)');
        noStroke();
        ellipse(this.location.x, this.location.y, 10);
    }
}