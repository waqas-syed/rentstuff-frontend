var rentApp = angular.module('rentApp');

rentApp.controller('myHousesController', ['$scope', '$state', '$stateParams', 'searchService',
    function ($scope, $state, $stateParams, searchService) {

        searchService.getHousesByEmail()
            .then(function(response) {
                    $scope.houses = response;
                },
                function(error) {
                    console.log(error);
                });

        $scope.navigateToDetails = function (houseId) {
            $state.go('house-details', { houseId: houseId });
        };
    }]);