class AntExploration {

    constructor() {
        if (this.constructor == AntExploration) {
            throw new Error("Abstract classes can't be instantiated.");
        }
    }

    getNextNode() {
        throw new Error("Method 'getNextNode' must be implemented.");
    }
}
