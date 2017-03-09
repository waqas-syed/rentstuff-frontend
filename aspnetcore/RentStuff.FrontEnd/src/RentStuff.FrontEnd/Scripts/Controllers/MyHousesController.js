var rentApp = angular.module('rentApp');

rentApp.controller('myHousesController', ['$scope', '$state', '$stateParams', 'searchService', 'localStorageService', 'FileUploader',
    function ($scope, $state, $stateParams, searchService, localStorageService, FileUploader) {

        // create a uploader with options
        var uploader = $scope.uploader = new FileUploader({
            scope: $scope,                          // to automatically update the html. Default: $rootScope
            url: 'http://localhost:2431/v1/HouseImageUpload'
            /*headers: {
                'X-CSRF-TOKEN': CSRF_TOKEN
            },*/
        });

        $scope.uploadPhotos = function() {
            var queue = $scope.uploader.queue;
            angular.forEach(queue,
                function (key, value) {
                    $scope.uploader.uploadAll();
                    console.log('');
                });
        };

        $scope.numbersOnly = "^[0-9-]*$";
        $scope.propertyTypes = ['House', 'Apartment', 'Hostel', 'Hotel'];
        $scope.dimensionTypes = ['Marla', 'Kanal', 'Acre'];
        $scope.genderRestrictions = ['Families Only', 'Girls Only', 'Boys Only', 'No restriction'];

        $scope.uploadHouse = function() {
            // Only one of Families, Girls or Boys value is allowed.
            if ($scope.genderRestriction === "Families Only") {
                $scope.house.FamiliesOnly = true;
            } else if ($scope.genderRestriction === "Girls Only") {
                $scope.house.GirlsOnly = true;
            } else if ($scope.genderRestriction === "Boys Only") {
                $scope.house.BoysOnly = true;
            }

            // Set the area from the Area object specified
            $scope.house.Area = $scope.houseArea.formatted_address;

            // Get the Owner's email from the LocalStorageService 
            var authData = localStorageService.get('authorizationData');
            if (authData) {
                $scope.house.OwnerEmail = authData.userName;
                $scope.house.OwnerName = authData.fullName;
            }

            // Upload the house to the server API through HTTP using the searchService
            searchService.uploadHouse($scope.house)
                .then(function(response) {
                    console.log('Uploaded House Successfuly');
                    $scope.houseId = response.houseId;
                    },
                    function(error) {
                        console.log('Error while uploading house:' + error);
                    });
        },
        function(error) {
            console.log('Error while uploading house');
        };

        searchService.getHousesByEmail()
            .then(function(response) {
                    $scope.houses = response;
                },
                function(error) {
                    console.log(error);
                });

        $scope.getPropertySizes = function(min, max, step) {
            step = step || 1;
            var input = [];
            for (var i = min; i <= max; i += step) {
                input.push(i);
            }
            return input;
        };

        // Autocomplete restricted to Pakistan only
        $scope.autocompleteOptions = {
            componentRestrictions: { country: 'pk' },
            types: ['geocode']
        }

        $scope.navigateToDetails = function(houseId) {
            $state.go('house-details', { houseId: houseId });
        };
    }
]);