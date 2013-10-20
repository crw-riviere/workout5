var wo5App = angular.module('wo5App', []);

wo5App.config(function ($routeProvider, $locationProvider) {
    $routeProvider
    .when('/', {
        templateUrl: 'app/views/home.html',
        controller: 'HomeController'
    })
    .when('/Journal', {
        templateUrl: 'app/views/journal.html',
        controller: 'JournalController'
    })
    .when('/Settings', {
        templateUrl: 'app/views/settings.html',
        controller: 'SettingsController'
    })
    .when('/Programs', {
        templateUrl: 'app/views/program.html',
        controller: 'ProgramController'
    })
    .when('/Days', {
        templateUrl: 'app/views/day.html',
        controller: 'DayController'
    })
    .when('/Days/:programId', {
        templateUrl: 'app/views/day.html',
        controller: 'DayController'
    })
    .when('/Exercises', {
        templateUrl: 'app/views/exercise.html',
        controller: 'ExerciseController'
    })
    .when('/Exercises/:dayId', {
        templateUrl: 'app/views/exercise.html',
        controller: 'ExerciseController'
    })
    .when('/Sessions', {
        templateUrl: 'app/views/session.html',
        controller: 'SessionController'
    })
          .when('/Workout', {
              templateUrl: 'app/views/workout.html',
              controller: 'WorkoutController'
          })
    .when('/Workout/:sessionId', {
        templateUrl: 'app/views/workout.html',
        controller: 'WorkoutController'
    })
        .when('/Progress', {
            templateUrl: 'app/views/progress.html',
            controller: 'ProgressController'
        })
    .otherwise({ redirectTo: '/' });

    $locationProvider.html5Mode(true);
});