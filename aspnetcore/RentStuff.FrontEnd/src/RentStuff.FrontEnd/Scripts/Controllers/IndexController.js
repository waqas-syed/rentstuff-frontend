'use strict';

var rentApp = angular.module('rentApp');
rentApp.controller('indexController', ['$scope', '$location', 'authService', '$state', function ($scope, $location, authService, $state) {

    $scope.authentication = { isAuth:false, userName:"" };
    $scope.logOut = function () {
        authService.logOut();
        $state.go('home');
    }
    
    $scope.authentication = authService.authentication;
 
}]);