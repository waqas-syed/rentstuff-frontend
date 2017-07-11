﻿/*var rentApp = angular.module('rentApp');

rentApp.controller('postSignInFacebookController', ['$scope',
    function ($scope) {
        
        }
    ]);*/

window.common = (function () {
    var common = {};

    common.getFragment = function getFragment() {
        return parseQueryString(window.location.hash.substr(1));
        if (window.location.hash.indexOf("?") === 0) {
            return parseQueryString(window.location.hash.substr(1));
        } else {
            return {};
        }
    };

    function parseQueryString(queryString) {
        var data = {},
            pairs, pair, separatorIndex, escapedKey, escapedValue, key, value;

        if (queryString === null) {
            return data;
        }
        queryString = queryString.split("?");
        pairs = queryString[1].split("&");

        for (var i = 0; i < pairs.length; i++) {
            pair = pairs[i];
            separatorIndex = pair.indexOf("=");

            if (separatorIndex === -1) {
                escapedKey = pair;
                escapedValue = null;
            } else {
                escapedKey = pair.substr(0, separatorIndex);
                escapedValue = pair.substr(separatorIndex + 1);
            }

            key = decodeURIComponent(escapedKey);
            value = decodeURIComponent(escapedValue);

            data[key] = value;
        }

        return data;
    }

    return common;
})();

var fragment = common.getFragment();

window.location.hash = fragment.state || '';

window.opener.$windowScope.authCompletedCB(fragment);

window.close();

