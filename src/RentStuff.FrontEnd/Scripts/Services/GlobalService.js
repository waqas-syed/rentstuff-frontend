var rentApp = angular.module('rentApp');

rentApp.factory('globalService', function () {
    var defaultServerUrl = 'https://api.zarqoon.com/';
    return {
        serverUrl: defaultServerUrl + 'v1/',
        serverUrlWithoutVersion: defaultServerUrl
    };
});