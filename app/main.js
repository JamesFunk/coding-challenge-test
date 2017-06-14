(function () {
	'use strict';

	const app = angular.module('app', [
		'ngRoute',
		'jqueryModule',
		'bluebirdModule'
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
			template: '<div><fb:login-button show-faces="true" max-rows="1" size="large"></fb:login-button></div>'
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

	angular.module('bluebirdModule', [])
		.factory('P', ['$window', function ($window) {
			return $window.P;
		}]);

	app.factory('ContentProvider', contentProviderService);

	app.run(['$rootScope', '$window', 'srvAuth', function ($rootScope, $window, sAuth) {
		$rootScope.user = {};

		$window.fbAsyncInit = function() {
			FB.init({
				appId: '1563656153652814',
				status: true,
				channelUrl: 'templates/channel.html',
				autoLogAppEvents : true,
				xfbml            : true,
				version          : 'v2.9'
			});
			sAuth.watchLoginChange();
		};

		(function(d){
			// load the Facebook javascript SDK

			var js,
				id = 'facebook-jssdk',
				ref = d.getElementsByTagName('script')[0];

			if (d.getElementById(id)) {
				return;
			}

			js = d.createElement('script');
			js.id = id;
			js.async = true;
			js.src = "//connect.facebook.net/en_US/all.js";

			ref.parentNode.insertBefore(js, ref);

		}(document));
	}]);

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

	app.service('srvAuth', [function () {
		const watchLoginChange = function() {
			const _self = this;
			FB.Event.subscribe('auth.authResponseChange', function(res) {
				if (res.status === 'connected') {
					/*
					 The user is already logged,
					 is possible retrieve his personal info
					 */
					_self.getUserInfo();
					/*
					 This is also the point where you should create a
					 session for the current user.
					 For this purpose you can use the data inside the
					 res.authResponse object.
					 */
				}
				else {
					/*
					 The user is not logged to the app, or into Facebook:
					 destroy the session on the server.
					 */
				}
			});
		};

		const getUserInfo = function() {
			const _self = this;
			FB.api('/me', function(res) {
				$rootScope.$apply(function() {
					$rootScope.user = _self.user = res;
				});
			});
		};
		const logout = function() {
			const _self = this;
			FB.logout(function(response) {
				$rootScope.$apply(function() {
					$rootScope.user = _self.user = {};
				});
			});
		};
		return {
			watchLoginChange: watchLoginChange,
			getUserInfo: getUserInfo,
			logout: logout
		};
	}]);
})();