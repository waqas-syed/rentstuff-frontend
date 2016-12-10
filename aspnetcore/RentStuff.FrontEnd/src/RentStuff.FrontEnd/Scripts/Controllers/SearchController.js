var rentApp = angular.module('rentApp');

rentApp.controller('SearchController', ['$scope', '$window', '$http', function ($scope, $window, $http) {
    
    $http.get('http://localhost:2431/v1/property-types')
            .then(function (response) {
                $scope.propertyTypes = response.data;
                $scope.selectedPropertyType = "Property Type";
            }).catch(function (e) {
                $window.alert('Http Get Failure');
                throw e;
            }).finally(function () {
                
            });
}]);