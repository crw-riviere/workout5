wo5App.controller('ProgramController', function ($scope, entityService) {
    init();

    function init() {
        entityService.getPrograms().then(function (programs) {
            $scope.programs = programs;
        });

        $scope.programName = '';
        $scope.error = '';

        $scope.$watch('programName', function () {
            $scope.error = $scope.validProgram($scope.programName) ? 'Name free!' : 'Name exists.';
        });
    };

    $scope.editProgram = function (program) {
        program.isEditing = true;
    };

    $scope.addProgram = function (programName) {
        console.log('program name: ' + programName);
        var newProgram = { name: programName, days: [], isEditing: false };
        entityService.addProgram(newProgram).then(function (program) {
            $scope.programs.push(program);
            $scope.programName = '';
        })
    };

    $scope.saveProgram = function (program) {
        program.isEditing = false;
        entityService.saveProgram(program);
    };

    $scope.deleteProgram = function (program) {
        entityService.deleteProgram(program).then(function () {
            $scope.programs.splice($scope.programs.indexOf(program), 1);
        })
    }

    $scope.validProgram = function (programName) {
        var valid = true;
        angular.forEach($scope.programs, function (program) {
            if (angular.lowercase(program.name) === angular.lowercase(programName)) {
                valid = false;
            }
        });

        return valid;
    }
});