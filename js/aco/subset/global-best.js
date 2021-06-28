class GlobalBest {

    select(environment) {

        return [{
            tour: environment.bestTour,
            tourDistance: environment.bestTourDistance,
            path: environment.bestPath
        }];
    }
}
