wo5App.controller('ProgressController', function ($scope, $routeParams, resourceService, entityService) {
    init();

    function init() {
        $scope.sessions = [];
        $scope.exercises = [];

        var programs = entityService.getPrograms().then(function (programs) {
            $scope.programs = programs;

            if (programs[0]) {
                $scope.loadProgram(programs[0]);
            }
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

        angular.forEach(day.exercises, function (exerciseInfo) {
            var exerciseData = { name: exerciseInfo.exercise.name, target: exerciseInfo.target.perform, sessions: [] };
        })

        entityService.getSessionsByDay(day.id).then(function (sessions) {
            angular.forEach(sessions, function (session) {
                $scope.sessions.push({ entity: session, operation: resourceService.consts.op.read });
            })
        })

        //entityService.getExercisesByDay($scope.day).then(function (exercises) {
        //    $scope.exercises = resourceService.getViewModelCollection(exercises);
        //})
    };

    //$scope.loadExercise = function (session, exercise) {
    //    var sessionExercise = [session.entity.id, exercise.entity.id];
    //    console.debug(sessionExercise);
    //    entityService.getSetsBySessionExercise(sessionExercise).then(function (sets) {
    //        session.sets = resourceService.getViewModelCollection(sets);
    //    })
    //}
});