wo5App.controller('JournalController', function ($scope, programService) {

    init();

    function init() {
        programService.getPrograms();
        $scope.programs = programService.programs;
    }

    $scope.editProgram = function (program) {
        program.isEditing = true;
    };

    $scope.addProgram = function () {
            programService.addProgram($scope);
       
    };

    $scope.saveProgram = function (program) {
        program.isEditing = false;
    };

    $scope.deleteProgram = function (program) {
        programService.deleteProgram($scope,program);
    }
});