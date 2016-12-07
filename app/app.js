'use strict';

define([
    'angular'
], function(angular) {
    var moduleId = 0;

    function getTemplate(id) {
        return '<div id="moduleView' + id + '" ng-controller="TestController">Module ' + id + ': {{parentScopeValue}} and {{ownScopeValue}}</div>';
    }

    return angular.module('myApp', [])
        .controller('AppController', function($scope, $compile, $log) {
            var container = document.getElementById("moduleContainer");
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
                moduleId++;
                console.log('start injector-' + moduleId);
                var element = document.createElement('div');
                element.innerHTML = getTemplate(moduleId);
                container.appendChild(element);
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
                                console.log('complete injector-' + moduleId);
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

