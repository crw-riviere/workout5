wo5App.controller('SessionController', function ($scope, $routeParams,resourceService, entityService) {
    init();

    function init() {
       
        var programs = entityService.getPrograms().then(function (programs) {
            $scope.programs = programs;
        });

        if ($routeParams.sessionId) {
            console.log('sessionId param');
            entityService.getSession(parseInt($routeParams.sessionId)).then(function (session) {
                $scope.session = session;
            })
        }
    };

    $scope.loadProgram = function (program) {
        $scope.program = program;
    };

    $scope.loadDay = function (day) {      
        $scope.day = day;
        var programId = parseInt($scope.program.id);
        var dayId = day.name;
        var workout = [programId, dayId];
        console.log(workout);
        entityService.getSessionsByWorkout(workout).then(function (sessions) {
            $scope.sessions = sessions;
        })
    };

    $scope.loadSession = function (session) {
        $scope.session = session;
    };

    $scope.addSession = function () {
        var sessionExercises = [];
        for (var i = 0; i < $scope.day.exercises.length; i++) {
            sessionExercises.push($scope.day.exercises[i]);
        }

        var newSession = { name: getDateString(), program: $scope.program.id, day: $scope.day.name, exercises: sessionExercises, date: getDateObject() };
        entityService.addSession(newSession).then(function (session) {
            $scope.sessions.push(session)
        });
    };   

    function getDateString() {
        var date = resourceService.date();

        return date.day + '/' + date.month + '/' + date.yearShort;
    };

    function getDateObject() {
        return resourceService.date();
    }
});