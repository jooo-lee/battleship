class Ship {
    constructor(length) {
        this.length = length;
        this.hits = 0;
    }

    // Increase number of 'hits' on ship, cap at length
    hit() {
        if (this.hits < this.length) this.hits++;
    }

    // Calculate whether or not ship is sunk based on its length and hits received
    isSunk() {
        return this.hits >= this.length;
    }
}

export default Ship;
