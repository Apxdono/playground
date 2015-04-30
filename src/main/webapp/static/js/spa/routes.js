define([
    './app',
    'sdr'
], function(app) {
    'use strict';
    return app.config(['$provide','$stateProvider','$urlRouterProvider','dataRestProvider','$adConfigProvider',function($provide,$sp,$urlp,drp,$adConfigProvider){

        drp.basePath('/pg/rest/api');
        drp.config({
            postReturnsValue: false,
            putReturnsValue: false
        });

        $adConfigProvider.paging = {
            request: {
                start: 'skip',
                pageSize: 'size',
                page: 'page',
                sortField: 'name',
                sortDirection: 'sort',
                sortAscValue: 'asc',
                sortDescValue: 'desc'
            },
            response: {
                itemsLocation: 'payload',
                totalItems: 'page.totalElements'
            },
            pageSize: 3,
            pageSizes: [3,5, 10, 25, 50]
        };



        $provide.decorator('$state', function($delegate, $stateParams) {
            $delegate.forceReload = function() {
                return $delegate.go($delegate.current, $stateParams, {
                    reload: true,
                    inherit: false,
                    notify: true
                });
            };
            return $delegate;
        });


        $sp.state('shit',{
            url : '/shit',
            abstract : true,
            template : '<ui-view></ui-view>',
            resolve : {
                api : ['$log','dataRest',function($log,dr){
                    $log.debug('resolving api');
                    return new dr('/shits');
                }]
            }
        }).state('shit.list',{
            url : '/list',
            controller : 'MainCtrl',
            templateUrl : '/pg/test.html',
            resolve : {
//                items : ['$log','api',function($log,api){
//                    $log.debug('resolving items');
//                    return api.search('activeRecords');
//                }]
//                ,
//                delay : ['$q','$timeout',function($q,$timeout){
//                    var deferred = $q.defer();
//                    $timeout(function(){
//                        deferred.resolve(3);
//                    },3000);
//                    return deferred.promise;
//                }]
            }
        }).state('shit.view', {
            url : '/view/:id',
            controller : 'MainCtrl2',
            templateUrl : '/pg/test2.html',
            resolve : {
                model : ['$log','$stateParams','api',function($log,$stateParams,api){
                    $log.debug('resolving model');
                    return api.read($stateParams.id);
                }]


            }
        }).state('shit.create', {
            url : '/create',
            controller : 'MainCtrl2',
            templateUrl : '/pg/test2.html',
            resolve : {
                model : ['$log',function($log){
                    $log.debug('resolving model');
                    return {};
                }]


            }
        });

        $urlp.otherwise('/shit/list');

    }]);
});