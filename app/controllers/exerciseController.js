wo5App.controller('ExerciseController', function ($scope, $routeParams, resourceService, entityService) {
    init();

    function init() {
        $scope.exerciseCollection = [];
        $scope.exercises = [];

        entityService.getExercises().then(function (exercises) {
            angular.forEach(exercises, function (exercise) {
                $scope.exerciseCollection.push({ entity: exercise, operation: resourceService.consts.op.read, error: '' });
            })
        });

        entityService.getDay(parseInt($routeParams.dayId)).then(function (day) {
            $scope.day = { entity: day };

            angular.forEach(day.exercises, function (exerciseId) {
                entityService.getExercise(exerciseId).then(function (exercise) {
                    var loadedExercise = { entity: exercise, operation: resourceService.consts.op.read, error: '' };
                    $scope.exercises.push(loadedExercise);
                })
            })           
               
        });

        $scope.newExercise = { entity: { name: '', }, error: '' };
    };

    $scope.editExercise = function (exercise) {
        exercise.operation = resourceService.consts.op.update;
    };

    $scope.addExercise = function (exercise) {
        entityService.addExercise(exercise.entity).then(function (exercise) {
            //Add id to day.exercises
            $scope.day.entity.exercises.push(exercise.id);
            entityService.saveDay($scope.day.entity).then(function () {
                //Add exercise to scope.exercises
                var newExercise = { entity: exercise, operation: resourceService.consts.op.read, error: '' };
                $scope.exercises.push(newExercise);
                $scope.newExercise.entity = { name: '' };
            })
        })
    };

    $scope.saveExercise = function (exercise) {       
            entityService.saveDay(day.entity).then(function () {
                day.operation = resourceService.consts.op.read;
                day.error = '';               
                entityService.saveProgram($scope.program).then(function () {
                    exercise.operation = resourceService.consts.op.update;
                })
            });                   
    };

    $scope.deleteExercise = function (exercise) {
        entityService.deleteExercise(exercise.entity).then(function () {
            //Remove id from day.exercises
            $scope.day.entity.exercises.splice($scope.day.entity.exercises.indexOf(exercise.entity.id), 1);
            entityService.saveDay($scope.day.entity).then(function () {
                //Remove exercise from scope.exercises
                $scope.exercises.splice($scope.exercises.indexOf(exercise), 1);
            })
        })
    };

    $scope.validExercise = function (exercise) {
        return resourceService.validScopeEntity(exercise, $scope.exerciseCollection);
    }

    $scope.validExerciseFeedback = function (exercise) {
        exercise.error = $scope.validExercise(exercise) ? 'Name free!' : 'Name exists.';
    }
});