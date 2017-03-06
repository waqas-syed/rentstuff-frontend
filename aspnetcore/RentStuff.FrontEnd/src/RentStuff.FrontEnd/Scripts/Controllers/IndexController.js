'use strict';

var rentApp = angular.module('rentApp');
rentApp.controller('indexController', ['$scope', '$location', 'authService', '$state', function ($scope, $location, authService, $state) {

    $scope.isAuthenticated = function() {
        authService.fillAuthData();
        if (authService.authentication.isAuth) {
            return true;
        } else {
            return false;
        }
    };

    $scope.logOut = function () {
        authService.logOut();
        $state.go('home');
    }
    
    $scope.authentication = authService.authentication;
 
}]);