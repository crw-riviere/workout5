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
    .when('/Days', {
        templateUrl: 'app/views/day.html',
        controller: 'DayController'
    })
    .otherwise({ redirectTo: '/' });

    //$locationProvider.html5Mode(true);
});