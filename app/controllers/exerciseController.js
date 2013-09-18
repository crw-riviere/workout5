wo5App.controller('ExerciseController', function ($scope, $routeParams, entityService) {
    init();

    function init() {
       
        entityService.getProgram(parseInt($routeParams.programId)).then(function (program) {
            $scope.program = program;
            for (var i = 0; i < program.days.length; i++) {
                if (program.days[i].name === $routeParams.dayId) {                   
                    $scope.day = program.days[i];                   
                    break;
                }
            }
        });
       
        entityService.getExercises().then(function (exercises) {
            $scope.exercises = exercises;
        })

        $scope.exerciseName = '';
        $scope.error = '';

        $scope.$watch('exerciseName', function () {
            $scope.error = $scope.validExercise($scope.exerciseName) ? 'Name free!' : 'Name exists.';
        });

    };

    $scope.editExercise = function (exercise) {
        exercise.isEditing = true;
    };

    $scope.addExercise = function (exerciseName) {
        var newExercise = { name: exerciseName, isEditing: false };
        entityService.addExercise(newExercise).then(function (exercise) {
            $scope.day.exercises.push(exercise);
            entityService.saveProgram($scope.program).then(function () {
                $scope.exerciseName = '';
            })
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

    $scope.validExercise = function (exerciseName) {
        var valid = true;
        angular.forEach($scope.exercises, function (exercise) {
            if (angular.lowercase(exercise.name) === angular.lowercase(exerciseName)) {
                valid = false;
            }
        });

        return valid;
    }
});