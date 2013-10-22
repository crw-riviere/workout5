wo5App.controller('ProgramController', function ($scope, entityService, resourceService) {
    init();

    function init() {
        $scope.programs = [];
        entityService.getPrograms().then(function (programs) {
            angular.forEach(programs, function (program) {
                var loadedProgram = { entity: program, operation: resourceService.consts.op.read, error: '' };
                $scope.programs.push(loadedProgram);
            });
        });

        $scope.newProgram = { entity: { name: '' }, error: '' };
    };

    $scope.editProgram = function (program) {
        program.operation = resourceService.consts.op.update;
    };

    $scope.addProgram = function (program) {
        entityService.addProgram(program.entity).then(function (program) {
            var newProgram = { entity: program, operation: resourceService.consts.op.read, error: '' };
            $scope.programs.push(newProgram);
            $scope.newProgram.entity = { name: '' };
        })
    };

    $scope.saveProgram = function (program) {
        program.operation = resourceService.consts.op.read;
        program.error = '';
        entityService.saveProgram(program.entity);
    };

    $scope.deleteProgram = function (program) {
        entityService.deleteProgram(program.entity).then(function () {
            $scope.programs.splice($scope.programs.indexOf(program), 1);
        })
    };

    $scope.validProgram = function (program) {
        return resourceService.validViewModelName(program, $scope.programs);
    };

    $scope.validProgramFeedback = function (program) {
        program.error = $scope.validProgram(program) ? '' : 'A program with this name already exists.';
    };
});