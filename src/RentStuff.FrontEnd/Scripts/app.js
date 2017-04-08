(function () {
    'use strict';

    var rentApp = angular.module('rentApp', ['ui.router', 'google.places', 'ngAnimate', 'ngSanitize', 'ui.bootstrap',
    'ngMaterial', 'jkAngularCarousel', 'LocalStorageModule', 'angularFileUpload', 'ngLoadingSpinner']);

    rentApp.config(["$stateProvider", "$urlRouterProvider", "$httpProvider",
		function ($stateProvider, $urlRouterProvider, $httpProvider) {
		    $httpProvider.interceptors.push('authInterceptorService');

		    $httpProvider.defaults.useXDomain = true;
		    $httpProvider.defaults.withCredentials = true;
		    delete $httpProvider.defaults.headers.common["X-Requested-With"];
		    $httpProvider.defaults.headers.common["Accept"] = "application/json";
		    $httpProvider.defaults.headers.common["Content-Type"] = "application/json";
		    $urlRouterProvider.otherwise("/home");

		    $stateProvider
		        .state("home", { url: "/home", templateUrl: "/views/landing-page.html" })
		        .state("login",
		        {
		            url: "/login",
		            templateUrl: "/views/login.html",
		            permissions: { hideFromLoggedInUser: true } /*, controller: "OverviewController",*/
		            /* resolve: {

                         FastestAnimalService: "FastestAnimalService",

                         fastestAnimals: ["FastestAnimalService", function (FastestAnimalService) {
                             return FastestAnimalService.getAnimals();
                         }]
                     }*/
		        })
		        .state("signup",
		        {
		            url: "/signup",
		            templateUrl: "/views/signup.html",
                    permissions: { hideFromLoggedInUser: true}
		        })
		        .state("contact",
		        {
		            url: "/contact",
		            templateUrl: "/views/contact.html"
		        })
		        .state("forgot-password",
		        {
		            url: "/forgot-password",
                    controller: "passwordResetController",
		            templateUrl: "/views/forgot-password.html"
		        })
                .state("forgot-password-confirmation",
		        {
		            url: "/forgot-password-confirmation",
                    templateUrl: "/views/forgot-password-confirmation.html"
		        })
                .state("reset-password",
		        {
		            url: "/reset-password?email&resettoken",
		            controller: "passwordResetController",
		            templateUrl: "/views/reset-password.html"
		        })
		        .state("search-results",
		        {
		            url: "/search-results?location&propertytype&email",
		            templateUrl: "/views/search-results.html",
		            controller: "SearchResultController",
		            params: {
		                "location": "",
                        "propertytype": "",
                        "email": ""
		            }
		        })
		        .state("house-details",
		        {
		            url: "/house-details?houseId",
		            templateUrl: "/views/house-details.html",
		            params: {
		                "houseId": ""
		            },
		            controller: "HouseDetailsController",
		            resolve: {
		                houseDetails: ["resolveService", "$stateParams", function (resolveService, $stateParams) {
		                    return resolveService.getHouseDetails($stateParams.houseId);
		                }]
		            }
		        })
		        .state("registration-confirmation",
		        {
		            url: "/registration-confirmation",
		            templateUrl: "/views/registration-confirmation.html"
		        })
		        .state("activate-account",
		        {
		            url: "/activate-account?email&activationcode",
		            templateUrl: "/views/activate-account.html"
		        })
		        .state("upload-house",
		        {
		            url: "/upload-house",
		            controller: "uploadEditHouseController",
		            templateUrl: "/views/upload-house.html",
                    permissions: { redirectForNonLoggedInUser: true }
		        })
		        .state("edit-house",
		        {
		            url: "/edit-house?houseid",
		            controller: "uploadEditHouseController",
		            templateUrl: "/views/upload-house.html",
                    permissions: { redirectForNonLoggedInUser: true }
		        });
		    //.state("details", {
		    //  parent: "overview", url: "/details", templateUrl: "/templates/details.html"/*, controller: "DetailsController",*/
		    /*resolve: {
                FastestAnimalService: "FastestAnimalService",

                fastestAnimal: ["FastestAnimalService", "$stateParams", function (FastestAnimalService, $stateParams) {
                    var animalId = $stateParams.animalId;
                    console.log($stateParams.animalId);
                    return FastestAnimalService.getAnimal({ animalId: animalId });
                }]
            }*/
		    //})
		}
    ]
    );

    rentApp.run(["$rootScope", "authService", "$state", function ($rootScope, authService, $state) {

        authService.fillAuthData();
        $rootScope.$on('$stateChangeStart',
            function(event, next) {
                if (next.permissions !== null && next.permissions !== undefined) {
                    if (authService.authentication.isAuth) {
                        var hideFromLoggedInUser = next.permissions.hideFromLoggedInUser;
                        if (hideFromLoggedInUser !== undefined && hideFromLoggedInUser != null && hideFromLoggedInUser) {
                            event.preventDefault();
                            $state.go('home');
                        }
                    }
                    if (!authService.authentication.isAuth) {
                        var redirectForNonLoggedInUser = next.permissions.redirectForNonLoggedInUser;
                        if (redirectForNonLoggedInUser) {
                            event.preventDefault();
                            $state.go('login');
                        }
                    }
                }
            });
        $rootScope.$on('$stateChangeError',
            function(event, toState, toParams, fromState, fromParams, error) {
                console.log(event);
                console.log(toState);
                console.log(toParams);
                console.log(fromState);
                console.log(fromParams);
                console.log(error);
            });

        $rootScope.$on('$stateNotFound',
            function(event, unfoundState, fromState, fromParams) {
                console.log(event);
                console.log(unfoundState);
                console.log(fromState);
                console.log(fromParams);
            });

    }]);

    rentApp.factory("resolveService", ["$http", "globalService", function($http, globalService) {
            return {
                getHouseDetails: function(houseId) {
                    return $http.get(globalService.serverUrl + 'house', { params: { houseId: houseId } })
                        .then(function (response) {
                                var imagesArray = [];
                                angular.forEach(response.data.HouseImages,
                                    function (value, key) {
                                        imagesArray.push({ src: 'data:image/' + value.Type + ';base64,' + value.Base64String });
                                    });
                                return {house: response.data, imagesArray: imagesArray}
                            },
                            function(errResponse) {
                                console.error('Error while fetching users');
                                return errResponse;
                                //   return $q.reject(errResponse);
                            }
                        );
                }
            };
        }
    ]);
})();