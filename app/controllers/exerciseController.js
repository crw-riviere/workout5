wo5App.controller('ExerciseController', function ($scope, $routeParams, resourceService, entityService) {
    init();

    function init() {
        entityService.getAllExercises().then(function (exercises) {
            $scope.allExercises = resourceService.getViewModelCollection(exercises);
        });

        entityService.getDay(parseInt($routeParams.dayId)).then(function (day) {
            $scope.day = resourceService.getViewModel(day);

            entityService.getExercisesByDay(day).then(function (exercises) {
                $scope.dayExercises = resourceService.getViewModelCollection(exercises);
            })
        });

        $scope.newExercise = resourceService.getViewModel();
        $scope.emptyExercise = resourceService.getViewModel({}, resourceService.consts.op.create);
    };

    $scope.editExercise = function (exercise) {
        exercise.operation = resourceService.consts.op.update;
    };

    $scope.addExercise = function (exercise) {
        entityService.addExercise(exercise.entity).then(function (exercise) {
            //Add id to day.exercises
            $scope.day.entity.exercises.push({ id: exercise.id });
            entityService.saveDay($scope.day.entity).then(function () {
                //Add exercise to scope.exercises

                $scope.dayExercises.push(resourceService.getViewModel(exercise));
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
                $scope.dayExercises.splice($scope.dayExercises.indexOf(exercise), 1);
            })
        })
    };

    $scope.validExercise = function (exercise) {
        return resourceService.validViewModelEntity(exercise, $scope.allExercises);
    }

    $scope.validExerciseFeedback = function (exercise) {
        exercise.error = $scope.validExercise(exercise) ? 'Name free!' : 'Name exists.';
    }
});