$(document).ready(function () {
    var wo5 = {
        opReadWrite: 'readwrite',
        dbName: 'WO5',
        tblProgramName: 'tblProgram',
        tblDayName: 'tblDay',
        tblExerciseName: 'tblExercise',
        tblSessionName: 'tblSession',
        tblSetName: 'tblSet'
    };

    var BreadCrumbVM = function (data) {
        self = this;
        this.crumbs = ko.observableArray(data.crumbs);
    };

    var BaseViewModel = function (data) {
        this.id = data.id;
        this.name = data.name;
        this.type = data.type;
        this.childType = data.childType;
        this.editable = ko.observable(data.editable);
    };

    var Workout5VM = function () {
        var self = this;

        self.ProgramVM = function (data) {
            this.id = data.id;
            this.name = ko.observable(data.name);
            this.type = 'Program';
            this.childType = 'Day';
            this.editable = ko.observable(data.editable);
        };

        self.DayVM = function (data) {
            this.id = data.id;
            this.parentId = data.parentId;
            this.name = ko.observable(data.name);
            this.type = 'Day';
            this.childType = 'Exercise';
            this.editable = ko.observable(data.editable);
        };

        self.ExerciseVM = function (data) {
            this.id = data.id;
            this.parentId = data.parentId;
            this.name = ko.observable(data.name);
            this.type = 'Exercise';
            this.childType = 'Session';
            this.editable = ko.observable(data.editable);
        };

        self.SessionVM = function (data) {
            this.id = data.id;
            this.parentId = data.parentId;
            this.name = ko.observable(data.name);
            this.type = 'Session';
            this.childType = 'Set';
            this.editable = ko.observable(data.editable);
        };

        self.SetVM = function (data) {
            this.id = data.id;
            this.parentId = data.parentId;
            this.type = 'Set';
            this.name = ko.observable(data.name);
            this.reps = ko.observable(data.reps);
            this.weight = ko.observable(data.weight);
            this.editable = ko.observable(data.editable);
        };

        self.listProgram = ko.observableArray();
        self.listDay = ko.observableArray();
        self.listExercise = ko.observableArray();
        self.listSession = ko.observableArray();
        self.listSet = ko.observableArray();
        self.entityStack = ko.observableArray();

        self.InitDB = function () {
            var request = window.indexedDB.open(wo5.dbName, 1);

            request.onupgradeneeded = function () {
                console.log('Upgrading Database...');
                var db = request.result;

                var storeProgram = db.createObjectStore(wo5.tblProgramName, { keyPath: 'id', autoIncrement: true });
                console.log('Created table: ' + wo5.tblProgramName);
                var storeDay = db.createObjectStore(wo5.tblDayName, { keyPath: 'id', autoIncrement: true });
                console.log('Created table: ' + wo5.tblDayName);
                var storeExercise = db.createObjectStore(wo5.tblExerciseName, { keyPath: 'id', autoIncrement: true });
                console.log('Created table: ' + wo5.tblExerciseName);
                var storeExercise = db.createObjectStore(wo5.tblSessionName, { keyPath: 'id', autoIncrement: true });
                console.log('Created table: ' + wo5.tblSessionName);
                var storeExercise = db.createObjectStore(wo5.tblSetName, { keyPath: 'id', autoIncrement: true });
                console.log('Created table: ' + wo5.tblSetName);
            };

            request.onerror = function (ex) {
                console.log('Open Error: ' + ex.message);
            };

            request.onsuccess = function (event) {
                console.log('Opened Database: ' + event.target.result);
                wo5.db = request.result;

                self.loadTable('Program');
            };
        };

        self.loadTable = function (name) {
            var tblName = 'tbl'.concat(name);
            var vmName = name.concat('VM');
            var listName = 'list'.concat(name);

            console.log('Loading table ' + tblName);

            var tbl = wo5.db.transaction(tblName, wo5.opReadWrite).objectStore(tblName);

            var csr = tbl.openCursor();

            csr.onsuccess = function (event) {
                var cursor = event.target.result;

                if (cursor) {
                    self[listName].push(new self[vmName](cursor.value));

                    cursor.continue();
                }
            };

            csr.onerror = function (event) {
                console.log('Cursor Error: ' + event);
            };
        };

        self.loadChildEntity = function (entity) {
            var childEntityType = entity.childType;
            var listName = 'list'.concat(childEntityType);

            if (self[listName]().length <= 0) {
                var tblName = 'tbl'.concat(childEntityType);
                var vmChildName = childEntityType.concat('VM');

                var tbl = wo5.db.transaction(tblName, wo5.opReadWrite).objectStore(tblName);

                var csr = tbl.openCursor();
                console.log('Loading table ' + tblName + ' where ' + vmChildName + '.parentId equals ' + entity.id);

                csr.onsuccess = function (event) {
                    var cursor = event.target.result;
                    if (cursor) {
                        if (cursor.value.parentId === entity.id) {
                            self[listName].push(new self[vmChildName](cursor.value));
                            console.log('Added ' + vmChildName + ' ' + cursor.value.id + ' to ' + listName);
                        }

                        cursor.continue();
                    }
                };

                csr.onerror = function (event) {
                    console.log('Cursor Error: ' + event);
                };
            }
        };

        self.gotoEntity = function (entity) {
            self.loadChildEntity(entity);

            if (self.entityStack().length > 0) {
                self.spliceEntityStack(entity);
                if (self.lastEntityStack().type === entity.type) {
                    self.entityStack.pop();
                }
            }

            self.entityStack.push(entity);
        };

        self.addEntity = function (name) {
            var tblName = 'tbl'.concat(name);
            var listName = 'list'.concat(name);
            var vmName = name.concat('VM');
            var tblEntity = wo5.db.transaction(tblName, wo5.opReadWrite).objectStore(tblName);

            var addResult = tblEntity.add({});

            addResult.onsuccess = function (event) {
                var entityParentId = self.lastEntityStack().id;
                self[listName].push(new self[vmName]({ id: event.target.result, parentId: entityParentId, name: '', editable: true }));
                console.log('Added entity ' + vmName + ' to ' + listName);
            };
        };

        self.saveEntity = function (entity) {
            entity.editable(false);

            var typeEntity = entity.type;
            console.log('typeEntity: ' + typeEntity);
            var tblName = 'tbl'.concat(typeEntity);
            var listName = 'list'.concat(typeEntity);

            var tblEntity = wo5.db.transaction(tblName, wo5.opReadWrite).objectStore(tblName);
            var saveRequest = tblEntity.put(ko.toJS(entity));

            saveRequest.onsuccess = function (event) {
                console.log('Updated entity: ' + event.target.result);
            };

            saveRequest.onerror = function (event) {
                console.log('Error updating entity: ' + event.message);
            };
        };

        self.deleteEntity = function (entity) {
            var typeEntity = entity.type;
            var tblName = 'tbl'.concat(typeEntity);
            var listName = 'list'.concat(typeEntity);

            var tblViewModel = wo5.db.transaction(tblName, wo5.opReadWrite).objectStore(tblName);
            var delRequest = tblViewModel.delete(entity.id);

            delRequest.onsuccess = function (event) {
                console.log('Removed entity: ' + event.target.result);
                self[listName].remove(entity);
            };

            delRequest.onerror = function (event) {
                console.log('Error updating entity: ' + event.message);
            };
        };

        self.spliceEntityStack = function (entity) {
            var index = self.entityStack.indexOf(entity);
            if (index !== -1) {
                var remain = self.entityStack().length - index;
                var length = self.entityStack().length;
                self.entityStack.splice(index + 1, length);
            }
        };

        self.setVisible = function (entity) {
            self.clearVisible();
            self['visible'.concat(entity.childType)](true);
        };

        self.clearVisible = function () {
            for (var prop in self) {
                if (~prop.indexOf('visible')) {
                    self[prop](false);
                }
            }
        };

        self.clearLists = function () {
            for (var prop in self) {
                if (~prop.indexOf('list')) {
                    self[prop]([]);
                }
            }
        };

        self.entityVisible = function (name) {
            return self.lastEntityStack().childType === name;
        };

        self.lastEntityStack = function () {
            if (self.entityStack().length <= 0) {
                return new BaseViewModel({ id: -1, type: 'Base', childType: 'Program' });
            }
            else {
                return self.entityStack()[self.entityStack().length - 1];
            }
        };

        self.InitDB();
    };

    ko.bindingHandlers.hidden = {
        update: function (element, valueAccessor) {
            ko.bindingHandlers.visible.update(element, function () {
                return !ko.utils.unwrapObservable(valueAccessor());
            });
        }
    };

    ko.applyBindings(new Workout5VM());
});