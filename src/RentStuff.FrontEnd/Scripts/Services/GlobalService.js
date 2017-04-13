var rentApp = angular.module('rentApp');

rentApp.factory('globalService', function () {
    var defaultServerUrl = 'http://localhost:2431/';
    return {
        serverUrl: defaultServerUrl + 'v1/',
        serverUrlWithoutVersion: defaultServerUrl
    };
});