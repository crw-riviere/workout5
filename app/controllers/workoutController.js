wo5App.controller('WorkoutController', function ($scope, $routeParams, resourceService, entityService) {
    init();

    function init() {
        $scope.weightMeasurement = resourceService.consts.measuement.weight.kg;

        entityService.getSession(parseInt($routeParams.sessionId)).then(function (session) {
            $scope.session = resourceService.getScopeEntity(session);
            $scope.exercises = [];

            angular.forEach(session.exercises, function (exerciseId) {
                entityService.getExercise(exerciseId).then(function (exercise) {
                    $scope.exercises.push(resourceService.getScopeEntity(exercise));
                })
            })

            entityService.getSetsBySession($scope.session.entity.id).then(function (sets) {
                $scope.sets = resourceService.getScopeEntityCollection(sets);
            })
        });
    };

    $scope.loadExercise = function (exercise) {
        $scope.exercise = exercise;

        var sessionExercise = [$scope.session.entity.prevSession, exercise.entity.id];
        console.log('session exercise:');
        console.debug(sessionExercise);
        entityService.getSetsBySessionExercise(sessionExercise).then(function (sets) {
            $scope.prevSessionExercises = resourceService.getScopeEntityCollection(sets);
        })
    };

    $scope.addSet = function () {
        var newSet = {
            entity: { no: $scope.sets.length + 1, session: $scope.session.entity.id, exercise: $scope.exercise.entity.id, reps: 0, weight: 0, measuement: $scope.weightMeasurement },
            operation: resourceService.consts.op.update
        };

        $scope.sets.push(newSet);
    };

    $scope.editSet = function (set) {
        set.operation = resourceService.consts.op.update;
    };

    $scope.saveSet = function (set) {
        entityService.saveSet(set.entity).then(function () {
            set.operation = resourceService.consts.op.read;
        });
    };

    $scope.deleteSet = function (set) {
        entityService.deleteSet(set.entity).then(function () {
            $scope.sets.splice($scope.sets.indexOf(set), 1);
        })
    };

    $scope.convertToKg = function () {
        angular.forEach($scope.exercise.sets, function (set) {
            if (set.weightMeasurement === resourceService.consts.measuement.weight.lbs) {
                var kgCalc = set.weightMeasurement * 0.45359237;
                var kgs = Math.round(kgCalc);
                set.weight = kgs;
                set.weightMeasurement = resourceService.consts.measuement.weight.kg;
            }
        });
        $scope.weightMeasurement = resourceService.consts.measuement.weight.kg;
    };

    $scope.convertToLbs = function () {
        angular.forEach($scope.exercise.sets, function (set) {
            if (set.weightMeasurement === resourceService.consts.measuement.weight.kg) {
                var kg = set.weight() / 0.45359237;
                var lbs = Math.floor(kg);
                set.weight = lbs;
                set.measurement = resourceService.consts.measuement.weight.lbs
            }
        });
        $scope.weightMeasurement = resourceService.consts.measuement.weight.lbs
    };
});