var rentApp = angular.module('rentApp');

rentApp.controller('SearchResultController', ['$scope', '$stateParams', function ($scope, $stateParams) {

    $scope.rent = '5000';
    $scope.houses = $stateParams.houseList;
}]);