wo5App.controller('WorkoutController', function ($scope, $routeParams, $q, resourceService, entityService) {
    init();

    function init() {
        $scope.sessions = [];
        $scope.exercises = [];
        $scope.sets = [];

        entityService.getPrograms().then(function (programs) {
            $scope.programs = programs;

            if (programs[0]) {
                $scope.loadProgram(programs[0]);
            }

            $('#mdlSessions').modal('show')
        });
    };

    $scope.loadProgram = function (program) {
        $scope.program = program;

        entityService.getDaysByProgram(program.id).then(function (days) {
            $scope.days = days;
            if (days[0]) {
                $scope.loadDay(days[0]);
            }
        })
    };

    $scope.loadDay = function (day) {
        $scope.day = day;
        entityService.getSessionsByDay(day.id).then(function (sessions) {
            $scope.sessions = resourceService.getViewModelCollection(sessions);
        })
    };

    $scope.startSession = function () {
        $scope.exercises = [];
        var newSession = {
            name: getDateString(),
            program: $scope.program.id,
            day: $scope.day.id,
            exercises: $scope.day.exercises,
            date: getDateString(),
            prevSession: $scope.sessions.length > 0 ? $scope.sessions[$scope.sessions.length - 1].entity.id : null
        }

        entityService.addSession(newSession).then(function (session) {
            $scope.session = resourceService.getViewModel(session);

            $scope.loadExercise($scope.day.exercises[0]);

            //entityService.getExercisesByDay($scope.day).then(function (exercises) {
            //    $scope.exercises = resourceService.getViewModelCollection(exercises);
            //})
        });
    };

    $scope.loadExercise = function (exerciseInfo) {
        $scope.sets = [];
        $scope.selectedExercise = exerciseInfo;

        var sessionExercise = [$scope.session.entity.id, exerciseInfo.exercise.id];
        var prevSessionExercise = [$scope.session.entity.prevSession, exerciseInfo.exercise.id];

        entityService.getSetsBySessionExercise(sessionExercise).then(function (sets) {
            var setsViewModel = resourceService.getViewModelCollection(sets);

            //    angular.forEach(setsViewModel, function (set) {
            //        $scope.sets.push(getSetViewModelWithTarget(set));
            //    });
            //})

            if (exerciseInfo.exercise.id) {
                entityService.getSetByExercisePerformMax(exerciseInfo.exercise.id).then(function (sets) {
                    $scope.maxPerformSet = resourceService.getViewModel(sets);
                })
            }

            if (prevSessionExercise) {
                entityService.getSetsBySessionExercise(prevSessionExercise).then(function (sets) {
                    $scope.prevSessionSets = resourceService.getViewModelCollection(sets);
                })
            }
        });
    };

    $scope.addSet = function () {
        var set = {
            no: $scope.sets.length + 1,
            day: $scope.day.id,
            session: $scope.session.entity.id,
            exercise: $scope.selectedExercise.exercise.id,
            reps: null,
            perform: null,
            measurement: $scope.selectedExercise.target.measurement
        };

        entityService.addSet(set).then(function (newSet) {
            var set = resourceService.getViewModel(newSet);
            set.operation = resourceService.consts.op.update;
            $scope.sets.push(set);
        })
    };

    $scope.editSet = function (set) {
        set.operation = resourceService.consts.op.update;
    };

    $scope.saveSet = function (set) {
        if (!set.entity.reps) {
            set.entity.reps = 0;
        }

        if (!set.entity.perform) {
            set.entity.perform = 0;
        }

        entityService.saveSet(set.entity).then(function () {
            set.operation = resourceService.consts.op.read;
            set.performTargetPercent = resourceService.getPerformTargetPercantage(set.entity.perform, $selectedExercise.target.perform)
        });
    };

    $scope.deleteSet = function (set) {
        entityService.deleteSet(set.entity).then(function () {
            $scope.sets.splice($scope.sets.indexOf(set), 1);
        })
    };

    $scope.convertToKg = function () {
        $scope.sets = resourceService.convertSetsViewModelToKg($scope.sets);
    }

    $scope.convertToLbs = function () {
        $scope.sets = resourceService.convertSetsViewModelToLbs($scope.sets);
    }

    $scope.cycleMeasurement = function (set) {
        var weights = resourceService.getWeightMeasurements();
        var index = weights.indexOf(set.entity.measurement) + 1 < weights.length ? weights.indexOf(set.entity.measurement) + 1 : 0;
        set.entity.measurement = weights[index];
    }

    function getDateString() {
        var date = resourceService.date();

        return date.day + '-' + date.month + '-' + date.yearShort;
    };

    //function getPerformTargetPercantage(set) {
    //    var exerciseTarget = entityService.getExerciseTargetByDay(set.entity.exercise, $scope.day)

    //    if (exerciseTarget) {
    //        set.performTargetPercent = resourceService.getPerformTargetPercantage(set.entity.perform, exerciseTarget.perform) + '%';
    //    }
    //    else {
    //        set.performTargetPercent = 'N/A';
    //    }

    //    return set;
    //}
});