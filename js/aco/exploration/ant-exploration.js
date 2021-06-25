class AntExploration {

    constructor() {
        if (this.constructor == AntExploration) {
            throw new Error("Abstract classes can't be instantiated.");
        }
    }

    doExploration() {
        throw new Error("Method 'doExploration' must be implemented.");
    }
}
