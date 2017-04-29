var rentApp = angular.module('rentApp');

rentApp.controller('HouseDetailsController', ['$scope', '$state', '$stateParams', 'searchService', 'houseDetails', 'authService',
    function ($scope, $state, $stateParams, searchService, houseDetails, authService) {

        $scope.dataArray = houseDetails.imagesArray;
        $scope.readyToLoadCarousel = true;
        $scope.house = houseDetails.house;

        if (authService.authentication.isAuth) {
            if ($scope.house !== null && $scope.house !== undefined &&
                (authService.authentication.email === $scope.house.OwnerEmail)) {
                $scope.ownerIsViewingHouse = true;
            }
        };

        $scope.deleteHouse = function() {
            searchService.deleteHouse($scope.house.Id)
                .then(function(response) {
                        $state.go('search-results');
                    },
                    function(error) {
                        $scope.errorReceived = "Could not delete house due to technical issues. Please try again later";
                    });
        };


        $scope.myInterval = 5000;
        $scope.noWrapSlides = false;
        $scope.active = 0;
        var slides = $scope.slides = [];
        var currIndex = 0;

        $scope.addSlide = function (imageSrc) {
            slides.push({
                image: imageSrc,
                id: currIndex++
            });
        };

        for (var i = 0; i < houseDetails.imagesArray.length; i++) {
            $scope.addSlide(houseDetails.imagesArray[i].src);
        }
    }]);