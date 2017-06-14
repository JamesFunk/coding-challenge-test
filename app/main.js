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
			templateUrl: ContentProvider.getTemplateUrl('login.html')
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
		$scope.loggedIn = false;
		$scope.user = {};
		$scope.go = function(path) {
			$location.path(path);
		};

		$scope.login = function() {
			if(!$scope.loggedIn) {
				Facebook.login(function(response) {
					if(response.status === 'connected') {
						$scope.loggedIn = true;
						$location.path('/');
					} else {
						console.log('Login failed');
					}
				});
			} else {
				$location.path('/');
			}
		};

		$scope.logout = function () {
			Facebook.logout();
			$scope.loggedIn = false;
			$scope.user = {};
			$location.path('/login');
		};

		$scope.me = function() {
			Facebook.api('/me', function(response) {
				$scope.user = response;
			});
		};

		// $scope.$watch(function () {
		// 	return Facebook.isReady();
		// }, function (newVal) {
		// 	if(newVal) {
		// 		Facebook.getLoginStatus(function (response) {
		// 			if(response.status === 'connected') {
		// 				$scope.loggedIn = true;
		// 				$scope.me();
		// 			} else {
		// 				$location.path('/login');
		// 			}
		// 		})
		// 	}
		// });
	}]);

})();