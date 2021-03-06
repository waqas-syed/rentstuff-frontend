﻿var rentApp = angular.module('rentApp');

rentApp.factory('globalService', function () {
    var defaultServerUrl = 'https://api.zarqoon.com/';
    return {
        serverUrl: defaultServerUrl + 'v1/',
        serverUrlWithoutVersion: defaultServerUrl,
        externalLoginUrl: defaultServerUrl +
        "v1/Account/ExternalLogin?provider=Facebook&response_type=token&client_id=zarqoon-frontend"
        + "&redirect_uri=" + defaultServerUrl + "signin-facebook",
        getPropertyTypes: function () {
            return ['House (Whole/Portion)', 'Hostel', 'Apartment (Whole/Portion)', 'Hotel', 'Guest House'];
        },

        removePostfixHousePropertyType: function (propertyType) {
            // The House and Apartment are postfixed with "Whole or portion". Change it to House or Apartment only before sending it
            // to the backend
            if (propertyType !== '' && propertyType !== undefined) {
                // Check if the text contains House
                if (propertyType === "House (Whole/Portion)") {
                    // If so, discard everything else and just send House
                    propertyType = "House";
                }
                // Check if the text contains Apartment
                else if (propertyType === "Apartment (Whole/Portion)") {
                    // If so, discard everything else and just send Apartment
                    propertyType = "Apartment";
                }
            }
            return propertyType;
        },

        addPostfixHousePropertyType: function (propertyType) {
            // The House and Apartment must be postfixed with "Whole or portion" before being bound to the view
            if (propertyType !== '' && propertyType !== undefined) {
                // Check if the text is equal to House
                if (propertyType === "House") {
                    // If so, postfix it 
                    propertyType = "House (Whole/Portion)";
                }
                // Check if the text cis equal to Apartment
                else if (propertyType === "Apartment") {
                    // If so, postfix it
                    propertyType = "Apartment (Whole/Portion)";
                }
            }
            return propertyType;
        }
    };
});