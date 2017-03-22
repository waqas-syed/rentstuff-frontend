var rentApp = angular.module('rentApp');

rentApp.controller('uploadEditHouseController', ['$scope', '$state', '$stateParams', 'searchService', 'localStorageService', 'FileUploader', 'globalService', 'authService',
    function ($scope, $state, $stateParams, searchService, localStorageService, FileUploader, globalService, authService) {

        // SETTING UP VARIABLES
        $scope.propertySizes = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20'];
        $scope.ownerIsViewingHouse = false;
        $scope.checked = true;
        $scope.DimensionStringEmpty = false;
        $scope.numbersOnly = "^[0-9-]*$";
        $scope.propertyTypes = ['House', 'Apartment', 'Hostel', 'Hotel'];
        $scope.dimensionTypes = ['Marla', 'Kanal', 'Acre'];
        $scope.genderRestrictions = ['Families Only', 'Girls Only', 'Boys Only', 'No restriction'];

        // PHOTOS UPLOADER CONFIGURATION
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

        // EDIT HOUSE IF THE USER IS LOGGED-IN ANF HOUSE ID IS PROVIDED AS A PARAMETER
        if ($stateParams.houseid !== null && $stateParams.houseid !== undefined) {
            var searchParameters = { houseId: $stateParams.houseid };
            // Get teh house using the houseId
            searchService.searchHouses(searchParameters)
                .then(function(response) {
                    if (response.status === 200) {
                            // Check if the returned house is not null and the email is not empty
                            if (response.data !== null && response.data !== undefined &&
                                response.data.OwnerEmail !== null && response.data.OwnerEmail !== undefined) {
                                // Get the authorzation data to check user's identity
                                var authData = localStorageService.get('authorizationData');
                                if (authData) {
                                    // Compare the house's email with the current user's identity email, and see if they match
                                    if (authData.email === response.data.OwnerEmail) {
                                        // Show the data if the emails match and mark the house as such
                                        $scope.house = response.data;
                                        $scope.houseArea = new Object();
                                        $scope.houseArea.formatted_address = $scope.house.Area;
                                        if ($scope.house.BoysOnly) {
                                            $scope.genderRestriction = "Boys Only";
                                        }
                                        else if ($scope.house.GirlsOnly) {
                                            $scope.genderRestriction = "Girls Only";
                                        }
                                        else if ($scope.house.FamiliesOnly) {
                                            $scope.genderRestriction = "Families Only";
                                        } else {
                                            $scope.genderRestriction = "No Restriction";
                                        }
                                        // Parse Dimension into expected format
                                        var dimensionTypeAndStringValueArray = $scope.house.Dimension.split(" ");
                                        $scope.house.DimensionType = dimensionTypeAndStringValueArray[1];
                                        $scope.house.DimensionStringValue = dimensionTypeAndStringValueArray[0];
                                        
                                        var counter = 0;
                                        // Convert images from Base64 String to a file
                                        angular.forEach($scope.house.HouseImages,
                                            function(value, key) {
                                                var imageBase64 = value;
                                                var blob = new Blob([imageBase64], { type: 'image/jpg' });
                                                var file = new File([blob], counter + '.jpg');
                                                counter++;
                                                $scope.uploader.addToQueue(file);
                                            });

                                        $scope.ownerIsViewingHouse = true;
                                    }
                                }
                            }
                        }
                    },
                    function(error) {
                        console.log('Error while getting house for edit. Error : ' + error);
                    });
        }

        // UPLOAD PHOTOS
        var uploadPhotos = function (houseId) {
            if ($scope.uploader.queue.length === 0) {
                $state.go('house-details', { houseId: $scope.houseId });
            } else {
                var queue = $scope.uploader.queue;
                for (var i = 0; i < queue.length; i++) {
                    $scope.uploader.queue[i].headers.houseId = houseId;
                }
                $scope.uploader.uploadAll();
            }
        };

        // PHOTOS UPLOAD CALLBACKS
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

        // UPLOAD HOUSE
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
                            $scope.house.OwnerEmail = authData.email;
                            $scope.house.OwnerName = authData.fullName;
                        }

                        if ($scope.ownerIsViewingHouse) {
                            searchService.editHouse($scope.house)
                                .then(function (response) {
                                    if (response.status === 200) {
                                        console.log('Edited House Successfuly');
                                        $scope.houseId = $scope.house.Id;
                                        // Upload photos for this house
                                        uploadPhotos($scope.houseId);
                                    } else {
                                        console.log('Error while editing house:' + error);
                                    }
                                });
                        } else {
                            // Upload the house to the server API through HTTP using the searchService
                            searchService.uploadHouse($scope.house)
                                .then(function(response) {
                                    if (response.status === 200) {
                                        console.log('Uploaded House Successfuly');
                                        $scope.houseId = response.data;
                                        // Upload photos for this house
                                        uploadPhotos($scope.houseId);
                                    } else {
                                        console.log('Error while uploading house:' + error);
                                    }
                                });
                        }
                    }
                }
            },
            function(error) {
                console.log('Error while uploading house');
            };

        // GET PHOTOS BY EMAIL
        searchService.getHousesByEmail()
            .then(function(response) {
                    $scope.houses = response;
                },
                function(error) {
                    console.log(error);
                });

        // GET PROPERTY SIZES
        $scope.getPropertySizes = function(min, max, step) {
            step = step || 1;
            var input = [];
            for (var i = min; i <= max; i += step) {
                input.push(i);
            }
            return input;
        };

        // AUTOCOMPLETE RESTRICTED TO PAKISTAN ONLY
        $scope.autocompleteOptions = {
            componentRestrictions: { country: 'pk' },
            types: ['geocode']
        }

        // GO TO HOUSE DETAILS PAGE
        $scope.navigateToDetails = function(houseId) {
            $state.go('house-details', { houseId: houseId });
        };
    }
]);