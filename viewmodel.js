$(document).ready(function () {
    var wo5 = {
        opReadWrite: 'readwrite',
        dbName: 'WO5',
        tblProgramName: 'tblProgramVM',
        tblDayName: 'tblDayVM',
        tblExerciseName: 'tblExerciseVM',
        tblSessionName: 'tblSessionVM',
        tblSetName: 'tblSetVM'
    };

    var BreadCrumbVM = function (data) {
        self = this;
        this.crumbs = ko.observableArray(data.crumbs);
    };

    var BaseViewModel = function (data) {
        this.id = data.id;
        this.editable = ko.observable(data.editable);
        this.name = data.name;
    };

    var SetVM = function (data) {
        self = this;
        self.id = data.id;
        self.parentId = data.parentId;
        self.type = ko.observable('SetData');
        self.editable = ko.observable(data.editable);
        self.date = ko.observable(data.date);
        self.reps = ko.observable(data.reps);
        self.weight = ko.observable();
    };

    var Workout5VM = function () {
        var self = this;

        self.ProgramVM = function (data) {
            this.id = data.id;
            this.name = ko.observable(data.name);
            this.type = 'ProgramVM';
            this.childType = 'DayVM';
            this.editable = ko.observable(data.editable);
        };

        self.DayVM = function (data) {
            this.id = data.id;
            this.programId = data.programId;
            this.name = ko.observable(data.name);
            this.type = 'DayVM';
            this.childType = 'ExerciseVM';
            this.editable = ko.observable(data.editable);
        };

        self.ExerciseVM = function (data) {
            this.id = data.id;
            this.dayId = data.dayId;
            this.name = ko.observable(data.name);
            this.type = 'ExerciseVM';
            this.childType = 'SessionVM';
            this.editable = ko.observable(data.editable);
        };

        self.SessionVM = function (data) {
            this.id = data.id;
            this.exerciseId = data.exerciseId;
            this.name = ko.observable(data.name);
            this.type = 'SessionVM';
            this.childType = 'SetVM';
            this.editable = ko.observable(data.editable);
        };

        self.SetVM = function (data) {
            this.id = data.id;
            this.parentId = data.parentId;
            this.type = 'SetVM';
            this.name = ko.observable(data.name);
            this.reps = ko.observable(data.reps);
            this.weight = ko.observable(data.weight);
            this.editable = ko.observable(data.editable);
        };

        self.listProgramVM = ko.observableArray();
        self.listDayVM = ko.observableArray();
        self.listExerciseVM = ko.observableArray();
        self.listSessionVM = ko.observableArray();
        self.listSetVM = ko.observableArray();
        self.crumbs = ko.observableArray();

        self.selectedWorkoutVM = ko.observable(true);
        self.selectedProgramVM = ko.observable(false);
        self.selectedDayVM = ko.observable(false);
        self.selectedSessionVM = ko.observable(false);
        self.selectedExerciseVM = ko.observable(false);
        self.selectedSetVM = ko.observable(false);

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

                self.loadTable('ProgramVM');
            };
        };

        self.loadTable = function (viewModel) {
            var tblName = 'tbl'.concat(viewModel);
            console.log('Loading table ' + tblName);

            var listViewModel = 'list'.concat(viewModel);
            console.log('list: ' + listViewModel);

            var tbl = wo5.db.transaction(tblName, wo5.opReadWrite).objectStore(tblName);

            var csr = tbl.openCursor();

            csr.onsuccess = function (event) {
                var cursor = event.target.result;

                if (cursor) {
                    self[listViewModel].push(new self[viewModel](cursor.value));
                    console.log('Added ' + cursor.value.name + ' to ' + listViewModel);

                    cursor.continue();
                }
            };

            csr.onerror = function (event) {
                console.log('Cursor Error: ' + event);
            };
        };

        self.addEntity = function (viewModel) {
            var tblName = 'tbl'.concat(viewModel);
            var listName = 'list'.concat(viewModel);
            var tblViewModel = wo5.db.transaction(tblName, wo5.opReadWrite).objectStore(tblName);

            var addResult = tblViewModel.add({});

            addResult.onsuccess = function (event) {
                self[listName].push(new self[viewModel]({ id: event.target.result, name: '', editable: true }));
            };
        };

        self.saveEntity = function (viewModel, entity) {
            entity.editable(false);

            var tblName = 'tbl'.concat(viewModel);
            var listName = 'list'.concat(viewModel);

            var tblViewModel = wo5.db.transaction(tblName, wo5.opReadWrite).objectStore(tblName);
            var saveRequest = tblViewModel.put(ko.toJS(entity));

            saveRequest.onsuccess = function (event) {
                console.log('Updated entity: ' + event.target.result);
            };

            saveRequest.onerror = function (event) {
                console.log('Error updating entity: ' + event.message);
            };
        };

        self.deleteEntity = function (viewModel, entity) {
            var tblName = 'tbl'.concat(viewModel);
            var listName = 'list'.concat(viewModel);

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

        self.gotoEntity = function (viewModel, entity) {
            var isParent = false;
            var childVM;
            for (var prop in self) {
                if (~prop.indexOf('selected')) {
                    self[prop](false);
                }

                if (isParent === true) {
                    childVM = prop.toString();

                    isParent = false;
                };

                if (prop.toString() === viewModel) {
                    isParent = true;
                }
            }

            var selectedVM = 'selected'.concat(viewModel);
            self[selectedVM](true);
            self.loadTable(childVM);
        };

        self.gotoBreadCrumb = function (crumb) {
            for (var prop in self) {
                if (~prop.indexOf(crumb.Id())) {
                    console.log(prop);
                    console.log(~prop.indexOf(crumb.Id()));
                    self.clearForms();

                    self[prop](crumb);
                    var index = self.crumbs.indexOf(crumb);
                    var remain = self.crumbs().length - index;
                    console.log('index: ' + index + '\n rem: ' + remain);

                    self.crumbs.splice(index + 1, remain);
                }
            }
        };

        self.addBreadCrumb = function (crumb) {
            self.crumbs.push(crumb);
        };

        self.clearForms = function () {
            for (var prop in self) {
                if (~prop.indexOf('selected')) {
                    self[prop](null);
                }
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