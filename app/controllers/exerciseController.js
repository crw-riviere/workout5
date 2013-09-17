wo5App.controller('ExerciseController', function ($scope, $routeParams, entityService) {
    init();

    function init() {
        if ($routeParams.programId) {
            console.log('proId');
        }

        if ($routeParams.sessionId) {
            console.log('sessId');
        }

        var day = entityService.getProgram(parseInt($routeParams.programId)).then(function (program) {
            $scope.program = program;
            for (var i = 0; i < program.days.length; i++) {
                if (program.days[i].name === $routeParams.dayId) {                   
                    $scope.day = program.days[i];                   
                    break;
                }
            }
        });
       

    };

    $scope.editExercise = function (exercise) {
        exercise.isEditing = true;
    };

    $scope.addExercise = function () {
        var newExercise = { name: 'Exercise', isEditing: true };
        entityService.addExercise(newExercise).then(function (exercise) {
            $scope.day.exercises.push(exercise);
        })
    };

    $scope.saveExercise = function (exercise) {
        exercise.isEditing = false;
        entityService.saveProgram($scope.program);
    };

    $scope.deleteExercise = function (exercise) {
        $scope.day.exercises.splice($scope.day.exercises.indexOf(exercise), 1);
        entityService.saveProgram($scope.program);
    };
});