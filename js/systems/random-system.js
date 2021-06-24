class RandomSystem{

    getNextNodeId(ant){

        var nodeIds = ant.nodesToVisit.map(e => e.id);

        ArrayUtils.shuffle(nodeIds);

        return nodeIds[0];
    }
}
