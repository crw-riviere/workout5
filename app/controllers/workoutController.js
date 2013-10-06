wo5App.controller('WorkoutController', function ($scope, $routeParams, resourceService, entityService) {
    init();

    function init() {
        $scope.weightMeasurement = resourceService.consts.measuement.weight.kg;
        $scope.sessions = [];
        $scope.exercises = [];

        entityService.getPrograms().then(function (programs) {
            $scope.programs = programs;
            $('#mdlSessions').modal('show')
        });

        //entityService.getSession(parseInt($routeParams.sessionId)).then(function (session) {
        //    $scope.session = resourceService.getViewModel(session);
        //    $scope.exercises = [];

        //    angular.forEach(session.exercises, function (exerciseId) {
        //        entityService.getExercise(exerciseId).then(function (exercise) {
        //            $scope.exercises.push(resourceService.getViewModel(exercise));

        //        })
        //    })
        //});
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
        });

        $scope.exercises = [];

        angular.forEach($scope.day.exercises, function (exerciseId) {
            entityService.getExercise(exerciseId).then(function (exercise) {
                $scope.exercises.push(resourceService.getViewModel(exercise));
            })
        })
    };

    //$scope.loadExercise = function (exercise) {
    //    $scope.exercise = exercise;

    //    var sessionExercise = [$scope.session.entity.prevSession, exercise.entity.id];
    //    console.log('session exercise:');
    //    console.debug(sessionExercise);
    //    entityService.getSetsBySessionExercise(sessionExercise).then(function (sets) {
    //        $scope.prevSessionExercises = resourceService.getViewModelCollection(sets);
    //    })
    //};

    $scope.addSet = function () {
        var newSet = {
            entity: { no: $scope.sets.length + 1, session: $scope.session.entity.id, exercise: $scope.exercise.entity.id, reps: 0, weight: 0, measuement: $scope.weightMeasurement },
            operation: resourceService.consts.op.update
        };

        $scope.sets.push(newSet);
    };

    $scope.editSet = function (set) {
        set.operation = resourceService.consts.op.update;
    };

    $scope.saveSet = function (set) {
        entityService.saveSet(set.entity).then(function () {
            set.operation = resourceService.consts.op.read;
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

    function getDateString() {
        var date = resourceService.date();

        return date.day + '/' + date.month + '/' + date.yearShort;
    };

    function getDateObject() {
        return resourceService.date();
    };

});