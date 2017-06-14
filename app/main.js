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
			controller: 'appCtrl',
			templateUrl: ContentProvider.getTemplateUrl('main.html')
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

	app.controller('appCtrl', ['$scope', '$rootScope', function ($scope, $rootScope) {
		$scope.variable = 'Haaaallo world!';
	}]);
})();