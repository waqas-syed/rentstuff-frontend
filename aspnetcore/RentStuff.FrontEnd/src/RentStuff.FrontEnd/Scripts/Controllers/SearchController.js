var rentApp = angular.module('rentApp');

rentApp.controller('SearchController', ['$scope', '$window', '$http', function ($scope, $window, $http) {
        $http
            .get('http://localhost:2431/v1/property-types')
            .then(function (response) {
                $window.alert('Http Get success');
            }).catch(function (e) {
                $window.alert('Http Get Failure');
                throw e;
            }).finally(function () {
                
            });
    //var config = { email: "somene@someplace.com" };
    /*$http.get('http://localhost:2431/v1/property-types').then(function successCallback(response) {
        // this callback will be called asynchronously when the response is available
        $window.alert('Http Get success');
    }, function errorCallback(response) {
        // called asynchronously if an error occurs or server returns response with an error status.
        $window.alert('Http Get failure');
    });*/
}]);