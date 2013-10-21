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
            sessionExercise: 'sessionExercise'
        },
        measuement: {
            weight: {
                kg: 'kg',
                lbs: 'lbs'
            }
        }
    };

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

        angular.forEach(entityCollection, function (entity) {
            if (entity.id !== valEntity.id &&
                angular.lowercase(entity.name) === angular.lowercase(valEntity.name)) {
                valid = false;
            }
        });

        return valid;
    };

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

    self.getWeightTargetPercantage = function (weight, targetWeight) {
        return ((setWeight / targetWeight) * 100).toFixed(2);
    }

    self.convertSetsToKg = function (sets) {
        angular.forEach(sets, function (set) {
            if (set.weightMeasurement === resourceService.consts.measuement.weight.lbs) {
                var kgCalc = set.weightMeasurement * 0.45359237;
                var kgs = Math.round(kgCalc);
                set.weight = kgs;
                set.weightMeasurement = resourceService.consts.measuement.weight.kg;
            }
        });

        return sets;
    };

    self.convertSetsToLbs = function (sets) {
        angular.forEach(sets, function (set) {
            if (set.weightMeasurement === resourceService.consts.measuement.weight.kg) {
                var kg = set.weight() / 0.45359237;
                var lbs = Math.floor(kg);
                set.weight = lbs;
                set.measurement = resourceService.consts.measuement.weight.lbs
            }
        });

        return sets;
    };
});