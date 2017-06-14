(function () {
	'use strict';

	const app = angular.module('app', [
		'ngRoute',
		'jqueryModule',
		'bluebirdModule',
		'facebook'
	]);

	const contentProviderService = function () {
		function getTemplateUrl(fileName) {
			return 'partials/' + fileName;
		}
		return {
			getTemplateUrl: getTemplateUrl
		};
	};

	app.config(['$routeProvider', function ($routeProvider) {
		const ContentProvider = contentProviderService();
		$routeProvider.when('/', {
			templateUrl: ContentProvider.getTemplateUrl('main.html')
		}).when('/login', {
			templateUrl: ContentProvider.getTemplateUrl('login.html')
		}).otherwise('/');
	}]);

	app.config(['$locationProvider', function ($locationProvider) {
		$locationProvider.html5Mode(true);
		$locationProvider.hashPrefix('!');
	}]);

	app.config(function (FacebookProvider) {
		FacebookProvider.init('1563656153652814');
	});

	angular.module('jqueryModule', [])
		.factory('$', ['$window', function ($window) {
			return $window.jQuery;
		}]);

	angular.module('bluebirdModule', [])
		.factory('P', ['$window', function ($window) {
			return $window.P;
		}]);

	app.factory('ContentProvider', contentProviderService);

	app.controller('appCtrl', ['$scope', '$location', 'Facebook', function ($scope, $location, Facebook) {
		$scope.variable = 'Haaaallo world!';
		$scope.go = function(path) {
			$location.path(path);
		};
		$scope.stuff = 0;
		$scope.add = function() {
			$scope.stuff = $scope.stuff + 1;
		};


		$scope.$watch(function () {
			return Facebook.isReady();
		}, function (newVal) {
			$scope.facebookReady = true;
			console.log('fb ready');
		});

		$scope.login = function() {
			// From now on you can use the Facebook service just as Facebook api says
			Facebook.login(function(response) {
				// Do something with response.
				console.log('success!?', response);
			});
		};
	}]);

	app.controller('authenticationCtrl', function($scope, Facebook) {

		$scope.login = function() {
			// From now on you can use the Facebook service just as Facebook api says
			Facebook.login(function(response) {
				// Do something with response.
			});
		};

		$scope.getLoginStatus = function() {
			Facebook.getLoginStatus(function(response) {
				if(response.status === 'connected') {
					$scope.loggedIn = true;
				} else {
					$scope.loggedIn = false;
				}
			});
		};

		$scope.me = function() {
			Facebook.api('/me', function(response) {
				$scope.user = response;
			});
		};
	});

})();