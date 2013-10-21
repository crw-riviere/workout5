wo5App.controller('WorkoutController', function ($scope, $routeParams, $q, resourceService, entityService) {
    init();

    function init() {
        $scope.weightMeasurement = resourceService.consts.measuement.weight.kg;
        $scope.sessions = [];
        $scope.exercises = [];

        entityService.getPrograms().then(function (programs) {
            $scope.programs = programs;

            if (programs[0]) {
                $scope.loadProgram(programs[0]);
            }

            $('#mdlSessions').modal('show')
        });
    };

    $scope.loadProgram = function (program) {
        $scope.program = program;

        entityService.getDaysByProgram(program.id).then(function (days) {
            $scope.days = days;
            if (days[0]) {
                $scope.loadDay(days[0]);
            }
        })
    };

    $scope.loadDay = function (day) {
        $scope.day = day;
        entityService.getSessionsByDay(day.id).then(function (sessions) {
            $scope.sessions = resourceService.getViewModelCollection(sessions);
        })
    };

    $scope.startSession = function () {
        $scope.exercises = [];
        var newSession = {
            name: getDateString(),
            program: $scope.program.id,
            day: $scope.day.id,
            exercises: $scope.day.exercises,
            date: getDateString(),
            prevSession: $scope.sessions.length > 0 ? $scope.sessions[$scope.sessions.length - 1].entity.id : null
        }

        entityService.addSession(newSession).then(function (session) {
            $scope.session = resourceService.getViewModel(session);
            entityService.getExercisesByDay($scope.day).then(function (exercises) {
                $scope.exercises = resourceService.getViewModelCollection(exercises);
                $scope.loadExercise($scope.exercises[0]);
            })
        });
    }

    $scope.loadExercise = function (exercise) {
        $scope.exercise = exercise;

        var sessionExercise = [$scope.session.entity.id, exercise.entity.id];
        var prevSessionExercise = [$scope.session.entity.prevSession, exercise.entity.id];

        entityService.getSetsBySessionExercise(sessionExercise).then(function (sets) {
            $scope.sets = resourceService.getViewModelCollection(sets);
        })

        entityService.getSetsBySessionExercise(prevSessionExercise).then(function (sets) {
            $scope.prevSessionSets = resourceService.getViewModelCollection(sets);
        })

        entityService.getSetByExerciseWeightMax(exercise.entity.id).then(function (sets) {
            $scope.maxWeightSet = resourceService.getViewModel(sets);
        })
    };

    $scope.addSet = function () {
        var set = {
            no: $scope.sets.length + 1,
            day: $scope.day.id,
            session: $scope.session.entity.id,
            exercise: $scope.exercise.entity.id,
            reps: 0,
            weight: 0,
            measuement: $scope.weightMeasurement
        };

        entityService.addSet(set).then(function (newSet) {
            var set = resourceService.getViewModel(newSet);
            set.operation = resourceService.consts.op.update;
            $scope.sets.push(set);
        })
    };

    $scope.editSet = function (set) {
        set.operation = resourceService.consts.op.update;
    };

    $scope.saveSet = function (set) {
        entityService.saveSet(set.entity).then(function () {
            set.operation = resourceService.consts.op.read;
            set.weightMaxPercent = resourceService.getWeightTargetPercantage(set.entity.weight,);
        });
    };

    $scope.deleteSet = function (set) {
        entityService.deleteSet(set.entity).then(function () {
            $scope.sets.splice($scope.sets.indexOf(set), 1);
        })
    };

    function getDateString() {
        var date = resourceService.date();

        return date.day + '-' + date.month + '-' + date.yearShort;
    };
});