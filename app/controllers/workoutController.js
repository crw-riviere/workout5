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
            date: getDate(),
            prevSession: $scope.sessions.length > 0 ? $scope.sessions[$scope.sessions.length - 1].entity.id : null
        }

        entityService.addSession(newSession).then(function (session) {
            $scope.session = resourceService.getViewModel(session);

            $scope.loadExercise($scope.day.exercises[0]);
        });
    };

    $scope.loadExercise = function (exercise) {
        $scope.sets = [];
        $scope.exercise = exercise;

        var sessionExercise = [$scope.session.entity.id, exercise.id];
        var prevSessionExercise = [$scope.session.entity.prevSession, exercise.id];

        entityService.getSetsBySessionExercise(sessionExercise).then(function (sets) {
            var setsViewModel = resourceService.getViewModelCollection(sets);

            if (exercise.id) {
                entityService.getSetByExercisePerformMax(exercise.id).then(function (sets) {
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
            exercise: $scope.exercise.id,
            reps: null,
            perform: null,
            measurement: $scope.exercise.target.measurement,
            date: $scope.session.entity.date
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
            set.performTargetPercent = resourceService.getPerformTargetPercantage(set.entity.perform, $scope.exercise.target.perform)
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

    function getDate() {
        var date = resourceService.date();

        return date.day + '-' + date.month + '-' + date.yearShort + ' ' + date.hour + ':' + date.minute + ':' + date.second;
    };

    function getDateString() {
        var date = resourceService.date();

        return date.day + '-' + date.month + '-' + date.yearShort;
    };
});