class Player {
    #type;

    constructor(type) {
        if (type !== 'human' && type !== 'computer') {
            throw new Error('Invalid player type!');
        }
        this.#type = type;
    }

    get type() {
        return this.#type;
    }
}

export default Player;
