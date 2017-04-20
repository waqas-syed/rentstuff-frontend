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
        var imagesToDelete = [];
        
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
                                        // Only one of Families, Girls or Boys value is allowed.
                                        if ($scope.house.GenderRestriction === "FamiliesOnly") {
                                            $scope.genderRestriction = "Families Only";
                                        } else if ($scope.house.GenderRestriction === "GirlsOnly") {
                                            $scope.genderRestriction = "Girls Only";
                                        } else if ($scope.house.GenderRestriction === "BoysOnly") {
                                            $scope.genderRestriction = "Boys Only";
                                        } else {
                                            $scope.genderRestriction = "NoRestriction";
                                        }

                                        if ($scope.house.Dimension !== null && $scope.house.Dimension !== undefined) {
                                            // Parse Dimension into expected format
                                            var dimensionTypeAndStringValueArray = $scope.house.Dimension.split(" ");
                                            $scope.house.DimensionType = dimensionTypeAndStringValueArray[1];
                                            $scope.house.DimensionStringValue = dimensionTypeAndStringValueArray[0];
                                        }

                                        var counter = 0;
                                        // Convert images from Base64 String to a file
                                        angular.forEach($scope.house.HouseImages,
                                            function (value, key) {
                                                var imageBase64 = value.Base64String;

                                                // Creating a new blob
                                                var contentType = 'image/' + value.Type;
                                                var sliceSize = 512;

                                                var byteCharacters = atob(imageBase64);
                                                var byteArrays = [];

                                                for (var offset = 0; offset < byteCharacters.length; offset += sliceSize) {
                                                    var slice = byteCharacters.slice(offset, offset + sliceSize);

                                                    var byteNumbers = new Array(slice.length);
                                                    for (var i = 0; i < slice.length; i++) {
                                                        byteNumbers[i] = slice.charCodeAt(i);
                                                    }

                                                    var byteArray = new Uint8Array(byteNumbers);

                                                    byteArrays.push(byteArray);
                                                }

                                                var blob = new Blob(byteArrays, { type: contentType });
                                                // Creating a new blob
                                                //var blob = new Blob([imageBase64], { type: 'image/jpeg' });
                                                //var blob = new Blob([imageBase64]);
                                                var file = new File([blob], value.Name, { type: contentType, lastModified: new Date() });
                                                var fileItem = new FileUploader.FileItem($scope.uploader, file);
                                                fileItem._file = file;
                                                fileItem.progress = 100;
                                                fileItem.isUploaded = true;
                                                fileItem.isSuccess = true;
                                                $scope.uploader.queue.push(fileItem);
                                                counter++;
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
            var pendingImageFound = false;
            angular.forEach($scope.uploader.queue,
                function (value, key) {
                    if (!pendingImageFound) {
                        if (value !== null && value !== undefined && value.isUploaded === false) {
                            pendingImageFound = true;
                        }
                    }
                });
            if (pendingImageFound) {
                var queue = $scope.uploader.queue;
                for (var i = 0; i < queue.length; i++) {
                    $scope.uploader.queue[i].headers.houseId = houseId;
                }
                $scope.uploader.uploadAll();
                //$state.go('house-details', { houseId: $scope.houseId });
            } else {
                $state.go('house-details', { houseId: $scope.houseId });
            }
        };

        // PHOTOS UPLOAD CALLBACKS
        $scope.uploader.onCompleteAll = function() {
            console.log("All photos Uploaded successfully");
            $state.go('house-details', { houseId: $scope.houseId });
        }
        $scope.uploader.onSuccessItem = function(item, response, status, headers) {
            console.log("Photo Uploaded successfully. HouseId = " + item.headers.houseId + " | FileName = " + item._file.name);
        };
        $scope.uploader.onErrorItem = function (item, response, status, headers) {
            console.error("Error while uploading photo" + item.headers.houseId + " | FileName = " + item._file.name);
            $scope.uploadInProgress = false;
        };

        // DELETES THE IMAGES FROM THE SERVER FOR THE CURRENT HOUSE
        var deleteImagesFromServer = function () {
            var deleteParams = { HouseId: $scope.house.Id, ImagesList: imagesToDelete };
            searchService.deleteImage(deleteParams)
                .then(function (response) {
                    if (response.status === 200) {
                        console.log("Images deleted successfully. HouseId = " + $scope.house.Id);
                        // Now upload the photos for this house
                        uploadPhotos($scope.houseId);
                    }
                });
        }

        // UPLOAD HOUSE
        $scope.uploadHouse = function () {
                $scope.uploadInProgress = true;
                $scope.invalidPhoneNumber = false;
                $scope.errorReceived = false;
                if ($scope.house !== null && $scope.house !== undefined) {
                    // Only one of Families, Girls or Boys value is allowed.
                    if ($scope.genderRestriction === "Families Only") {
                        $scope.house.GenderRestriction = "FamiliesOnly";
                    } else if ($scope.genderRestriction === "Girls Only") {
                        $scope.house.GenderRestriction = "GirlsOnly";
                    } else if ($scope.genderRestriction === "Boys Only") {
                        $scope.house.GenderRestriction = "BoysOnly";
                    } else {
                        $scope.house.GenderRestriction = "NoRestriction";
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
                            // Remove the Image from the HouseImages list because the payload is way too high and results in timout during
                            // HTTP call
                            $scope.house.HouseImages = null;
                            searchService.editHouse($scope.house)
                                .then(function (response) {
                                    if (response.status === 200) {
                                        console.log('Edited House Successfuly');
                                        $scope.houseId = $scope.house.Id;
                                        // Delete and upload photos for this house. UploadPhotos is called from within the 
                                        // deleteImagesFromServer method below
                                        deleteImagesFromServer();
                                    } else {
                                        console.log('Error while editing house:' + error);
                                    }
                                });
                        } else {
                            // Upload the house to the server API through HTTP using the searchService
                            searchService.uploadHouse($scope.house)
                                .then(function (response) {
                                    if (response.status === 200) {
                                        console.log('Uploaded House Successfuly');
                                        $scope.houseId = response.data;
                                        // Upload photos for this house
                                        uploadPhotos($scope.houseId);
                                    } else {
                                        console.log('Error while uploading house:' + response.data.Message);
                                        if (response.data.Message === 'Invalid phone number') {
                                            $scope.invalidPhoneNumber = true;
                                            $scope.errorReceived = true;
                                        }
                                    }
                                });
                        }
                    }
                }
            },
            function(error) {
                console.log('Error while uploading house');
                $scope.uploadInProgress = false;
            };

        $scope.deleteImage = function (item) {
            imagesToDelete.push(item.file.name);
            $scope.uploader.removeFromQueue(item);
        }

        // GET PHOTOS BY EMAIL
        /*searchService.getHousesByEmail()
            .then(function(response) {
                    $scope.houses = response;
                },
                function(error) {
                    console.log(error);
                });*/

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