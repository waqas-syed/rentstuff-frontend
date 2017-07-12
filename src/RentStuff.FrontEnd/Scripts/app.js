(function () {
    'use strict';

    var rentApp = angular.module('rentApp', ['ui.router', 'google.places', 'ngAnimate', 'ngSanitize', 'ui.bootstrap',
    'LocalStorageModule', 'angularFileUpload', 'ngLoadingSpinner']);

    rentApp.config(["$stateProvider", "$urlRouterProvider", "$httpProvider", "$locationProvider",
		function ($stateProvider, $urlRouterProvider, $httpProvider, $locationProvider) {
		    $locationProvider.html5Mode(true);
		    $httpProvider.interceptors.push('authInterceptorService');

		    $httpProvider.interceptors.push(function () {
		        return {
		            "request": function (config) {
		                if (config.url && config.url.endsWith(".html")) {
		                    config.headers["Content-Type"] = "text/html; charset=utf=8";
		                    config.headers["Accept"] = "text/html; charset=utf=8";
		                }
		                return config;
		            }
		        };
		    });

		    $httpProvider.defaults.useXDomain = true;
		    $httpProvider.defaults.withCredentials = true;
		    delete $httpProvider.defaults.headers.common["X-Requested-With"];
		    $httpProvider.defaults.headers.common["Accept"] = "application/json";
		    $httpProvider.defaults.headers.common["Content-Type"] = "application/json";
		    $httpProvider.defaults.headers.common["X-Requested-With"] = "XMLHttpRequest";
		    $urlRouterProvider.otherwise("/home");

		    $stateProvider
		        .state("home",
		        {
		             url: "/home", 
		             controller: "SearchController",
		             templateUrl: "/views/landing-page.html"
		        })
		        .state("login",
		        {
		            url: "/login",
		            controller: "loginController",
		            templateUrl: "/views/login.html",
		            permissions: { hideFromLoggedInUser: true } /*, controller: "OverviewController",*/
		            /* resolve: {

                         FastestAnimalService: "FastestAnimalService",

                         fastestAnimals: ["FastestAnimalService", function (FastestAnimalService) {
                             return FastestAnimalService.getAnimals();
                         }]
                     }*/
		        })
                .state("about-us",
		        {
		            url: "/about-us",
		            templateUrl: "/views/about-us.html"
                })
                .state("pre-signup",
		            {
                        url: "/pre-signup",
                        controller: "preSignupController",
                        templateUrl: "/views/pre-signup.html"
		            })
		        .state("signup",
		        {
		            url: "/signup",
		            controller: "signupController",
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
		            url: "/registration-confirmation?email",
                    templateUrl: "/views/registration-confirmation.html",
                    controller: "registrationConfirmationController"
		        })
		        .state("activate-account",
		        {
		            url: "/activate-account?email&activationcode",
		            controller: "activateAccountController",
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
		        })
		        .state("terms-and-conditions",
		        {
		            url: "/terms-and-conditions",
                    templateUrl: "/views/terms-and-conditions.html"
                })
                .state("post-external-login",
		        {
                    url: "/post-external-login",
                    templateUrl: "/views/post-external-login.html"
                    //controller: "postSignInFacebookController"
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

    rentApp.run(["$rootScope", "authService", "$state", "$anchorScroll", function ($rootScope, authService, $state, $anchorScroll) {

        authService.fillAuthData();
        $rootScope.$on('$stateChangeSuccess',
            function(event, next) {
                $anchorScroll();
            });
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

        $rootScope.$on('unauthorized', function () {
            authService.logOut();
            $state.go('login');
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
                                        //imagesArray.push({ src: 'data:image/' + value.Type + ';base64,' + value.Base64String });
                                        imagesArray.push({ src: value });
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