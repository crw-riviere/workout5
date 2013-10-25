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

        //var sessionExerciseCollection = [];

        //entityService.getSessionsByDay(day.id).then(function (sessions) {
        //    angular.forEach(day.exercises, function (exerciseInfo) {
        //        var exercise = [];
        //        angular.forEach(sessions, function (session) {
        //            var sessionExercise = [session.id, exerciseInfo.exercise.id];
        //            entityService.getMaxSetBySessionExercise(sessionExercise).then(function (set) {
        //                exercise.push(set);
        //            })
        //        })

        //        sessionExerciseCollection.push(exercise);
        //    })
        //})

        entityService.getAllMaxSetsForDay(day);
    };

    //$scope.loadExercise = function (session, exercise) {
    //    var sessionExercise = [session.entity.id, exercise.entity.id];
    //    console.debug(sessionExercise);
    //    entityService.getSetsBySessionExercise(sessionExercise).then(function (sets) {
    //        session.sets = resourceService.getViewModelCollection(sets);
    //    })
    //}
});