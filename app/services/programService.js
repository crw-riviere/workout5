wo5App.service('programService', function (dbService) {
    var self = this;

    var consts = {
        store: {
            program: 'Program',
            exercise: 'Exercise',
            session: 'Session',
            set: 'Set'
        },
        index: {
            id: 'id',
            name: 'name',
            exercise: 'exercise',
            weight: 'weight'
        }
    };

    self.programs = [];
    //self.programs = [{ name: 'test' }];

    self.getPrograms = function () {
        
            self.programs = dbService.programs;
        
        
    };  

    self.addProgram = function ($scope) {
        dbService.putEntity({ name: 'Program', isEditing: true }, consts.store.program,
        function (newProgram) {
            $scope.$apply(function () {
                console.log('addProgram retrieved: ' + newProgram);
                self.programs.push(newProgram);                
            });
        });
    };

    self.deleteProgram = function ($scope,program) {
        dbService.removeEntity(program, consts.store.program, function () {
            $scope.$apply(function () {
                self.programs.splice(self.programs.indexOf(program), 1);
            })
        });
    };
});