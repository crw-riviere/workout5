wo5App.controller('ConfigController', function ($scope, entityService, resourceService) {
    init();

    function init() {
    };

    $scope.deleteDB = function () {
        entityService.deleteDB;
    }
});