	var app = angular.module('TEST', []);
	app.directive('directiveTest', dt);
	dt.$inject = ['$window', '$timeout', '$filter', '$http'];

	function dt($window, $timeout, $filter, $http) {
	    function link(scope, element, attrs, controller, transcludeFn) {};


	    var directive = {
	        scope: true,
	        restrict: 'AE',
	        replace: 'true',
	        controller: testController,
	        controllerAs: 'dtc',
	        link: link,
	        bindToController: true
	    };
	    return directive;

	    function link(scope, element, attrs) {

	        scope.$on('DOMEvent', function() {
	            console.log('broadcast fired using a click in the controller');

	            var $imageGrid = $('.image-grid');
	            $imageGrid.append('<img src="http://lorempixel.com/200/200" />');

	        });

	        scope.$on('DOMEventRemove', function() {
	            console.log('broadcast fired using a click in the controller');

	            var $imageGrid = $('.image-grid');
	            var $images = $imageGrid.find('img');

	            console.log($images);
	            debugger;
	            for (i = 0; i < $images.length; i++) {
	                console.log('images counter');
	                console.log($images.length);
	                $images.splice($images.length, 1);
	            }
	            // debugger;
	            //$images.pop();       
	            //$images.splice(4, 1);
	            //console.log('images length ' + $images.length);

	        });

	        scope.$on('JSONEvent', function(dtc) {
	            console.log('JSON event broadcast fired');

	            $photoGrid = $('.jsonPhotoGrid');

	            $photoGrid.append('{{photos.src}}');

	        });


	        element.on('click', function() {
	            //console.log('click the directive div');
	        });
	    }

	}

	testController.$inject = ['$scope', '$http', '$filter', '$timeout', '$window', '$interval'];

	function testController($scope, $http, $filter, $timeout, $window, $interval) {
	    var dtc = this;

	    $scope.init = function() {
	        console.log('hello init');
	        dtc.showImage = false;
	        dtc.toggleCounter = 0;
	        dtc.state = true;
	        dtc.classToggle = true;
	    }

	    $scope.resetCounter = function() {
	        dtc.toggleCounter = 0;
	    }

	    $scope.toggleImage = function() {
	        dtc.showImage = !dtc.showImage; // toggling
	        dtc.toggleCounter++; // increment counter

	        dtc.classToggle = !dtc.classToggle; // toggle the class
	        dtc.state = !dtc.state; // toggle the class

	    }

	    $scope.appendImage = function() {
	        $scope.$broadcast('DOMEvent');
	    }

	    $scope.removeImage = function() {
	        $scope.$broadcast('DOMEventRemove');
	    }

	    $scope.JSONAdd = function() {
	        //	        $http.get('http://jsonplaceholder.typicode.com/photos')
	        //	            .success(function (response) {
	        //	                //$scope.dtc.photos = response.records;
	        //                dtc.records = response.records;
	        //	            });

	        console.log('json button clicked');

	        $http({
	                method: 'GET',
	                url: 'http://jsonplaceholder.typicode.com/photos'
	            })
	            .then(function(response) {
	                $scope.photos = response.data;
	                console.log(response);
	                console.log($scope.photos + ' from controller');
	            })


	        $scope.$broadcast('JSONEvent', $scope.photos);

	    }



	    // setup list of images as an array
	    dtc.imageList = [{
	        src: 'http://lorempixel.com/150/150',
	        caption: 'initial caption'
	    }, {
	        src: 'http://lorempixel.com/150/150',
	        caption: 'initial caption'
	    }, {
	        src: 'http://lorempixel.com/150/150',
	        caption: 'initial caption'
	    }];

	    // setup list of images as an array
	    dtc.photos = [{
	        src: 'http://lorempixel.com/150/150'
	    }, {
	        src: 'http://lorempixel.com/150/150'
	    }, {
	        src: 'http://lorempixel.com/150/150'
	    }];

	    $scope.addImage = function() {
	        // dtc.showImage = true; // show the image first
	        console.log('add');
	        dtc.imageList.push({
	            src: 'http://lorempixel.com/150/150',
	            caption: 'added caption'
	        });
	    }

	    $scope.deleteImage = function() {
	        // dtc.showImage = true; // show the image first            
	        console.log('delete');
	        dtc.imageList.pop();
	    }

	    $scope.deleteThisImage = function(index) {
	        console.log('fired!!!');
	        console.log(index);
	        dtc.imageList.splice(index, 1);
	    }

	}
