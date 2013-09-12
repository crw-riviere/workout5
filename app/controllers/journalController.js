wo5App.controller('JournalController', function ($scope, programService) {
    init();

    //function init() {
    //    programService.getPrograms();
    //    $scope.programs = programService.programs;
    //}

    function init() {
        programService.getPrograms().then(function (programs) {
            console.log('controller callback');
            $scope.programs = programs;
        });
    };

    $scope.editProgram = function (program) {
        program.isEditing = true;
    };

    $scope.addProgram = function () {
        programService.addProgram();
    };

    $scope.saveProgram = function (program) {
        program.isEditing = false;
    };

    $scope.deleteProgram = function (program) {
        programService.deleteProgram(program);
    }
});