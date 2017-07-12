var rentApp = angular.module('rentApp');

rentApp.factory('globalService', function () {
    var defaultServerUrl = 'https://api.zarqoon.com/';
    return {
        serverUrl: defaultServerUrl + 'v1/',
        serverUrlWithoutVersion: defaultServerUrl,
        externalLoginUrl: defaultServerUrl +
        "v1/Account/ExternalLogin?provider=Facebook&response_type=token&client_id=zarqoon-frontend"
        + "&redirect_uri=" + defaultServerUrl + "signin-facebook"
    };
});