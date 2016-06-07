(function () {
    'use strict';

    angular
        .module('Newsroom')
        .directive('mediaListing', mediaListing);

    mediaListing.$inject = ['$window', '$timeout', '$filter', '$http'];

    function mediaListing($window, $timeout, $filter, $http) {
        function link(scope, element, attrs, controller, transcludeFn) { };

        var directive = {
            scope: true,
            restrict: 'AE',
            replace: 'true',
            controller: mediaListingController,
            controllerAs: 'mlc',
            link: link,
            bindToController: true
        };

        return directive;

        function link(scope, element, attrs) {


            scope.$on('AnimateMediaGrid', function() {

                // cache variables
                var mediaGrid = angular.element('.media-listing__media-grid');
                var animationFade = 'animated fadeIn';
                var animationEnd = 'webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend';

                mediaGrid.addClass(animationFade).one(animationEnd, function() {
                    mediaGrid.removeClass(animationFade);
                });
            });

        }
    }

    mediaListingController.$inject = ['$scope', '$http', '$filter', '$timeout', '$window', '$interval', 'ApiService'];

    function mediaListingController($scope, $http, $filter, $timeout, $window, $interval, ApiService) {


        //========================================
        //  Initialise states, functions and alias
        //========================================
        var mlc = this;
        mlc.mediaCategory = 'all';

        // page setup variables
        mlc.pageSize = 12;
        mlc.initialLimit = 1;
        mlc.finalLimit = 12;

        mlc.mediaCategory = 'all';
        mlc.mediaType = 'all';

        // bind functions
        mlc.filterMediaType = filterMediaType;
        mlc.filterMediaCategory = filterMediaCategory;
        mlc.loadPage = loadPage;
        mlc.loadModal = loadModal;

        // initialise items array
        var items = {
            currentItems: [],
            prefetchItems: [],
            apiCall: null,
            broadcast: false
        };

        // initialise listing options in API call
        var listingOptions = {
            url: "/api/sitecore/medialisting/GetSearchMediaItemsJson?pageNumber={pageNumber}&category={category}&type={mediaType}&datasourceId=" + datasourceID + "&siteID=" + siteID,
            pageNumber : 1,
            category : 'all',
            mediaType: 'all'
        };

        // modify options in API
        var listingParams = {
            pageNumber: listingOptions.pageNumber,
            category : listingOptions.category,
            mediaType : listingOptions.mediaType
        };

        init(); // call init function


        //==========================
        //  External functions
        //==========================

        function init() {
            mlc.items = [];
            getInitialItems().then(function (data) {
                if (mlc.items.Remaining > 0) {
                    getPrefetchItems();
                }
                mlc.listingParams = listingParams; // Bind page number with plugin - for the view
            });
            $timeout(updatePageDisplay, 100);
        }

        function getInitialItems() {
            return getItems($filter('formatArguments')(listingOptions.url, listingParams)).then(function (data) {
                mlc.items = data;
                items.currentItems = data; // initial set of data
            });
        }

        // Get Request to API Service
        function getItems(url) {
            abortApiCall();
            items.currentItems = items.prefetchItems;
            return (items.apiCall = ApiService.get(url)).then(function (data) {
                if (angular.isDefined(data)) {
                    return data.data;
                }
            });
        }

        function abortApiCall() {
            return items.apiCall && items.apiCall.cancel();
        }

        function getPrefetchItems() {
            var listingParamsTemp = JSON.parse(JSON.stringify(listingParams));
            listingParamsTemp.pageNumber += 1;
            return getItems($filter('formatArguments')(listingOptions.url, listingParamsTemp)).then(function (data) {
                items.prefetchItems = data; // store data in prefetch items array
            });
        }

        function getMoreItems() {
            items.currentItems = items.prefetchItems;
            mlc.items = items.currentItems;
            return getItems($filter('formatArguments')(listingOptions.url, listingParams)).then(function (data) {
                items.currentItems = data;
                mlc.items = items.currentItems; // display the data to the view
            });
        }

        function updatePageDisplay() {

            if ((listingParams.pageNumber) * mlc.pageSize < mlc.items.Total) {
                mlc.initialLimit = (mlc.pageSize * (listingParams.pageNumber - 1) ) + 1 ;
                mlc.finalLimit = mlc.initialLimit + mlc.pageSize -1;

            } else {
                mlc.initialLimit = (mlc.pageSize * (listingParams.pageNumber - 1)) + 1;
                mlc.finalLimit = mlc.items.Total;
            }
        }

        //======================
        // Click handlers
        //======================

        function filterMediaType(type) {
            listingParams.pageNumber = 1; // reset pagination
            listingParams.mediaType = type;
            init(); // initialise values
            mlc.mediaType = type; // bind selected type for view
            $timeout(updatePageDisplay, 100);

        };

        function filterMediaCategory(category) {
            listingParams.pageNumber = 1; // reset pagination
            listingParams.category = category;
            init();
            mlc.mediaCategory = category;
            $timeout(updatePageDisplay, 100);

        }

        function loadPage(page) {
            listingParams.pageNumber = page;
            getMoreItems();
            $timeout(updatePageDisplay, 100);
            $scope.$broadcast('AnimateMediaGrid');
        }

        function loadModal(item) {
            mlc.item = item;
        }
    }

})();
