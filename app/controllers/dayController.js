wo5App.controller('DayController', function ($scope, dayService) {
    init();

    function init() {
        dayService.getDays().then(function (days) {
            $scope.days = days;
        });
    };

    $scope.editDay = function (day) {
        day.isEditing = true;
    };

    $scope.addDay = function () {
        dayService.addDay();
    };

    $scope.saveDay = function (day) {
        day.isEditing = false;
    };

    $scope.deleteDay = function (day) {
        programService.deleteDay(day);
    }
});