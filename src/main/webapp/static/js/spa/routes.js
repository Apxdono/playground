define([
    'require',
    './app',
    './load-lazy'
], function (require,app) {
    'use strict';
    return app.config(['$provide', '$stateProvider', '$urlRouterProvider', function ($provide, $sp, $urlp) {

        $provide.decorator('$state', function ($delegate, $stateParams) {
            $delegate.forceReload = function () {
                return $delegate.go($delegate.current, $stateParams, {
                    reload: true,
                    inherit: false,
                    notify: true
                });
            };
            return $delegate;
        });

        var loadAndResolve = function ($q, $rootScope,dependencies) {
                var deferred = $q.defer();
                require(dependencies, function () {
                    $rootScope.$apply(function () {
                        deferred.resolve();
                    });
                });
                return deferred.promise;
        }


        $sp.state('shit', {
            url: '/shit',
            abstract: true,
            template: '<ui-view></ui-view>',
            resolve: {
                api: ['$log', 'dataRest', function ($log, dr) {
                    $log.debug('resolving api');
                    return new dr('/shits');
                }]
            }
        }).state('shit.list', {
            url: '/list',
            controller: 'MainCtrl',
            templateUrl: '/pg/test.html',
            resolve: {

            }
        }).state('shit.view', {
            url: '/view/:id',
            controller: 'MainCtrl2',
            templateUrl: '/pg/test2.html',
            resolve:  {
                ctrl : function($q, $rootScope){
                    return loadAndResolve($q,$rootScope,['./controllers/controller2'])
                },
                model: ['$log', '$stateParams', 'api', function ($log, $stateParams, api) {
                    $log.debug('resolving model');
                    return api.read($stateParams.id);
                }]
            }
        }).state('shit.create', {
            url: '/create',
            controller: 'MainCtrl2',
            templateUrl: '/pg/test2.html',
            resolve: {
                model: ['$log', function ($log) {
                    $log.debug('resolving model');
                    return {};
                }]


            }
        });

        $urlp.otherwise('/shit/list');

    }]);
});