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
            $scope.loadExercise(day.exercises[0]);
        }
    };

    $scope.loadExercise = function (exercise) {
        $scope.exercise = exercise;

        entityService.getAllMaxSetsByDayExercise($scope.day.id, exercise.id).then(function (maxSets) {
            var data = { target: exercise.target, sets: [] };

            angular.forEach(maxSets, function (set) {
                if (set) {
                    data.sets.push(set);
                }
            })
            $scope.data = data;
            console.debug(data);
        })
    }
});