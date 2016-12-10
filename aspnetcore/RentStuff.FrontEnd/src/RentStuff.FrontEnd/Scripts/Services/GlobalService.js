var rentApp = angular.module('rentApp');

rentApp.factory('globalService', function () {
    return {
        serverUrl: 'http://localhost:2431/v1/'
    };
});