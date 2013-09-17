wo5App.controller('DayController', function ($scope, $routeParams, entityService) {
    init();

    function init() {
        entityService.getProgram(parseInt($routeParams.programId)).then(function (program) {
            $scope.program = program;
        });
    }; 

    $scope.editDay = function (day) {
        day.isEditing = true;
    };

    $scope.addDay = function () {
        var newDay = { name: 'Day', exercises:[], isEditing: true };
        $scope.program.days.push(newDay);
        entityService.saveProgram($scope.program);
    };

    $scope.saveDay = function (day) {
        day.isEditing = false;
        entityService.saveProgram($scope.program);
    };

    $scope.deleteDay = function (day) {
        $scope.program.days.splice($scope.program.days.indexOf(day), 1);
        entityService.saveProgram($scope.program);
    }
});