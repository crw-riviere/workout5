$(document).ready(function () {
    var wo5 = {
        opReadWrite: 'readwrite',
        tblProgramName: 'tblProgramVM',
        tblDayName: 'tblDayVM'
    };

    var BreadCrumbVM = function (data) {
        self = this;
        this.crumbs = ko.observableArray(data.crumbs);
    };

    var SetVM = function (data) {
        self = this;
        self.id = data.id;
        self.sessionId = data.sessionId;
        self.type = ko.observable('SetData');
        self.editable = ko.observable(data.editable);
        self.date = ko.observable(data.date);
        self.reps = ko.observable(data.reps);
        self.weight = ko.observable();
    };

    var SessionVM = function (data) {
        self = this;
        self.id = data.id;
        self.exerciseId = data.exerciseId;
        self.type = ko.observable('SessionData');
        self.editable = ko.observable(data.editable);
        self.name = ko.observable(data.name);
        self.sets = ko.observableArray(data.sets);
    };

    var ExerciseVM = function (data) {
        self = this;
        self.id = data.id;
        self.dayId = data.dayId;
        self.type = ko.observable('ExerciseData');
        self.editable = ko.observable(data.editable);
        self.name = ko.observable(data.name);
        self.sessions = ko.observableArray(data.sessions);
    };

    var DayVM = function (data) {
        this.id = data.id;
        this.programId = data.programId;
        this.type = ko.observable('DayData');
        this.editable = ko.observable(data.editable);
        this.name = ko.observable(data.name);
    };

    var ProgramVM = function ProgramVM(data) {
        var self = this;
        self.id = data.id;
        self.editable = ko.observable(data.editable);
        self.name = ko.observable(data.name);
    };

    var Workout5VM = function () {
        var self = this;

        self.listProgramVM = ko.observableArray();
        self.listDayVM = ko.observableArray();
        self.crumbs = ko.observableArray();

        self.selectedWorkoutData = ko.observable(this);
        self.selectedProgramData = ko.observable();
        self.selectedDayData = ko.observable();
        self.selectedSessionData = ko.observable();
        self.selectedExerciseData = ko.observable();
        self.selectedSetData = ko.observable();

        self.InitDB = function () {
            var request = window.indexedDB.open("WO5", 3);

            request.onupgradeneeded = function () {
                console.log('Initiating upgrade...');
                var db = request.result;
                var storeProgram = db.createObjectStore(wo5.tblProgramName, { keyPath: 'id', autoIncrement: true });
                var storeDay = db.createObjectStore(wo5.tblDayName, { keyPath: 'id', autoIncrement: true });
            };

            request.onerror = function (event) {
                console.log('Error: ' + event);
            };

            request.onsuccess = function (event) {
                console.log('Success: ' + event);
                wo5.db = request.result;

                self.loadTable(ProgramVM);
            };
        };

        self.loadTable = function (viewModel) {
            var constructorName = new viewModel({}).constructor.name;
            var tblName = 'tbl'.concat(constructorName);
            console.log('Loading table ' + tblName);

            var listViewModel = 'list'.concat(constructorName);

            var tbl = wo5.db.transaction(tblName, wo5.opReadWrite).objectStore(tblName);

            var csr = tbl.openCursor();

            csr.onsuccess = function (event) {
                var cursor = event.target.result;

                if (cursor) {
                    self[listViewModel].push(new viewModel(cursor.value));
                    console.log('Added ' + cursor.value.name + ' to ' + listViewModel);

                    cursor.continue();
                }
            };
        };

        self.gotoExercise = function (exercise) {
            self.selectedExerciseData(exercise);
            self.selectedDayData(null);
            self.addBreadCrumb(exercise);
        };

        self.gotoSession = function (session) {
            self.selectedSessionData(session);
            self.selectedExerciseData(null);
            self.addBreadCrumb(session);
        };

        self.gotoSet = function (set) {
            self.selectedSetData(set);
            self.selectedSessionData(null);
            self.addBreadCrumb(set);
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

        self.addProgram = function () {
            var tblProgram = wo5.db.transaction(wo5.tblProgramName, wo5.opReadWrite).objectStore(wo5.tblProgramName);
            var addResult = tblProgram.add({});

            addResult.onsuccess = function (event) {
                self.programs.push(new ProgramVM({ id: event.target.result, name: '', editable: true }));
            };
        };

        self.deleteProgram = function (program) {
            var tblProgram = wo5.db.transaction(wo5.tblProgramName, wo5.opReadWrite).objectStore(wo5.tblProgramName);

            console.log('Program Id: ' + program.id);
            var delRequest = tblProgram.delete(program.id);

            delRequest.onsuccess = function (event) {
                console.log('Removed program: ' + event.target.result);
                self.programs.remove(program);
            };

            delRequest.onerror = function (event) {
                console.log('Error removing program: ' + event.message);
            };
        };

        self.saveProgram = function (program) {
            program.editable(false);
            var tblProgram = wo5.db.transaction(wo5.tblProgramName, wo5.opReadWrite).objectStore(wo5.tblProgramName);

            var saveRequest = tblProgram.put(ko.toJS(program));

            saveRequest.onsuccess = function (event) {
                console.log('Updated program: ' + event.target.result);
            };

            saveRequest.onerror = function (event) {
                console.log('Error updating program: ' + event.message);
            };
        };

        self.gotoProgram = function (program) {
            self.selectedProgramData(program);
            self.selectedWorkoutData(null);
            self.addBreadCrumb(program);
            self.loadDays();
        };

        self.gotoDay = function (day) {
            self.selectedDayData(day);
            self.selectedProgramData(null);
            self.addBreadCrumb(day);
        };

        self.addSession = function (session) {
            self.selectedExerciseData().sessions

                .push(new SessionVM({ name: '', sets: [], editable: true }));
        };

        self.saveSession = function (session) {
            console.log(session);
            session.editable(false);
        };

        self.deleteSession = function (session) {
            self.selectedExerciseData().sessions
            .remove(session);
        };

        self.addSet = function (set) {
            self.selectedSessionData().sets
            .push(new SetVM({ name: '', reps: 0, weight: 0, editable: true }));
        };

        self.saveSet = function (set) {
            console.log();
            localStorage.proj = ko.toJSON(self.programs);
        };

        self.deleteSet = function (set) {
            self.selectedSessionData().sets
            .remove(set);
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