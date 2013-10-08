wo5App.controller('SessionController', function ($scope, $routeParams, resourceService, entityService) {
    init();

    function init() {
        $scope.sessions = [];
        $scope.exercises = [];

        var programs = entityService.getPrograms().then(function (programs) {
            $scope.programs = programs;
        });

        if ($routeParams.sessionId) {
            entityService.getSession(parseInt($routeParams.sessionId)).then(function (session) {
                $scope.session = session;
            })
        }
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

        entityService.getExercisesByDay($scope.day).then(function (exercises) {
            $scope.exercises = resourceService.getViewModelCollection(exercises);
        })
    };

    $scope.loadExercise = function (session, exercise) {
        var sessionExercise = [session.entity.id, exercise.entity.id];
        console.debug(sessionExercise);
        entityService.getSetsBySessionExercise(sessionExercise).then(function (sets) {
            session.sets = resourceService.getViewModelCollection(sets);
        })
    }

    $scope.editSession = function (session) {
        session.operation = resourceService.consts.op.update;
    };

    $scope.saveSession = function (session) {
        entityService.saveSession(session).then(function () {
            session.operation = resourceService.consts.op.read;
        });
    };

    //$scope.addSession = function () {
    //    var newSession = {
    //        name: getDateString(),
    //        program: $scope.program.id,
    //        day: $scope.day.id,
    //        exercises: $scope.day.exercises,
    //        date: getDateObject(),
    //        prevSession: $scope.sessions.length > 0 ? $scope.sessions[$scope.sessions.length -1].entity.id : null
    //    }

    //    entityService.addSession(newSession).then(function (session) {
    //        $scope.sessions.push({ entity: session, operation: resourceService.consts.op.read });
    //    });
    //};

    $scope.deleteSession = function (session) {
        entityService.deleteSession(session.entity).then(function () {
            $scope.sessions.splice($scope.sessions.indexOf(session), 1);
        });
    };
});