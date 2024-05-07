class Ship {
    constructor(length) {
        this.length = length;
        this.hits = 0;
    }

    // Increase number of 'hits' on ship
    hit() {
        this.hits++;
    }
}

export default Ship;
