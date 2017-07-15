'use strict';

var rentApp = angular.module('rentApp');
rentApp.factory('authService', ['$http', '$q', 'localStorageService', 'globalService', function ($http, $q, localStorageService, globalService) {

    var authServiceFactory = {};

    var _authentication = {
        isAuth: false,
        userName: ""
    };

    var _saveRegistration = function (registration) {

        _logOut();

        return $http.post(globalService.serverUrl + 'account/register', registration)
            .then(function (response) {
                return response;
            })
            .catch(function (error) {
                return error;
            });;

    };

    var activateAccount = function(emailConfirmation) {
        return $http.post(globalService.serverUrl + 'account/activate-account', emailConfirmation)
            .then(function (response) {
                return response;
            })
            .catch(function(error) {
                return error;
            });
    }

    var _login = function (loginData) {

        var data = "grant_type=password&username=" + loginData.userName + "&password=" + loginData.password;

        var deferred = $q.defer();

        $http.post(globalService.serverUrlWithoutVersion + 'token', data, { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }).success(function (loginResponse) {

            _authentication.isAuth = true;
            _authentication.email = loginData.userName;
            
            $http.get(globalService.serverUrl + 'account/get-user', {params:{email:loginData.userName}}).success(function(response) {
                _authentication.fullName = response.FullName;
                localStorageService.set('authorizationData', {
                    token: loginResponse.access_token,
                    email: loginData.userName,
                    fullName: response.FullName
                });
                deferred.resolve(response);
            })
            .error(function (err, status) {
                _authentication.fullName = loginData.userName;
                localStorageService.set('authorizationData', {
                    token: loginResponse.access_token,
                    email: loginData.userName,
                    fullName: loginData.userName
                });
                //console.log('Error while retreiving user: ' + err);
                deferred.resolve(err);
            });
        }).error(function (err, status) {
            _logOut();
            deferred.reject(err);
        });

        return deferred.promise;

    };

    var _logOut = function () {

        localStorageService.remove('authorizationData');

        _authentication.isAuth = false;
        _authentication.fullName = "";
        _authentication.email = "";
    };

    var _forgotPassword = function (forgotPasswordData) {
        var deferred = $q.defer();
        $http.post(globalService.serverUrl + 'account/forgot-password', forgotPasswordData)
            .success(function(response) {
                //console.log(response);
                deferred.resolve(response);
            })
            .error(function(error) {
                //console.log(error);
                deferred.reject(error);
            });

        return deferred.promise;
    };

    var _resetPassword = function(resetPasswordData) {
        var deferred = $q.defer();
        $http.post(globalService.serverUrl + 'account/reset-password', resetPasswordData)
            .success(function (response) {
                //console.log(response);
                deferred.resolve(response);
            })
            .error(function (error) {
                //console.log(error);
                deferred.reject(error);
            });

        return deferred.promise;
    };

    var _fillAuthData = function() {

        var authData = localStorageService.get('authorizationData');
        if (authData) {
            _authentication.isAuth = true;
            _authentication.fullName = authData.fullName;
            _authentication.email = authData.email;
        }
    };

    // After login through the external source, maintain the login information for this user
    var _assignAuthDataAfterExternalLogin = function(deferred, response) {
        // Having the email and access token is a must. Cannot proceed without it.
        if (response.Email !== null &&
            response.Email !== undefined &&
            response.InternalAccessToken !== null &&
            response.InternalAccessToken !== undefined) {

            // Now check if FulName is recieved or not. If not, then assign the email to the full name
            var fullName = "";
            if (response.FullName !== null && response.FullName !== undefined && response.FullName !== '') {
                fullName = response.FullName;
            } else {
                fullName = response.Email;
            }
            _authentication.isAuth = true;
            _authentication.email = response.Email;
            _authentication.fullName = fullName;
            localStorageService.set('authorizationData',
                {
                    token: response.InternalAccessToken,
                    email: response.Email,
                    fullName: fullName
                });
            deferred.resolve(response);
        } else {
            _logOut();
            deferred.reject("Both Email and Access Token are required to proceed");
        }
    }

    // Register the user who is authenticating through an external source. This will automatically log the user in
    var _registerExternal = function (registerExternalData) {

        var deferred = $q.defer();

        $http.post(globalService.serverUrl + 'account/register-external', registerExternalData).success(function (response) {
            _assignAuthDataAfterExternalLogin(deferred, response);
        }).error(function (err, status) {
            _logOut();
            deferred.reject(err);
        });

        return deferred.promise;
    };

    // Log the user in who used an external source to log in
    var _obtainAccessToken = function (externalData) {

        var deferred = $q.defer();

        $http.get(globalService.serverUrl + 'account/obtain-local-access-token', { params: { provider: externalData.provider, externalAccessToken: externalData.externalAccessToken } }).success(function (response) {

            _assignAuthDataAfterExternalLogin(deferred, response);

        }).error(function (err, status) {
            _logOut();
            deferred.reject(err);
        });

        return deferred.promise;
    };

    var _externalLoginRequest = function ($state, fragment) {
        var deferred = $q.defer();
        if (fragment.haslocalaccount == 'False') {
            
            _logOut();

            this.externalAuthData = {
                provider: fragment.provider,
                fullName: fragment.full_name,
                email: fragment.email,
                externalAccessToken: fragment.external_access_token
            };
            var registerData = {
                FullName: this.externalAuthData.fullName,
                Email: this.externalAuthData.email,
                Provider: this.externalAuthData.provider,
                ExternalAccessToken: this.externalAuthData.externalAccessToken
            };
            _registerExternal(registerData)
                .then(function (response) {

                    //$scope.savedSuccessfully = true;
                    //console.log = "User has been registered successfully using external login";
                    //startTimer();
                    //$state.go('home');
                    deferred.resolve(response);
                }, function (error) {
                    //console.log = "User could not be registered using external login";
                    deferred.reject(error);
                });
        }
        else {
            // Obtain access token and redirect to home page
            var externalData = { provider: fragment.provider, internalId: fragment.external_access_token };
            _obtainAccessToken(externalData)
                .then(function (response) {
                    //console.log = "User has been logged in successfully using external login";
                    //$state.go('home');
                    deferred.resolve(response);
                }, function (err) {
                    //console.log = "User could not be logged in using external login";
                    deferred.reject(err);
                });
        }

        return deferred.promise;
    }

    authServiceFactory.saveRegistration = _saveRegistration;
    authServiceFactory.login = _login;
    authServiceFactory.logOut = _logOut;
    authServiceFactory.fillAuthData = _fillAuthData;
    authServiceFactory.forgotPassword = _forgotPassword;
    authServiceFactory.resetPassword = _resetPassword;
    authServiceFactory.authentication = _authentication;
    authServiceFactory.activateAccount = activateAccount;

    authServiceFactory.externalLoginRequest = _externalLoginRequest;
    //authServiceFactory.registerExternal = _registerExternal;
    //authServiceFactory.obtainAccessToken = _obtainAccessToken;

    return authServiceFactory;
}]);