var rentApp = angular.module('rentApp');

rentApp.controller('SearchResultController', ['$scope', '$state', '$stateParams', 'searchService', 'authService', 'pagerService',
    function ($scope, $state, $stateParams, searchService, authService, pagerService) {

        var searchParameters = null;
        $scope.ownerViewingOwnProperties = false;
        if ($stateParams !== null && $stateParams !== undefined) {
            
                // Email as parameter
            if ($stateParams.email !== null && $stateParams.email !== undefined && $stateParams.email !== "") {
                // Only serve this if the user is authenticated
                if (authService.authentication.isAuth) {
                    searchParameters = { email: $stateParams.email };
                    $scope.ownerViewingOwnProperties = true;
                }
            } else {
                if ($stateParams.location !== null && $stateParams.location !== undefined && $stateParams.location !== "") {
                    // Location and PropertyType as parameters
                    if ($stateParams.propertytype !== null &&
                        $stateParams.propertytype !== undefined &&
                        $stateParams.propertytype !== "") {
                        searchParameters = { area: $stateParams.location, propertyType: $stateParams.propertytype };
                    } else {
                        // Location as parameter
                        searchParameters = { area: $stateParams.location };
                    }
                }
            }
        }
        searchService.searchHouses(searchParameters)
            .then(function (response) {
                if (response.status === 200) {
                    $scope.houses = response.data;
                }
            });

        $scope.navigateToDetails = function(houseId) {
            $state.go('house-details', {houseId: houseId});
        };

        var vm = $scope.vm = this;

        var input = [];
        for (var i = 0; i <= 151; i++) {
            input.push(i);
        }
        vm.dummyItems = input; // dummy array of items to be paged
        vm.pager = {};
        vm.setPage = setPage;

        initController();

        function initController() {
            // initialize to page 1
            vm.setPage(1);
        }

        function setPage(page) {
            if (page < 1 || page > vm.pager.totalPages) {
                return;
            }

            // get pager object from service
            vm.pager = pagerService.GetPager(vm.dummyItems.length, page);

            // get current page of items
            vm.items = vm.dummyItems.slice(vm.pager.startIndex, vm.pager.endIndex + 1);
        }
}]);