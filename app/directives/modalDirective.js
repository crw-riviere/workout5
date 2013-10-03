﻿wo5App.directive("modal", function () {
    return {
        restrict: "E",
        scope: {
            modalid: '@',
            title: '@',           
            validation: '&',
            action: '&'
        },
        replace: true,
        transclude: true,
        templateUrl: '/app/views/directives/modal.html',
        link: function (scope, element, attrs, controller) {
        }
    }
});