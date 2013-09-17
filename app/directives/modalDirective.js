wo5App.directive("modal", function () {
    return {
        restrict: "E",
        scope: {
            title: "@",
            text: "@",
            name: "=",
            error: "=",
            validate: "&",
            create: "&"
            

        },
        templateUrl: '/app/views/directives/createModal.html',
        replace: true,
        transclude: false,
        link: function (scope, element, attrs, controller) {
        }
    }
});