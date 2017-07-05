var rentApp = angular.module('rentApp');

rentApp.controller('registrationConfirmationController', ['$scope', '$stateParams',
    function ($scope, $stateParams) {
        $scope.email = $stateParams.email;
    }])