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

    self.getDay = function (dayId) {
        var deferred = $q.defer();

        dbService.getEntity(dayId, resourceService.consts.store.day, function (day) {
            $rootScope.$apply(function () {
                deferred.resolve(day);
            });
        });

        return deferred.promise;
    };

    self.getDaysByProgram = function (programId) {
        var deferred = $q.defer();
        dbService.getEntitiesByIndex(resourceService.consts.index.program, programId, resourceService.consts.store.day, function (days) {
            $rootScope.$apply(function () {
                deferred.resolve(days);
            });
        });

        return deferred.promise;
    };

    self.addDay = function (day) {
        var deferred = $q.defer();
        dbService.putEntity(day, resourceService.consts.store.day,
        function (newDay) {
            $rootScope.$apply(function () {
                deferred.resolve(newDay);
            });
        });

        return deferred.promise;
    };

    self.deleteDay = function (day) {
        var deferred = $q.defer();
        dbService.removeEntity(day, resourceService.consts.store.day, function () {
            $rootScope.$apply(function () {
                deferred.resolve();
            })
        });

        return deferred.promise;
    };

    self.saveDay = function (day) {
        var deferred = $q.defer();

        dbService.putEntity(day, resourceService.consts.store.day,
        function (newDay) {
            $rootScope.$apply(function () {
                deferred.resolve(newDay);
            });
        });

        return deferred.promise;
    }

    //End Day Functions

    //Exercise Functions

    self.getExercise = function (exerciseId) {
        var deferred = $q.defer();

        dbService.getEntity(exerciseId, resourceService.consts.store.exercise, function (exercise) {
            $rootScope.$apply(function () {
                deferred.resolve(exercise);
            });
        });

        return deferred.promise;
    };

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
        var deferred = $q.defer();
        dbService.putEntity(exercise, resourceService.consts.store.exercise,
        function (newExercise) {
            $rootScope.$apply(function () {
                deferred.resolve(newExercise);
            });
        });

        return deferred.promise;
    };

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

    self.getExercisesByDay = function (day, callback) {
        var deferred = $q.defer();
        var promises = [];

        angular.forEach(day.exercises, function (exercise) {
            promises.push(self.getExercise(exercise.id));
        })

        $q.all(promises).then(function (exercises) {
            deferred.resolve(exercises);
        })

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

    self.getSessionsByDay = function (dayId) {
        var deferred = $q.defer();
        dbService.getEntitiesByIndex(resourceService.consts.index.day, dayId, resourceService.consts.store.session, function (sessions) {
            $rootScope.$apply(function () {
                deferred.resolve(sessions);
            });
        });

        return deferred.promise;
    };

    //self.getSessionsByWorkout = function (workout) {
    //    var deferred = $q.defer();
    //    dbService.getEntitiesByIndex(resourceService.consts.index.workout, workout, resourceService.consts.store.session, function (sessions) {
    //        $rootScope.$apply(function () {
    //            console.log('ret sessions: ' + sessions);
    //            deferred.resolve(sessions);
    //        });
    //    });

    //    return deferred.promise;
    //};

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

    self.saveSession = function (session) {
        var deferred = $q.defer();

        dbService.putEntity(session, resourceService.consts.store.session,
        function (newSession) {
            $rootScope.$apply(function () {
                deferred.resolve(newSession);
            });
        });

        return deferred.promise;
    }

    self.deleteSession = function (session) {
        var deferred = $q.defer();
        dbService.removeEntity(session, resourceService.consts.store.session, function () {
            $rootScope.$apply(function () {
                deferred.resolve();
            })
        });

        return deferred.promise;
    };

    //End Session Functions

    //Set Functions

    

    self.getSetsBySession = function (session) {
        var deferred = $q.defer();
        dbService.getEntitiesByIndex(resourceService.consts.index.session, session, resourceService.consts.store.set, function (sets) {
            $rootScope.$apply(function () {
                deferred.resolve(sets);
            });
        });

        return deferred.promise;
    };

    self.getSetsByDay = function (day) {
        var deferred = $q.defer();
        dbService.getEntitiesByIndex(resourceService.consts.index.day, day, resourceService.consts.store.set, function (sets) {
            $rootScope.$apply(function () {
                deferred.resolve(sets);
            });
        });

        return deferred.promise;
    };

    self.getSetsBySessionExercise = function (sessionExercise) {
        var deferred = $q.defer();
        dbService.getEntitiesByIndex(resourceService.consts.index.sessionExercise, sessionExercise, resourceService.consts.store.set, function (sets) {
            $rootScope.$apply(function () {
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

    self.getMaxSetBySession = function (sessionId) {
        var deferred = $q.defer();

        dbService.getEntityByIndexHighestValue(resourceService.consts.index.session, sessionId, 'weight', resourceService.consts.store.set, function (set) {
            $rootScope.$apply(function () {
                deferred.resolve(set);
            });
        })
        return deferred.promise;
    };

    self.getSetByExerciseWeightMax = function (exerciseId) {
        var deferred = $q.defer();

        dbService.getEntityByIndexHighestValue(resourceService.consts.index.exercise, exerciseId, 'weight', resourceService.consts.store.set, function (set) {
            $rootScope.$apply(function () {
                deferred.resolve(set);
            });
        })
        return deferred.promise;
    };

    //End Set Functions
});