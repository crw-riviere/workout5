wo5App.controller('DayController', function ($scope, $routeParams, resourceService, entityService) {
    init();

    function init() {
        $scope.days = [];
        entityService.getProgram(parseInt($routeParams.programId)).then(function (program) {
            $scope.program = { entity: program };
            $scope.newDay = { entity: { name: '', program: $scope.program.entity.id, exercises: [] }, error: '' };

            entityService.getDaysByProgram(program.id).then(function (days) {
                angular.forEach(days, function (day) {
                    var loadedDay = resourceService.getViewModel(day);
                    $scope.days.push(loadedDay);
                });
            })
        });
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
});