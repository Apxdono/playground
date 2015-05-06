define([
    'angular',
    'angular-sanitize',
    'uiRouter',
    'sdr',
    'extra-smart-table'
], function (ng) {
    'use strict';
    var app = ng.module('pg', ['ngSanitize','ui.router','SpringDataRest','smart-table-addons']);


    app.controller('MainCtrl',
        [
            '$scope',
            '$log',
            'api',
            '$q',
            '$timeout',
//            'items',

            function (scp, $log, api, $q, $timeout,delay) {
                scp.api = api;

                scp.table = {
                    isLoading : false,
                    items : [],
                    tableStateInit : function(tableState){
                        this.perPage = parseInt(tableState.pagination.number);
                    },
                    tableData : function(tableState){
                        var t = $timeout(function(){
                            scp.table.isLoading = true;
                        },150);

                        var params = {
                            page : tableState.pagination.start/tableState.pagination.number,
                            size : tableState.pagination.number
                        };
                        if(tableState.sort.hasOwnProperty('predicate')){
                            params.sort = tableState.sort.predicate + ',' + (tableState.sort.reverse ? 'DESC' : 'ASC' )
                        };
                        ng.extend(params,tableState.search.predicateObject);
                        $log.debug('Table state',tableState);
                        api.tableData(params).then(function(d){
                            scp.table.items = d.payload;
                            tableState.pagination.numberOfPages = d.page.totalPages;
                            $timeout.cancel(t);
                            scp.table.isLoading = false;
                        });
                    }
                };

                $log.info('scope', scp);
            }]);

//    app.controller('MainCtrl2',
//        [
//            '$scope',
//            '$log',
//            '$state',
//            'api',
//            'model',
//            function (scp, log,$state, api, model) {
//                log.info('View started!!!')
//                scp.api = api;
//                scp.model = model;
//                log.info('scope', scp);
//
//                function relocateToView(d){
//                    var loc = d.headers('Location')+'';
//                    var id = loc.substring(loc.lastIndexOf('/')+1);
//                    log.debug('response got', d.headers('location'), ' ID ', id);
//                    if(!model.id) { $state.go('^.view',{id : id}); }
//                    else { $state.forceReload() }
//                }
//
//
//                scp.save = function(){
//                    api.save(model).then(relocateToView);
//                };
//
//                scp.delete = function(){
//                    api.delete(model.id).then(function(d){
//                        $state.go('^.list')
//                    })
//                }
//            }]);


    app.directive('showDuringResolve', function($rootScope) {

        return {
            link: function(scope, element,attrs) {
                var show = attrs.showDuringResolve === "true";

                if(show){
                    element.addClass('ng-hide');
                } else {
                    element.removeClass('ng-hide');
                }


                scope
                    .$on('$stateChangeStart',
                    function(event, toState, toParams, fromState, fromParams){
                        if(show){
                            element.removeClass('ng-hide');
                        } else {
                            element.addClass('ng-hide');
                        }
                    });

                scope
                    .$on('$stateChangeSuccess',
                    function(event, toState, toParams, fromState, fromParams){
                        if(show){
                            element.addClass('ng-hide');
                        } else {
                            element.removeClass('ng-hide');
                        }
                    });


//                var unregister = $rootScope.$on('$routeChangeStart', function() {
//                    if(show) {
//                        element.removeClass('ng-hide');
//                    } else {
//                        element.addClass('ng-hide');
//                    }
//                });
//
//                var unregister2 = $rootScope.$on('$routeChangeSuccess', function() {
//                    if(show) {
//                        element.addClass('ng-hide');
//                    } else {
//                        element.removeClass('ng-hide');
//                    }
//                });

                //scope.$on('$destroy', unregister);
                //scope.$on('$destroy', unregister2);
            }
        };
    });



    return app;






});