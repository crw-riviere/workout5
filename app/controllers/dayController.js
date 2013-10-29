wo5App.controller('DayController', function ($scope, $routeParams, resourceService, entityService) {
    init();

    function init() {
        entityService.getProgram(parseInt($routeParams.programId)).then(function (program) {
            $scope.program = resourceService.getViewModel(program);
            entityService.getDaysByProgram(program.id).then(function (days) {
                $scope.days = resourceService.getViewModelCollection(days);
            })
        });

        entityService.getAllExercises().then(function (exercises) {
            $scope.allExercises = exercises;
        });

        $scope.measurements = resourceService.getWeightMeasurements();

        $scope.newDay = resourceService.getViewModel();

        $scope.newExercise = resourceService.getViewModel({ name: null });

        $scope.exercise = { name: null };

        $scope.newTarget = { reps: 0, perform: 0, measurement: $scope.measurements[0] };
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
        return resourceService.validViewModelName(day, null);
    };

    $scope.validDayFeedback = function (day) {
        day.error = $scope.validDay(day) ? '' : 'Day name cannot be empty.';
    };

    $scope.loadDay = function (day) {
        $scope.day = day;
    };

    $scope.loadExercise = function (exercise, day) {
        console.debug(exercise);
        $scope.day = day;
        $scope.exercise = exercise;

        for (var i = 0; i < $scope.measurements.length; i++) {
            if ($scope.measurements[i] === exercise.target.measurement) {
                $scope.exercise.target.measurement = $scope.measurements[i];
                break;
            }
        }
    }

    $scope.addExercise = function (addedExercise) {
        $scope.day.entity.exercises.push({ id: addedExercise.id, name: addedExercise.name, target: { reps: $scope.newTarget.reps, perform: $scope.newTarget.perform, measurement: $scope.newTarget.measurement } });

        entityService.saveDay($scope.day.entity).then(function (day) {
            $scope.day = resourceService.getViewModel(day);
        })
    };

    $scope.createExercise = function (newExercise) {
        console.debug(newExercise);
        entityService.addExercise(newExercise.entity).then(function (exercise) {
            $scope.day.entity.exercises.push({ id: exercise.id, name: exercise.name, target: { reps: $scope.newTarget.reps, perform: $scope.newTarget.perform, measurement: $scope.newTarget.measurement } });

            entityService.saveDay($scope.day.entity).then(function (day) {
                $scope.day = resourceService.getViewModel(day);
                $scope.allExercises.push(exercise);
                $scope.newExercise = resourceService.getViewModel({ name: null });
            })
        });
    };

    $scope.updateExercise = function (updatedExercise) {
        $scope.saveDay($scope.day);
    }

    $scope.deleteExercise = function (updatedExercise) {
        var dayExercises = $scope.day.entity.exercises;

        for (var i = 0; i < dayExercises.length; i++) {
            if (dayExercises[i].id === updatedExercise.id) {
                dayExercises.splice(i, 1);
                break;
            }
        }

        $scope.saveDay($scope.day);
    }

    $scope.validExercise = function (exercise) {
        return resourceService.validEntityName(exercise.entity, $scope.allExercises);
    };

    $scope.validExerciseFeedback = function (exercise) {
        exercise.error = $scope.validExercise(exercise) ? '' : 'An exercise with this name already exists.';
    };
});