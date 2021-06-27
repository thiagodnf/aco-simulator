class RandomSystem{

    constructor(environment){
        this.environment = environment;
    }

    getNextNodeId(ant){

        var nodeIds = ant.nodesToVisit.map(e => e.id);

        ArrayUtils.shuffle(nodeIds);

        return nodeIds[0];
    }
}
