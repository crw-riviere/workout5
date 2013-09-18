﻿wo5App.controller('WorkoutController', function ($scope, $routeParams, resourceService, entityService) {
    init();

    function init() {
        $scope.weightMeasurement = resourceService.consts.measuement.weight.kg;
        entityService.getSession(parseInt($routeParams.sessionId)).then(function (session) {
            $scope.session = session;
            $scope.exercise = session.exercises[0];
            var workout = [$scope.session.id, $scope.exercise.id];
            entityService.getSetsByWorkout(workout).then(function (sets) {
                $scope.sets = sets;
            })
        });
    };

    $scope.loadSets = function (exercise) {
        console.log('exercise: ' + exercise);
        $scope.exercise = exercise;
        var workout = [$scope.session.id, $scope.exercise.id];
        entityService.getSetsByWorkout(workout).then(function (sets) {
            $scope.sets = sets;
        })
    };

    $scope.addSet = function () {
        var newSet = { name: '', session: $scope.session.id, exercise: $scope.exercise.id, reps: 0, weight: 0, measuement: $scope.weightMeasurement, isEditing: true };
        entityService.addSet(newSet).then(function (set) {
            $scope.sets.push(set);
        })
    };

    $scope.editSet = function (set) {
        set.isEditing = true;
    };

    $scope.saveSet = function (set) {
        set.isEditing = false;
        entityService.saveSet(set).then(function (set) {
        });
    };

    $scope.deleteSet = function (set) {
        entityService.deleteSet(set).then(function () {
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