wo5App.service('resourceService', function () {
    var self = this;
    self.db = {}
    self.consts = {
        db: { wo5: 'WO5' },
        op: {
            create: 'create',
            read: 'read',
            update: 'update',
            rw: 'readwrite'
        },
        store: {
            program: 'Program',
            day: 'Day',
            exercise: 'Exercise',
            session: 'Session',
            set: 'Set'
        },
        index: {
            id: 'id',
            program: 'program',
            day: 'day',
            name: 'name',
            exercise: 'exercise',
            session: 'session',
            sessionExercise: 'sessionExercise',
            dayExercise: 'dayExercise'
        },
        measurement: {
            weight: {
                kgs: 'kgs',
                lbs: 'lbs'
            }
        }
    };

    self.getWeightMeasurements = function () {
        return [self.consts.measurement.weight.kgs, self.consts.measurement.weight.lbs];
    }

    self.date = function () {
        var today = new Date();
        var dd = today.getDate();
        var mm = today.getMonth() + 1;
        var yyyy = today.getFullYear();
        var yy = ("" + yyyy).substr(2, 2);
        var h = today.getHours();
        var m = today.getMinutes()
        var s = today.getSeconds();

        if (dd < 10) { dd = '0' + dd }
        if (mm < 10) { mm = '0' + mm }

        return { year: yyyy, yearShort: yy, month: mm, day: dd, hour: h, minute: m, second: s };
    };

    self.validViewModelEntity = function (valEntity, entityCollection) {
        var valid = true;

        angular.forEach(entityCollection, function (scopeEntity) {
            if (scopeEntity.entity.id !== valEntity.entity.id &&
                angular.lowercase(scopeEntity.entity.name) === angular.lowercase(valEntity.entity.name)) {
                valid = false;
            }
        });

        return valid;
    };

    self.validEntity = function (valEntity, entityCollection) {
        var valid = true;

        if (entityCollection) {
            for (var i = 0; i < entityCollection.lenght; i++) {
                if (entityCollection[i].id !== valEntity.id &&
                    angular.lowercase(entityCollection[i].name) === angular.lowercase(valEntity.name)) {
                    return false;
                }
            }
        }

        return true;
    };

    self.validViewModelName = function (viewModel, viewModelCollection) {
        return self.validViewModelEntity(viewModel, viewModelCollection) && viewModel.entity.name !== '';
    }

    self.validEntityName = function (entity, entityCollection) {
        return self.validEntity(entity, entityCollection) && entity.name !== '';
    }

    self.getViewModel = function (entity, operation) {
        return { entity: entity || {}, operation: operation || self.consts.op.read, error: '' };
    };

    self.getViewModelCollection = function (entities, operation) {
        var entityCollection = [];
        angular.forEach(entities, function (entity) {
            entityCollection.push({ entity: entity, operation: operation || self.consts.op.read, error: '' });
        });

        return entityCollection;
    }

    self.getPerformTargetPercantage = function (perform, targetPerform) {
        if (perform > 0 && targetPerform > 0) {
            return ((perform / targetPerform) * 100).toFixed(2) + '%';
        }
        else {
            return 'N/A';
        }
    }

    self.convertSetsViewModelToKg = function (sets) {
        angular.forEach(sets, function (set) {
            if (set.entity.measurement === self.consts.measurement.weight.lbs) {
                var kgCalc = set.entity.perform * 0.45359237;
                var kgs = Math.round(kgCalc);
                set.entity.perform = kgs;
                set.entity.measurement = self.consts.measurement.weight.kgs;
            }
        });
        return sets;
    };

    self.convertSetsViewModelToLbs = function (sets) {
        angular.forEach(sets, function (set) {
            if (set.entity.measurement === self.consts.measurement.weight.kgs) {
                var kgs = set.entity.perform / 0.45359237;
                var lbs = Math.floor(kgs);
                set.entity.perform = lbs;
                set.entity.measurement = self.consts.measurement.weight.lbs
            }
        });

        return sets;
    };
});