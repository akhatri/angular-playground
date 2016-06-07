//Used for named arguments
(function () {
    'use strict';

    angular
        .module('Newsroom')
        .filter('formatArguments', formatArguments);

    function formatArguments() {
        return function (item, args) {

            // Loop through arguments and replace each value.
            angular.forEach(args, function (value, key) {
                item = item.replace(new RegExp('{' + key + '}', 'g'), value);
            });

            return item;
        };
    }
})();