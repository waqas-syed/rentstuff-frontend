var rentApp = angular.module('rentApp');

rentApp.controller('preSignupController',
    [
        '$scope', '$state',
        function($scope, $state) {
            $scope.signupWithFacebook = function() {

            };

            scope.signupWithEmail = function() {
                $state.go('signup');
            };
        }
    ]);