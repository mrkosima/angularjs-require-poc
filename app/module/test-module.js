console.log('test-module loaded');
define([
    'angular'
], function(angular) {
    var module = angular.module('test.module', [])
        .controller('TestController',
            function($scope) {
                console.log('TestController created');
                $scope.ownScopeValue = '[own scope value:' + window.moduleId + ']';
            }
        );
    console.log('test-module started');
    return module;
});

