wo5App.controller('WorkoutController', function ($scope, $routeParams, $q, resourceService, entityService) {
    init();

    function init() {
        $scope.weightMeasurement = resourceService.consts.measuement.weight.kg;
        $scope.sessions = [];
        $scope.exercises = [];

        entityService.getPrograms().then(function (programs) {
            $scope.programs = programs;
            $('#mdlSessions').modal('show')
        });
    };

    $scope.loadProgram = function (program) {
        $scope.program = program;

        entityService.getDaysByProgram(program.id).then(function (days) {
            $scope.days = days;
        })
    };

    $scope.loadDay = function (day) {
        $scope.day = day;
        entityService.getSessionsByDay(day.id).then(function (sessions) {
            angular.forEach(sessions, function (session) {
                $scope.sessions.push({ entity: session, operation: resourceService.consts.op.read });
            })
        })
    };

    $scope.startSession = function () {
        $scope.exercises = [];
        var newSession = {
            name: getDateString(),
            program: $scope.program.id,
            day: $scope.day.id,
            exercises: $scope.day.exercises,
            date: getDateObject(),
            prevSession: $scope.sessions.length > 0 ? $scope.sessions[$scope.sessions.length - 1].entity.id : null
        }

        entityService.addSession(newSession).then(function (session) {
            $scope.session = resourceService.getViewModel(session);
            entityService.getExercisesByDay($scope.day).then(function (exercises) {
                $scope.exercises = resourceService.getViewModelCollection(exercises);
                $scope.loadExercise($scope.exercises[0]);
            })
        });
    }

    $scope.loadExercise = function (exercise) {
        $scope.exercise = exercise;

        var sessionExercise = [$scope.session.entity.id, exercise.entity.id];
        var prevSessionExercise = [$scope.session.entity.prevSession, exercise.entity.id];

        entityService.getSetsBySessionExercise(sessionExercise).then(function (sets) {
            $scope.sets = resourceService.getViewModelCollection(sets);
        })

        entityService.getSetsBySessionExercise(prevSessionExercise).then(function (sets) {
            $scope.prevSessionSets = resourceService.getViewModelCollection(sets);
        })

        entityService.getSetByExerciseWeightMax(exercise.entity.id).then(function (sets) {
            $scope.maxWeightSet = resourceService.getViewModel(sets);
        })
    };

    $scope.addSet = function () {
        var set = {
            no: $scope.sets.length + 1,
            session: $scope.session.entity.id,
            exercise: $scope.exercise.entity.id,
            reps: 0,
            weight: 0,
            measuement: $scope.weightMeasurement
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
        entityService.saveSet(set.entity).then(function () {
            set.operation = resourceService.consts.op.read;
            set.weightMaxPercent = getWeightMaxPercantage(set);
        });
    };

    $scope.deleteSet = function (set) {
        entityService.deleteSet(set.entity).then(function () {
            $scope.sets.splice($scope.sets.indexOf(set), 1);
        })
    };

    $scope.convertToKg = function () {
        angular.forEach($scope.exercise.sets, function (set) {
            if (set.weightMeasurement === resourceService.consts.measuement.weight.lbs) {
                var kgCalc = set.weightMeasurement * 0.45359237;
                var kgs = Math.round(kgCalc);
                set.weight = kgs;
                set.weightMeasurement = resourceService.consts.measuement.weight.kg;
            }
        });
        $scope.weightMeasurement = resourceService.consts.measuement.weight.kg;
    };

    $scope.convertToLbs = function () {
        angular.forEach($scope.exercise.sets, function (set) {
            if (set.weightMeasurement === resourceService.consts.measuement.weight.kg) {
                var kg = set.weight() / 0.45359237;
                var lbs = Math.floor(kg);
                set.weight = lbs;
                set.measurement = resourceService.consts.measuement.weight.lbs
            }
        });
        $scope.weightMeasurement = resourceService.consts.measuement.weight.lbs
    };

    function getWeightMaxPercantage(set) {
        var maxWeight = $scope.maxWeightSet.entity.weight;
        var setWeight = set.entity.weight;

        return ((setWeight / maxWeight) * 100).toFixed(2);
    }

    function getDateString() {
        var date = resourceService.date();

        return date.day + '/' + date.month + '/' + date.yearShort;
    };

    function getDateObject() {
        return resourceService.date();
    };
});