class AntSelection {

    constructor() {
        if (this.constructor == AntSelection) {
            throw new Error("Abstract classes can't be instantiated.");
        }
    }

    doSelection() {
        throw new Error("Method 'doSelection' must be implemented.");
    }
}
