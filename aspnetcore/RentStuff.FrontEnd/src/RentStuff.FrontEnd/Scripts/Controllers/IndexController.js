'use strict';

var rentApp = angular.module('rentApp');
rentApp.controller('indexController', ['$scope', '$location', 'authService', function ($scope, $location, authService) {
 
    $scope.logOut = function () {
        authService.logOut();
        $location.path('/home');
    }
 
    $scope.authentication = authService.authentication;
 
}]);