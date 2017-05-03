var rentApp = angular.module('rentApp');

rentApp.controller('passwordResetController', ['$scope', '$state', '$stateParams', 'authService',
        function ($scope, $state, $stateParams, authService) {

            $scope.submitForgotPassword = function() {
                var forgotPasswordData = { email: $scope.email };
                authService.forgotPassword(forgotPasswordData)
                    .then(function(response) {
                            $state.go('forgot-password-confirmation');
                        },
                        function(error) {
                            if (error !== null &&
                                    error !== undefined &&
                                    error.Message !== null &&
                                    error.Message !== undefined
                            ) {
                                $scope.errorReceived = error.Message;
                            } else {
                                $scope.errorReceived = "Error while resetting password. Please try again later. " +
                                    "P.S., Make sure you have verified your email to activate your account";
                            }
                        });
            };

            $scope.resetPassword = function () {
                if (!$scope.password === $scope.confirmPassword) {
                    $scope.passwordsDontMatch = true;
                }
                var resetPasswordData = {
                    email: $stateParams.email,
                    token: $stateParams.resettoken,
                    password: $scope.password,
                    confirmPassword: $scope.confirmPassword
                };
                authService.resetPassword(resetPasswordData)
                    .then(function(response) {
                        $state.go('login');
                    }, function (error) {
                        if (error !== null && error !== undefined && error.Message !== null && error.Message !== undefined) {
                            $scope.errorReceived = error.Message;
                        } else {
                            $scope.errorReceived = "Could not reset password. Please try again later";
                        }
                    });
            };

        }]);