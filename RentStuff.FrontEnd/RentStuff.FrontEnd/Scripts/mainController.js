'use strict';

var myApp = angular.module('app', []);

app.controller('MainController', ['$scope', '$window', function ($scope, $window) {
        $scope.getLocation = function () {
            $window.alert;
        };
}]);