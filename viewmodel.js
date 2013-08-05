$(document).ready(function () {
    var BreadCrumbVM = function (data) {
        this.crumbs = ko.observableArray(data.crumbs);
    };

    var SetVM = function (data) {
        this.Id = ko.observable('SetData');
        this.date = ko.observable(data.date);
        this.reps = ko.observable(data.reps);
        this.weight = ko.observable(data.weight);
        this.vis = ko.observable(data.vis);
    };

    var SessionVM = function (data) {
        this.Id = ko.observable('SessionData');
        this.date = ko.observable(data.date);
        this.sets = ko.observableArray(data.sets);
        this.vis = ko.observable(data.vis);
    };

    var ExerciseVM = function (data) {
        this.Id = ko.observable('ExerciseData');
        this.name = ko.observable(data.name);
        this.sessions = ko.observableArray(data.sessions);
        this.vis = ko.observable(data.vis);
    };

    var SessionTypeVM = function (data) {
        this.Id = ko.observable('SessionTypeData');
        this.name = ko.observable(data.name);
        this.exercises = ko.observable(data.exercises);
        this.vis = ko.observable(data.vis);
    };

    var ProgramVM = function (data) {
        this.Id = ko.observable('ProgramData');
        this.name = ko.observable(data.name);
        this.sessionTypes = ko.observableArray(data.sessionTypes);
        this.vis = ko.observable(data.vis);
    };

    var Workout5VM = function () {
        var self = this;

        var set1 = new SetVM({ date: 'mon', reps: 5, weight: 25 });
        var set2 = new SetVM({ date: 'tue', reps: 4, weight: 20 });
        var set3 = new SetVM({ reps: 99, weight: 99 });
        var sess1 = new SessionVM({ date: 'mon', sets: [set1, set2] });
        var sess2 = new SessionVM({ date: 'tues', sets: [set1, set2] });
        var exer1 = new ExerciseVM({ name: 'DL', sessions: [sess1, sess2] });
        var sest1 = new SessionTypeVM({ name: 'Day 1', exercises: [exer1] });
        var sest2 = new SessionTypeVM({ name: 'Day 2', exercises: [exer1] });
        var prog1 = new ProgramVM({ name: 'prog1', sessionTypes: [sest1, sest2], vis: true });
        var prog2 = new ProgramVM({ name: 'prog1', sessionTypes: [sest1] });
        self.programs = ko.observableArray([prog1, prog2]);

        self.crumbs = ko.observableArray();

        self.selectedWorkoutData = ko.observable(this);
        self.selectedProgramData = ko.observable();
        self.selectedSessionTypeData = ko.observable();
        self.selectedSessionData = ko.observable();
        self.selectedExerciseData = ko.observable();
        self.selectedSetData = ko.observable();

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

                    self.crumbs().slice(index, remain);
                }
            }
        };

        self.addBreadCrumb = function (crumb) {
            self.crumbs.push(crumb);
        };

        self.clearForms = function () {
            //    self.selectedWorkoutData(null);
            //    self.selectedProgramData(null);
            //    self.selectedSessionTypeData(null);
            //    self.selectedSessionData(null);
            //    self.selectedExerciseData(null);
            //    self.selectedSetData(null);

            for (var prop in self) {
                if (~prop.indexOf('selected')) {
                    self[prop](null);
                }
            }
        };

        //self.addProgram = function (data) {
        //    self.programs.push(new ProgramVM({ name: data }));
        //};

        //self.addSet = function () {
        //    self.selectedExerciseData().sets.push(
        //        new SetVM({ reps: 0, weight: 0 }));
        //};

        //self.removeSet = function (set) {
        //    self.selectedExerciseData().sets.remove(set);
        //};
    };

    ko.applyBindings(new Workout5VM());
});