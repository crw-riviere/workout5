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

        $scope.selectedExercise = { exercise: null, target: { reps: 0, perform: 0, measurement: $scope.measurements[0] } };
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
        $scope.selectedDay = day;
    };

    $scope.loadExercise = function (exercise, day) {
        $scope.selectedDay = day;
        $scope.selectedExercise = exercise;

        for (var i = 0; i < $scope.allExercises.length; i++) {
            if ($scope.allExercises[i].id === exercise.exercise.id) {
                $scope.selectedExercise.exercise = $scope.allExercises[i];
                break;
            }
        }

        for (var i = 0; i < $scope.measurements.length; i++) {
            if ($scope.measurements[i] === exercise.target.measurement) {
                $scope.selectedExercise.target.measurement === $scope.measurements[i];
                break;
            }
        }
    }

    $scope.addExercise = function (addedExercise) {
        $scope.selectedDay.entity.exercises.push({ exercise: addedExercise.exercise, target: { reps: addedExercise.target.reps, perform: addedExercise.target.perform, measurement: addedExercise.target.measurement } });

        entityService.saveDay($scope.selectedDay.entity).then(function (day) {
            $scope.selectedDay = resourceService.getViewModel(day);
        })
    };

    $scope.createExercise = function (newExercise) {
        entityService.addExercise(newExercise.entity).then(function (exercise) {
            $scope.selectedDay.entity.exercises.push({ exercise: exercise, target: { reps: $scope.selectedExercise.target.reps, perform: $scope.selectedExercise.target.perform, measurement: $scope.selectedExercise.target.measurement } });

            console.debug($scope.selectedDay);

            entityService.saveDay($scope.selectedDay.entity).then(function (day) {
                $scope.selectedDay = resourceService.getViewModel(day);
                $scope.allExercises.push(exercise);
                $scope.newExercise = resourceService.getViewModel({ name: null });
            })
        });
    };

    $scope.updateExercise = function (updatedExercise) {
        $scope.saveDay($scope.selectedDay);
    }

    $scope.deleteExercise = function (updatedExercise) {
        var dayExercises = $scope.selectedDay.entity.exercises;

        for (var i = 0; i < dayExercises.length; i++) {
            if (dayExercises[i].exercise.id === updatedExercise.exercise.id) {
                dayExercises.splice(i, 1);
                break;
            }
        }

        $scope.saveDay($scope.selectedDay);
    }

    $scope.validExercise = function (exercise) {
        return resourceService.validEntityName(exercise.entity, $scope.allExercises);
    };

    $scope.validExerciseFeedback = function (exercise) {
        exercise.error = $scope.validExercise(exercise) ? '' : 'An exercise with this name already exists.';
    };
});