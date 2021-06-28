class AllAnts {

    select(environment) {
        return environment.ants.map(ant => {
            return {
                tour: ant.visitedNodeIds,
                tourDistance: ant.tourDistance,
                path: ant.path
            }
        });
    }
}
