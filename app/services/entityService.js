wo5App.service('entityService', function ($rootScope, $q, resourceService, dbService) {
    var self = this;

    //Program Functions

    self.getProgram = function (programId) {
        var deferred = $q.defer();

        dbService.getEntity(programId, resourceService.consts.store.program, function (program) {
            $rootScope.$apply(function () {
                deferred.resolve(program);
            });
        });

        return deferred.promise;
    };

    self.getPrograms = function () {
        var deferred = $q.defer();

        dbService.getEntities(resourceService.consts.store.program, function (programs) {
            $rootScope.$apply(function () {
                deferred.resolve(programs);
            });
        });

        return deferred.promise;
    };

    self.saveProgram = function (program) {
        var deferred = $q.defer();

        dbService.putEntity(program, resourceService.consts.store.program,
        function (newProgram) {
            $rootScope.$apply(function () {
                deferred.resolve(newProgram);
            });
        });

        return deferred.promise;

    }

    self.addProgram = function (program) {
        var deferred = $q.defer();
        dbService.putEntity(program, resourceService.consts.store.program,
        function (newProgram) {
            $rootScope.$apply(function () {
                deferred.resolve(newProgram);
            });
        });

        return deferred.promise;
    };

    self.deleteProgram = function (program) {
        var deferred = $q.defer();
        dbService.removeEntity(program, resourceService.consts.store.program, function () {
            $rootScope.$apply(function () {
                deferred.resolve();
            })
        });

        return deferred.promise;
    };

    //End Program Functions

    //Day Functions

    self.getDay = function (programId, dayId) {
        var deferred = $q.defer();
        self.getProgram(programId).then(function (program) {
            angular.forEach(program.days, function (day, key) {
                if (day.name === dayId) {
                    deferred.resolve(day);
                }
            });
        });

        return deferred.promise;
    }

    //End Day Functions

    //Exercise Functions

    self.getExercises = function () {
        var deferred = $q.defer();

        dbService.getEntities(resourceService.consts.store.exercise, function (exercises) {
            $rootScope.$apply(function () {
                deferred.resolve(exercises);
            });
        });

        return deferred.promise;
    };

    self.saveExercise = function (exercise) {
        dbService.putEntity(exercise, resourceService.consts.store.exercise,
        function (newExercise) {
            $rootScope.$apply(function () {
            });
        });
    }

    self.addExercise = function (exercise) {
        var deferred = $q.defer();
        dbService.putEntity(exercise, resourceService.consts.store.exercise,
        function (newExercise) {
            $rootScope.$apply(function () {
                deferred.resolve(newExercise);
            });
        });

        return deferred.promise;
    };

    self.deleteExercise = function (exercise) {
        var deferred = $q.defer();
        dbService.removeEntity(exercise, resourceService.consts.store.exercise, function () {
            $rootScope.$apply(function () {
                deferred.resolve();
            })
        });
        return deferred.promise;
    };

    //End Exercise Functions

    //Session Functions

    self.getSession = function (sessionId) {
        var deferred = $q.defer();

        dbService.getEntity(sessionId, resourceService.consts.store.session, function (session) {
            $rootScope.$apply(function () {
                deferred.resolve(session);
            });
        });

        return deferred.promise;
    };

    self.getSessionsByWorkout = function (workout) {
        var deferred = $q.defer();
        dbService.getEntitiesByIndex(resourceService.consts.index.workout, workout, resourceService.consts.store.session, function (sessions) {
            $rootScope.$apply(function () {
                console.log('ret sessions: ' + sessions);
                deferred.resolve(sessions);
            });
        });

        return deferred.promise;
    };

    self.addSession = function (session) {
        var deferred = $q.defer();

        dbService.putEntity(session, resourceService.consts.store.session,
        function (newSession) {
            $rootScope.$apply(function () {
                deferred.resolve(newSession);
            });
        });

        return deferred.promise;
    };

    //End Session Functions

    //Set Functions

    self.getSetsByWorkout = function (workout) {
        var deferred = $q.defer();
        dbService.getEntitiesByIndex(resourceService.consts.index.workout, workout, resourceService.consts.store.set, function (sets) {
            $rootScope.$apply(function () {
                console.log('ret sets: ' + sets);
                deferred.resolve(sets);
            });
        });

        return deferred.promise;
    };

    self.addSet = function (set) {
        var deferred = $q.defer();

        dbService.putEntity(set, resourceService.consts.store.set,
        function (newSet) {
            $rootScope.$apply(function () {
                deferred.resolve(newSet);
            });
        });

        return deferred.promise;
    };

    self.saveSet = function (set) {
        var deferred = $q.defer();

        dbService.putEntity(set, resourceService.consts.store.set,
        function (set) {
            $rootScope.$apply(function () {
                deferred.resolve(set);
            });
        });

        return deferred.promise;
    };

    self.deleteSet = function (set) {
        var deferred = $q.defer();
        dbService.removeEntity(set, resourceService.consts.store.set, function () {
            $rootScope.$apply(function () {
                deferred.resolve();
            })
        });
        return deferred.promise;
    };

    //End Set Functions

});