wo5App.service('programService', function ($q, $rootScope, resourceService, dbService) {
    var self = this;

    self.programs = [];

    self.getPrograms = function () {
        var deferred = $q.defer();

        dbService.getEntities(resourceService.consts.store.program, function (storePrograms) {
            $rootScope.$apply(function () {
                console.log('service callback');
                self.programs = storePrograms;
                deferred.resolve(self.programs);
            });
        });

        return deferred.promise;
    };

    self.saveProgram = function (program) {
        dbService.putEntity(program, resourceService.consts.store.program,
        function (newProgram) {
            $rootScope.$apply(function () {
                console.log('programService: saved program ' + newProgram.id);
            });
        });
    }

    self.addProgram = function () {
        dbService.putEntity({ name: 'Program', isEditing: true }, resourceService.consts.store.program,
        function (newProgram) {
            $rootScope.$apply(function () {
                console.log('programService: adding new program ' + newProgram.id);
                self.programs.push(newProgram);
            });
        });
    };

    self.deleteProgram = function (program) {
        dbService.removeEntity(program, resourceService.consts.store.program, function () {
            $rootScope.$apply(function () {
                self.programs.splice(self.programs.indexOf(program), 1);
            })
        });
    };
});