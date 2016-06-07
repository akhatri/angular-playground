(function () {
    'use strict';

    angular
        .module('Newsroom')
        .factory('ApiService', ApiService);

    ApiService.$inject = ['$window', '$http', '$filter', '$q', 'UrlService'];

    function ApiService($window, $http, $filter, $q, UrlService) {
        var service = {
            get: get
        };

        return service;

        // Get result from api.
        function get(url) {
            var deferred = $q.defer(),
                queryString = UrlService.getQueryString(),
                request,
                promise;

            // Add mock info if it exists.
            if(queryString.sc_mocklocation){
                url = url + $window.location.search;
            }

            // Build request.
            request = $http.get(url, {timeout: deferred.promise});

            // Set up promise.
            promise = request
                .success(getComplete)
                .error(getFailed);

            // Success.
            function getComplete(response) {
                return response;
            }

            // Epic fail!
            function getFailed(response) {
                console.warn('API failed or cancelled.');

                return $q.reject( "API failed or cancelled." );
            }

            // Option to cancel request.
            promise.cancel = function() {
                deferred.resolve();
            };

            // Clean up stuff.
            promise.finally(
                function() {
                    promise.cancel = angular.noop;
                    deferred = request = promise = null;
                }
            );

            return promise;
        }
    }
})();
