$(document).ready(function () {
    var wo5 = {
        opReadWrite: 'readwrite',
        tblProgramName: 'Program'
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
        self = this;
        self.id = data.id;
        self.programId = data.programId;
        self.type = ko.observable('DayData');
        self.editable = ko.observable(data.editable);
        self.name = ko.observable(data.name);
        self.exercises = ko.observableArray(data.exercises);
    };

    var ProgramVM = function (data) {
        self = this;
        self.id = data.id;
        self.type = ko.observable('ProgramData');
        self.editable = ko.observable(data.editable);
        self.name = ko.observable(data.name);
    };

    var Workout5VM = function () {
        var self = this;

        self.programs = ko.observableArray();
        self.crumbs = ko.observableArray();

        self.selectedWorkoutData = ko.observable(this);
        self.selectedProgramData = ko.observable();
        self.selectedSessionTypeData = ko.observable();
        self.selectedSessionData = ko.observable();
        self.selectedExerciseData = ko.observable();
        self.selectedSetData = ko.observable();

        self.InitDB = function () {
            var request = window.indexedDB.open("WO5", 1);

            request.onupgradeneeded = function () {
                console.log('Initiating upgrade...');
                var db = request.result;
                var storeBook = db.createObjectStore(wo5.tblProgramName, { keyPath: 'id', autoIncrement: true });
            };

            request.onerror = function (event) {
                console.log('Error: ' + event.message);
            };

            request.onsuccess = function (event) {
                console.log('Success: ' + event);
                wo5.db = request.result;
                self.loadProjects();
            };
        };

        self.loadProjects = function () {
            var txProgram = wo5.db.transaction(wo5.tblProgramName, wo5.opReadWrite);
            var tblProgram = txProgram.objectStore(wo5.tblProgramName);
            var csrProgram = tblProgram.openCursor();

            csrProgram.onsuccess = function (event) {
                var cursor = event.target.result;

                if (cursor) {
                    console.log('cursor ' + cursor.key + ': ' + cursor.value);

                    console.log(cursor.value);
                    self.programs.push(new ProgramVM(cursor.value));
                    cursor.continue();
                }
            };
        };

        self.gotoProgram = function (program) {
            self.selectedProgramData(program);
            self.selectedWorkoutData(null);
            self.addBreadCrumb(program);
        };

        self.gotoSessionType = function (sessionType) {
            self.selectedSessionTypeData(sessionType);
            self.selectedProgramData(null);
            self.addBreadCrumb(sessionType);
        };

        self.gotoExercise = function (exercise) {
            self.selectedExerciseData(exercise);
            self.selectedSessionTypeData(null);
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
            self.programs.push(new ProgramVM({ name: '', editable: true }));
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
            var txProgram = wo5.db.transaction(wo5.tblProgramName, wo5.opReadWrite);
            var tblProgram = txProgram.objectStore(wo5.tblProgramName);

            var addRequest = tblProgram.add(ko.toJS(program));

            addRequest.onsuccess = function (event) {
                console.log('Added program: ' + event.target.result);
                program.editable(false);
            };

            addRequest.onerror = function (event) {
                console.log('Error adding program: ' + event.message);
            };
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