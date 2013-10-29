wo5App.controller('SessionController', function ($scope, $routeParams, resourceService, entityService) {
    init();

    function init() {
        $scope.sessions = [];
        $scope.exercises = [];

        var programs = entityService.getPrograms().then(function (programs) {
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

        if (day.exercises[0]) {
            $scope.exercise = day.exercises[0];
        }
    };

    $scope.loadExercise = function (exercise) {
        $scope.exercise = exercise;

        entityService.getSessionsByDay($scope.day.id).then(function (sessions) {
            $scope.sessions = resourceService.getViewModelCollection(sessions);
        })

        if ($scope.exercise.id) {
            entityService.getSetByExercisePerformMax(exercise.id).then(function (set) {
                $scope.exerciseMax = set.perform;
                $scope.exerciseTarget = exercise.target.perform;
            })
        }
    }

    $scope.loadSession = function (session) {
        var sessionExercise = [session.entity.id, $scope.exercise.id];
        entityService.getSetsBySessionExercise(sessionExercise).then(function (sets) {
            var data = { target: $scope.exercise.target, sets: sets };
            session.data = data;
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

    $scope.deleteSession = function (session) {
        entityService.deleteSession(session.entity).then(function () {
            $scope.sessions.splice($scope.sessions.indexOf(session), 1);
        });
    };

    $scope.getExerciseTargetPercentage = function (perform) {
        return resourceService.getPerformTargetPercantage(perform, $scope.exerciseTarget);
    }

    $scope.getExerciseMaxPercentage = function (perform) {
        return resourceService.getPerformTargetPercantage(perform, $scope.exerciseMax);
    }
});