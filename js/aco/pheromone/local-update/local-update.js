class LocalUpdate {

    constructor() {
        if (this.constructor == LocalUpdate) {
            throw new Error("Abstract classes can't be instantiated.");
        }
    }
}
