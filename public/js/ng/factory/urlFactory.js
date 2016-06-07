(function () {
    'use strict';

    angular
        .module('Newsroom')
        .factory('UrlService', UrlService);

    UrlService.$inject = ['$window'];

    function UrlService($window) {
        var service = {
            getQueryString: getQueryString,
            getHash: getHash
        };

        return service;

        // Get query string from url.
        function getQueryString() {
            if ($window.location.search.length) {
                return ($window.location.search).replace(/(^\?)/, '').split("&").map(function (n) { return n = n.split("="), this[n[0]] = n[1], this }.bind({}))[0];
            }

            return {};
        }

        // Get hash from url.
        function getHash() {
            return $window.location.hash.substr(1);
        }
    }
})();
