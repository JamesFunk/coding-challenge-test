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
		}).when('/add', {
			templateUrl: ContentProvider.getTemplateUrl('add.html')
		}).when('/login', {
			templateUrl: ContentProvider.getTemplateUrl('login.html')
		}).otherwise({redirectTo: '/'});
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
		$scope.books = [];
		$scope.new = {};
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

		$scope.addBook = function () {
			$scope.books.push({
				title: $scope.new.title,
				author: $scope.new.author,
				desc: $scope.new.desc
			});
			$scope.new = {};
			$scope.go('/');
		};

		$scope.$watch(function () {
			return Facebook.isReady();
		}, function (newVal) {
			if(newVal) {
				Facebook.getLoginStatus(function (response) {
					if(response.status === 'connected') {
						$scope.loggedIn = true;
						$scope.me();
					} else {
						$location.path('/login');
					}
				})
			}
		});
	}]);

	app.directive('logout', ['ContentProvider', function (ContentProvider) {
		return {
			restrict: 'E',
			templateUrl: ContentProvider.getTemplateUrl('logout.html')
		};
	}]);

	app.directive('book', ['ContentProvider', function (ContentProvider) {
		return {
			restrict: 'E',
			scope: {
				title: '@',
				author: '@',
				desc: '@'
			},
			templateUrl: ContentProvider.getTemplateUrl('book.html'),
			controller: ['$scope', 'Facebook', function ($scope, Facebook) {
				$scope.publish = function () {
					Facebook.ui({
						method: 'feed',
						link: 'https://peaceful-anchorage-56323.herokuapp.com/',
						caption: $scope.title + '\nby ' + $scope.author + '\n\n' + $scope.desc
					});
				};
			}]
		};
	}]);

})();