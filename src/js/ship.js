class Ship {
    #length;
    #hits;

    constructor(length) {
        if (length < 2 || length > 5) {
            throw new Error('Ship length must be between 2 and 5!');
        }
        this.#length = length;
        this.#hits = 0;
    }

    get length() {
        return this.#length;
    }

    get hits() {
        return this.#hits;
    }

    // Increase number of 'hits' on ship, cap at length
    hit() {
        if (this.#hits < this.#length) this.#hits++;
    }

    // Calculate whether or not ship is sunk based on its length and hits received
    isSunk() {
        return this.#hits >= this.#length;
    }
}

export default Ship;
