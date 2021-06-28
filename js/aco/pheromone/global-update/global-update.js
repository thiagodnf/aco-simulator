class GlobalUpdate {

    constructor(environment) {

        this.environment = environment;

        if (this.constructor == GlobalUpdate) {
            throw new Error("Abstract classes can't be instantiated.");
        }
    }

    getTheNewValue(i, j) {
        throw new Error("Method 'getTheNewValue' must be implemented.");
    }
}
