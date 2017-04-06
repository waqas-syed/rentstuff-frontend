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

        $http.post('http://localhost:2431/token', data, { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }).success(function (loginResponse) {

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
                console.log('Error while retreiving user: ' + err);
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

    var _fillAuthData = function () {

        var authData = localStorageService.get('authorizationData');
        if (authData) {
            _authentication.isAuth = true;
            _authentication.fullName = authData.fullName;
            _authentication.email = authData.email;
        }
    }

    authServiceFactory.saveRegistration = _saveRegistration;
    authServiceFactory.login = _login;
    authServiceFactory.logOut = _logOut;
    authServiceFactory.fillAuthData = _fillAuthData;
    authServiceFactory.authentication = _authentication;
    authServiceFactory.activateAccount = activateAccount;

    return authServiceFactory;
}]);