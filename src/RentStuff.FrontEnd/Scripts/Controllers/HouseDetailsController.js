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

        $scope.addSlide = function (image) {
            var newWidth = 600 + slides.length + 1;
            slides.push({
                //image: '//unsplash.it/' + newWidth + '/300',
                image: image.src,
                id: currIndex++
            });
        };

        $scope.randomize = function () {
            var indexes = generateIndexesArray();
            assignNewIndexesToSlides(indexes);
        };

        for (var i = 0; i < houseDetails.imagesArray.length; i++) {
            $scope.addSlide(houseDetails.imagesArray[i]);
        }

        // Randomize logic below

        function assignNewIndexesToSlides(indexes) {
            for (var i = 0, l = slides.length; i < l; i++) {
                slides[i].id = indexes.pop();
            }
        }

        function generateIndexesArray() {
            var indexes = [];
            for (var i = 0; i < currIndex; ++i) {
                indexes[i] = i;
            }
            return shuffle(indexes);
        }

        // http://stackoverflow.com/questions/962802#962890
        function shuffle(array) {
            var tmp, current, top = array.length;

            if (top) {
                while (--top) {
                    current = Math.floor(Math.random() * (top + 1));
                    tmp = array[current];
                    array[current] = array[top];
                    array[top] = tmp;
                }
            }

            return array;
        }
    }]);