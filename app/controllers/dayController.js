wo5App.controller('DayController', function ($scope, $routeParams, resourceService, entityService) {
    init();

    function init() {
        entityService.getProgram(parseInt($routeParams.programId)).then(function (program) {
            $scope.program = resourceService.getViewModel(program);
            $scope.newDay = { entity: { name: '', program: $scope.program.entity.id, exercises: [] }, error: '' };

            entityService.getDaysByProgram(program.id).then(function (days) {
                $scope.days = resourceService.getViewModelCollection(days);
            })
        });

        entityService.getAllExercises().then(function (exercises) {
            $scope.allExercises = resourceService.getViewModelCollection(exercises);
        });

        $scope.newExercise = resourceService.getViewModel({}, resourceService.consts.op.create);

        $scope.selectedExercise = '';
    };

    $scope.editDay = function (day) {
        day.operation = resourceService.consts.op.update;
    };

    $scope.addDay = function (day) {
        var entityDay = { name: day.entity.name, program: $scope.program.entity.id, exercises: [] };

        entityService.addDay(entityDay).then(function (day) {
            var newDay = { entity: day, operation: resourceService.consts.op.read, error: '' };
            $scope.days.push(newDay);
            $scope.newDay.entity = { entity: { name: '', program: $scope.program.entity.id, exercises: [] }, error: '' };
        });
    };

    $scope.saveDay = function (day) {
        day.operation = resourceService.consts.op.read;
        day.error = '';
        entityService.saveDay(day.entity).then(function () {
        });
    };

    $scope.deleteDay = function (day) {
        entityService.deleteDay(day.entity).then(function () {
            $scope.days.splice($scope.days.indexOf(day), 1);
        });
    };

    $scope.validDay = function (day) {
        return resourceService.validViewModelEntity(day, $scope.days);
    };

    $scope.validDayFeedback = function (day) {
        day.error = $scope.validDay(day) ? 'Name free!' : 'Name exists.';
    }

    $scope.loadDay = function (day) {
        $scope.selectedDay = day;
    }

    $scope.loadExercises = function (day) {
        entityService.getExercisesByDay(day.entity).then(function (exercises) {
            day.exercises = resourceService.getViewModelCollection(exercises);
        })
    };

    $scope.addExercise = function (exercise) {
        $scope.selectedDay.entity.exercises.push({ id: exercise.entity.id, target: { reps: $scope.newExercise.target.reps, weight: $scope.newExercise.target.weight } });
        $scope.selectedDay.exercises.push(exercise);

        entityService.saveDay($scope.selectedDay.entity).then(function () {
            $scope.selectedExercise = '';
        })
    }

    $scope.createExercise = function (newExercise) {
        entityService.addExercise(newExercise.entity).then(function (exercise) {
            $scope.selectedDay.entity.exercises.push({ id: exercise.id, target: { reps: newExercise.target.reps, weight: newExercise.target.weight } });
            $scope.selectedDay.exercises.push(resourceService.getViewModel(exercise));
            $scope.allExercises.push(resourceService.getViewModel(exercise));
        });

        entityService.saveDay($scope.selectedDay.entity).then(function () {
            $scope.selectedExercise = '';
            $scope.newExercise = resourceService.getViewModel({}, resourceService.consts.op.create);
        })
    }

    $scope.validExercise = function (exercise) {
        return resourceService.validViewModelEntity(exercise, $scope.allExercises);
    }

    $scope.validExerciseFeedback = function (exercise) {
        exercise.error = $scope.validExercise(exercise) ? 'Name free!' : 'Name exists.';
    }
});