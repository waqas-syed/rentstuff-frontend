var rentApp = angular.module('rentApp');

rentApp.controller('postExternalLoginController', ['$scope', '$stateParams',
    function ($scope, $stateParams) {
        var redirectData = {
            external_access_token: $stateParams.external_access_token,
            provider: $stateParams.provider,
            haslocalaccount: $stateParams.haslocalaccount,
            email: $stateParams.email,
            full_name: $stateParams.full_name
        }

        if (window.opener !== null && window.opener !== undefined) {

            window.opener.$windowScope.authCompletedCB(redirectData);

            window.close();
        }
    }]);

/*window.common = (function () {
    var common = {};

    common.getFragment = function getFragment() {
        return parseQueryString(window.location.href.substr(1));
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
        if (queryString[1] === null || queryString[1] === undefined) {
            return data;
        }
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

if (window.opener !== null && window.opener !== undefined) {

    window.opener.$windowScope.authCompletedCB(fragment);

    window.close();
}
*/