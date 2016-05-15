(function() {
    'use strict';
    
    angular
        .module('Playground', [])
        .directive('playground', playground);
    
    playground.$inject = ['$window', '$timeout', '$filter', '$http'];
    
    function playground($window, $timeout, $filter, $http) {
        
        function link(scope, element, attrs, controller, transcludeFn) {};
        
        var directive = {
            scope: true,
            restrict: 'AE',
            replace: 'true',
            controller: 'playgroundController',
            controllerAs: 'pc',
            link: link,
            bindToController: true            
        };
        
        return directive;
        
        function link(scope, element, attrs) {
            
        }        
    }
    
    // controller code
    
    
})();