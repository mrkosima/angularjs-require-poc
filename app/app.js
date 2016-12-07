'use strict';

define([
    'angular'
], function(angular) {
    return angular.module('myApp', [])
        .controller('AppController', function($scope, $compile, $log) {
            var template = '<div id="moduleView" ng-controller="TestController">template: {{parentScopeValue}} and {{ownScopeValue}}</div>';
            var container = document.getElementById("moduleContainer");
            container.innerHTML = template;
            $scope.parentScopeValue = '[parent scope value]';
            $scope.moduleLoaded = false;
            $scope.load = function() {
                console.log('require start');
                require(['module/test-module'],
                    function() {
                        $scope.moduleLoaded = true;
                        $scope.$digest();
                        console.log('require completed');
                    });
            };
            $scope.inject = function() {
                var element = angular.element(document.getElementById("moduleView"));
                var modules = ['test.module'];
                modules.unshift([
                    '$provide', function($provide) {
                        $provide.value('$actionElement', element);
                    }
                ]);
                modules.unshift('ng');
                var injector = angular.injector(modules);
                injector.invoke(
                    [
                        '$actionElement', '$compile', '$injector', function(element, compile, injector) {
                        try {
                            $scope.$eval(function() {
                                compile(element)($scope);
                            });
                        } catch (e) {
                            console.warn(e.message);
                        }
                    }
                    ]
                );
            }
        });
});

