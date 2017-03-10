var rentApp = angular.module('rentApp');

rentApp.controller('myHousesController', ['$scope', '$state', '$stateParams', 'searchService', 'localStorageService', 'FileUploader',
    function ($scope, $state, $stateParams, searchService, localStorageService, FileUploader) {

        $scope.checked = true;
        // create a uploader with options
        var uploader = $scope.uploader = new FileUploader({
            scope: $scope,                          // to automatically update the html. Default: $rootScope
            url: 'http://localhost:2431/v1/HouseImageUpload',
            removeAfterUpload: true/*,
            headers: {
                'HouseId': 'd48c8e37-4027-45da-bdc9-b906ecc9c4ff'
            }*/
        });

        var uploadPhotos = function(houseId) {
            var queue = $scope.uploader.queue;
            for (var i = 0; i < queue.length; i++) {
                uploader.queue[i].headers.houseId = houseId;
            }
            $scope.uploader.uploadAll();
        };

        /*$scope.upload = function () {
            uploadPhotos('d48c8e37-4027-45da-bdc9-b906ecc9c4ff');
            //console.log('Photos Uploaded successfully');
        };*/

        $scope.uploader.onCompleteAll = function() {
            console.log("All photos Uploaded successfully");
            $state.go('house-details', {houseId: $scope.houseId});
        }

        $scope.uploader.onSuccessItem = function(item, response, status, headers) {
            console.log("Photo Uploaded successfully. HouseId = " + item.headers.houseId + " | FielName = " + item._file.name);
        };

        $scope.uploader.onErrorItem = function (item, response, status, headers) {
            console.error("Error while uploading photo" + item.headers.houseId + " | FielName = " + item._file.name);
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
                    $scope.houseId = response;
                    // Upload photos for this house
                    uploadPhotos(houseId);
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