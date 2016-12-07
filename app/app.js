'use strict';

define([
    'angular'
], function(angular) {
    window.moduleId = 0;

    function getTemplate(id) {
        return '<div id="moduleView' + id + '" ng-controller="TestController">Module ' + id + ': {{parentScopeValue}} and {{ownScopeValue}}</div>';
    }

    function updateParentScopeValue(scope){
        scope.parentScopeValue = '[parent scope value:' + window.moduleId + ']';
    }

    return angular.module('myApp', [])
        .controller('AppController', function($scope, $compile, $log) {
            var container = document.getElementById("moduleContainer");
            $scope.moduleLoaded = false;
            updateParentScopeValue($scope);
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
                window.moduleId++;
                updateParentScopeValue($scope);
                console.log('start injector-' + window.moduleId);
                var element = document.createElement('div');
                element.innerHTML = getTemplate(window.moduleId);
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
                                console.log('complete injector-' + window.moduleId);
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

