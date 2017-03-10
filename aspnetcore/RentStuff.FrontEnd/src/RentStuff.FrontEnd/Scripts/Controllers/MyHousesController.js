var rentApp = angular.module('rentApp');

rentApp.controller('myHousesController', ['$scope', '$state', '$stateParams', 'searchService', 'localStorageService', 'FileUploader', 'globalService',
    function ($scope, $state, $stateParams, searchService, localStorageService, FileUploader, globalService) {

        $scope.checked = true;
        $scope.DimensionStringEmpty = false;
        var bearerToken = '';
        var authData = localStorageService.get('authorizationData');
        if (authData) {
            bearerToken = 'Bearer ' + authData.token;

            // create a uploader with options
            var uploader = $scope.uploader = new FileUploader({
                scope: $scope, // to automatically update the html. Default: $rootScope
                url: globalService.serverUrl + 'HouseImageUpload',
                removeAfterUpload: true,
                headers: {
                    'Authorization': bearerToken
                }
            });
        }
        // How in the world did a non-authenticated user got here man?
        else {
            $state.go('home');
        }

        var uploadPhotos = function(houseId) {
            var queue = $scope.uploader.queue;
            for (var i = 0; i < queue.length; i++) {
                $scope.uploader.queue[i].headers.houseId = houseId;
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
                if ($scope.house !== null && $scope.house !== undefined) {
                    // Only one of Families, Girls or Boys value is allowed.
                    if ($scope.genderRestriction === "Families Only") {
                        $scope.house.FamiliesOnly = true;
                    } else if ($scope.genderRestriction === "Girls Only") {
                        $scope.house.GirlsOnly = true;
                    } else if ($scope.genderRestriction === "Boys Only") {
                        $scope.house.BoysOnly = true;
                    }
                    // If the DimensionType is not empty but the DimensionString value is, then do not proceed instead show the error
                    // to the user on the UI
                    if ($scope.house.DimensionType !== null &&
                        $scope.house.DimensionType !== undefined &&
                        ($scope.house
                            .DimensionStringValue ===
                            null ||
                            $scope.house.DimensionStringValue === undefined)) {
                        $scope.DimensionStringEmpty = true;
                    } else {
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
                    }
                }
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