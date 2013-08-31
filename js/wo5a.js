$(document).ready(function () {
    wo5 = {
        dbName: 'WO5A',
        tblProgramName: 'Program',
        opReadWrite: 'readwrite',
    };

    var BaseViewModel = function (data) {
        this.id = ko.observable(data.id);
        this.name = ko.observable(data.name);
        this.childs = ko.observableArray(data.childs);
        this.type = ko.observable(data.type);
        this.editable = ko.observable(data.editable);
    };

    var SetViewModel = function (data) {
        BaseViewModel.call(this, data);
        this.reps = ko.observable(data.reps);
        this.weight = ko.observable(data.weight);
    };

    SetViewModel.prototype = Object.create(BaseViewModel.prototype);

    var WO5VM = function () {
        var self = this;
        //var p1 = new BaseViewModel({type:'Program', name: 'One' });

        self.listProgram = ko.observable(new BaseViewModel({ type: 'Program', childs: [] }));

        self.selectedProgram = ko.observable(null);
        self.selectedDay = ko.observable(null);
        self.selectedExercise = ko.observable(null);
        self.selectedSession = ko.observable(null);
        self.selectedSet = ko.observable(null);

        self.initDB = function () {
            var request = window.indexedDB.open(wo5.dbName, 1);

            request.onupgradeneeded = function () {
                console.log('Upgrading Database...');
                var db = request.result;

                var storeEntity = db.createObjectStore(wo5.tblProgramName, { autoIncrement: true });
                //var storeEntity = db.createObjectStore(wo5.tblProgramName, { keyPath: 'id', autoIncrement: true });
                storeEntity.createIndex('nameIndex', 'name', { unique: true });
                storeEntity.createIndex('idIndex', 'id', { unique: true });
                console.log('Created table: ' + wo5.tblProgramName);
            };

            request.onerror = function (ex) {
                console.log('Open Error: ' + ex.message);
            };

            request.onsuccess = function (event) {
                console.log('Loaded Database: ' + event.target.result);
                wo5.db = request.result;

                self.loadTable(wo5.tblProgramName);
            };
        };

        self.deleteDB = function () {
            var request = window.indexedDB.deleteDatabase(wo5.dbName);

            request.onsuccess = function (event) {
                console.log('Delete Database: ' + event.target);
            };

            request.onerror = function (event) {
                console.log('Delete Error: ' + ex.message);
            };
        };

        self.loadTable = function (tblName) {
            var listName = 'list'.concat(tblName);

            console.log('Loading table ' + tblName);

            var tbl = wo5.db.transaction(tblName, wo5.opReadWrite).objectStore(tblName);

            var csr = tbl.openCursor();

            csr.onsuccess = function (event) {
                var cursor = event.target.result;

                if (cursor) {
                    console.log('Cursor entity: ' + cursor.key)

                    //var parsedVM = self.parseViewModel(cursor.value);
                    var parsedVM = ko.mapping.fromJS(cursor.value);
                    parsedVM.id(cursor.key);
                    self[listName]().childs.push(parsedVM);

                    console.log('Loaded viewmodel: ' + parsedVM.type() + ' ' + parsedVM.id());

                    cursor.continue();
                }
            };

            csr.onerror = function (event) {
                console.log('Cursor error: ' + event);
            };
        };

        self.parseViewModel = function (entity) {
            switch (entity.type) {
                case "Set":
                    {
                        var parsedVM = new SetViewModel(entity);
                        break;
                    }

                default:
                    {
                        var parsedVM = new BaseViewModel(entity);
                        break;
                    }
            }

            var childViewModels = ko.observableArray();

            ko.utils.arrayForEach(parsedVM.childs(), function (childEntity) {
                var childVM = self.parseViewModel(childEntity);
                childViewModels.push(childVM);
            });

            parsedVM.childs = childViewModels;
            parsedVM.editable(false);
            return parsedVM;
        };

        self.gotoEntity = function (entity) {
            console.log('entity type: ' + entity.type());
            for (var prop in self) {
                if (~prop.indexOf('selected'.concat(entity.type()))) {
                    self[prop](entity);
                    console.log('Populated: ' + 'selected'.concat(entity.type()));
                }
            }
        };

        self.saveEntity = function (entity) {
            console.log('Updating entity: ' + ' ' + entity.name());
            self.updateStoreEntity(entity);
        };

        self.addStoreEntity = function (entity) {
            var entityStore = wo5.db.transaction(wo5.tblProgramName, wo5.opReadWrite).objectStore(wo5.tblProgramName);

            var addResult = entityStore.add(ko.toJS(entity));

            addResult.onsuccess = function (event) {
                console.log('Adding entity: ' + entity.type + ' ' + newEntityId);
            };

            addResult.onerror = function (event) {
                console.log('Error adding entity: ' + error.target.error);
            };
        };

        self.updateStoreEntity = function (entity) {
            var entityStore = wo5.db.transaction(wo5.tblProgramName, wo5.opReadWrite).objectStore(wo5.tblProgramName);

            var updateResult = entityStore.put(ko.mapping.toJS(entity), entity.id());

            updateResult.onsuccess = function (event) {
                console.log('Updated entity: ' + entity.type() + ' ' + entity.id());
            };

            updateResult.onerror = function (event) {
                console.log('Error updating entity: ' + error.target.error);
            };
        };

        self.addEntity = function (entity, entityType) {
            entity.childs.push(new BaseViewModel({ id: -1, name: entityType, type: entityType, editable: true }));
        };

        self.setEditable = function (entity) {
            entity.editable(!entity.editable());
            if (entity.editable() === false) {
                self.savePrograms();
            }
        };

        self.addProgram = function () {
            var newProgram = new BaseViewModel({ type: 'Program', editable: true });
            var entityStore = wo5.db.transaction(wo5.tblProgramName, wo5.opReadWrite).objectStore(wo5.tblProgramName);
            var addRequest = entityStore.put(ko.toJS(newProgram));
            addRequest.onsuccess = function (event) {
                var newEntityId = event.target.result;
                console.log('Added entity: ' + newProgram.type + ' ' + newEntityId);
                console.log('Updating entity id: ' + newProgram.type + ' ' + newEntityId);
                newProgram.id = newEntityId;
                self.updateStoreEntity(newProgram);
                self.listProgram().childs.push(newProgram);
            };

            addRequest.onerror = function (error) {
                console.log('Error adding entity: ' + error.target.error);
            };
        };

        self.deleteProgram = function (program) {
            var entityStore = wo5.db.transaction(wo5.tblProgramName, wo5.opReadWrite).objectStore(wo5.tblProgramName);
            var deleteRequest = entityStore.delete(program.id);

            deleteRequest.onsuccess = function (event) {
                self.listProgram().childs.remove(program);
                console.log('Removed entity: ' + program.type + ' ' + program.id);
            };

            deleteRequest.onerror = function (event) {
                console.log('Error deleting entity: ' + error.target.error);
            };
        };

        self.addExercise = function () {
            var newExercise = new BaseViewModel({ name: 'Exercise', type: 'Exercise', editable: false })
            self.selectedDay().childs.push(newExercise);
            self.gotoEntity(newExercise);
        }

        self.deleteExercise = function (exercise) {
            self.selectedDay.childs().remove(exercise);
            self.savePrograms();
        };

        self.addSession = function () {
            var sessionId;
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

            sessiondId = dd + '' + mm + '' + yyyy + h + m + s;
            today = dd + '/' + mm + '/' + yy;

            var newSession = new BaseViewModel({ id: sessiondId, name: today, type: 'Session', editable: true });
            self.selectedExercise().childs.unshift(newSession);
            self.gotoEntity(newSession);
        };

        self.deleteSession = function (session) {
            self.selectedExercise().childs.remove(session);
            self.savePrograms();
        };

        self.addSet = function (session) {
            var newSet = new SetViewModel({ type: 'Set', editable: true, reps: 5, weight: 5 });
            self.selectedSession(session);
            self.selectedSession().childs.push(newSet);
            self.selectedSet(newSet);
        };

        self.deleteSet = function (set) {
            self.selectedSession.childs().remove(set);
            self.savePrograms();
        };

        self.savePrograms = function () {
            ko.utils.arrayForEach(self.listProgram().childs(), function (program) { self.saveEntity(program) });
        };

        self.initDB();
    };

    ko.bindingHandlers.hidden = {
        update: function (element, valueAccessor) {
            ko.bindingHandlers.visible.update(element, function () {
                return !ko.utils.unwrapObservable(valueAccessor());
            });
        }
    };

    ko.applyBindings(new WO5VM());
});