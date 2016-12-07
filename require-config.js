'use strict';

if(window.__karma__) {
	var allTestFiles = [];
	var TEST_REGEXP = /spec\.js$/;

	var pathToModule = function(path) {
		return path.replace(/^\/base\/app\//, '').replace(/\.js$/, '');
	};

	Object.keys(window.__karma__.files).forEach(function(file) {
		if (TEST_REGEXP.test(file)) {
			// Normalize paths to RequireJS module names.
			allTestFiles.push(pathToModule(file));
		}
	});
}

require.config({
	paths: {
		angular: '../node_modules/angular/angular',
		angularRoute: '../node_modules/angular-route/angular-route',
		text: '../node_modules/requirejs-text/text'
	},
	shim: {
		'angular' : {'exports' : 'angular'},
		'angularRoute': ['angular']
	},
	priority: [
		"angular"
	],
	deps: [],
	callback: null,
	baseUrl: 'app'
});

require([
	'angular',
	'app'
	], function(angular, app) {
		angular.element().ready(function() {
			angular.bootstrap(document, ['myApp']);
		});
	}
);