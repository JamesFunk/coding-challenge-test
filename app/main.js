(function () {
	'use strict';

	const app = angular.module('app', [
		'ngRoute',
		'jqueryModule'
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
			template: '<div>Time to log in</div>'
		}).otherwise('/');
	}]);

	app.config(['$locationProvider', function ($locationProvider) {
		$locationProvider.html5Mode(true);
		$locationProvider.hashPrefix('!');
	}]);

	angular.module('jqueryModule', [])
		.factory('$', ['$window', function ($window) {
			return $window.jQuery;
		}]);

	app.factory('ContentProvider', contentProviderService);

	app.controller('appCtrl', ['$scope', '$location', function ($scope, $location) {
		$scope.variable = 'Haaaallo world!';
		$scope.go = function(path) {
			$location.path(path);
		};
		$scope.stuff = 0;
		$scope.add = function() {
			$scope.stuff = $scope.stuff + 1;
		}
	}]);
})();