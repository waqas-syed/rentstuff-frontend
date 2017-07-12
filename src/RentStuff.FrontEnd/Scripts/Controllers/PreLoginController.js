var rentApp = angular.module('rentApp');

rentApp.controller('preLoginController', ['$scope', '$state', 'authService', 'globalService',
    function ($scope, $state, authService, globalService) {
        $scope.loginWithFacebook = function () {

            window.$windowScope = $scope;

            window.open(globalService.externalLoginUrl, "Authenticate Account", "location=0,status=0,width=600,height=750");
        };

        $scope.loginWithEmail = function () {
            $state.go('login');
        };

        $scope.authCompletedCB = function (fragment) {

            $scope.$apply(function () {
                authService.externalLoginRequest($state, fragment)
                    .then(function (response) {
                        $state.go('home');
                    }, function (error) {
                        $scope.error = "Unable to register via Facebook";
                    });

            });
        }
    }
]);