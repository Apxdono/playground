define([
    'angular',
    'angular-sanitize',
    'uiRouter',
    'sdr',
    'adapt-strap-base',
    'adapt-strap-tpl',
    'smart-table'
], function (ng) {
    'use strict';
    var app = ng.module('pg', ['ngSanitize','SpringDataRest','ui.router','adaptv.adaptStrap','smart-table']);


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
                    tableData : function(tableState){
                        if(!tableState.pagination.hasOwnProperty('number')) return;
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
                        api.search('tableData',params).then(function(d){
                            scp.table.items = d.payload;
                            tableState.pagination.numberOfPages = d.page.totalPages;
                            $timeout.cancel(t);
                            scp.table.isLoading = false;
                        });
                    }
                };

                $log.info('scope', scp);
            }]);

    app.controller('MainCtrl2',
        [
            '$scope',
            '$log',
            '$state',
            'api',
            'model',
            function (scp, log,$state, api, model) {
                log.info('View started!!!')
                scp.api = api;
                scp.model = model;
                log.info('scope', scp);

                function relocateToView(d){
                    var loc = d.headers('Location')+'';
                    var id = loc.substring(loc.lastIndexOf('/')+1);
                    log.debug('response got', d.headers('location'), ' ID ', id);
                    if(!model.id) { $state.go('^.view',{id : id}); }
                    else { $state.forceReload() }
                }


                scp.save = function(){
                    api.save(model).then(relocateToView);
                };

                scp.delete = function(){
                    api.delete(model.id).then(function(d){
                        $state.go('^.list')
                    })
                }
            }]);

    app.directive('pageSelect', function($timeout) {
        return {
            restrict: 'E',
            template: '<input type="number" class="form-control" style="width:80px" ng-model="inputPage" ng-change="delayedSelectPage(inputPage)">',
            link: function(scope, element, attrs) {
                var time;
                scope.delayedSelectPage = function(inputPage){
                    $timeout.cancel(time);
                    time = $timeout(function(){
                        scope.selectPage(inputPage);
                    },400);
                };
                scope.$watch('currentPage', function(c) {
                        scope.inputPage = c;
                });
            }
        }
    })

    .directive('stPersist', function () {
        return {
            require: '^stTable',
            link: function (scope, element, attr, ctrl) {
                var nameSpace = attr.stPersist;

                //save the table state every time it changes
                scope.$watch(function () {
                    return ctrl.tableState();
                }, function (newValue, oldValue) {
                    if (newValue !== oldValue) {
                        localStorage.setItem(nameSpace, JSON.stringify(newValue));
                    }
                }, true);

                //fetch the table state when the directive is loaded
                if (localStorage.getItem(nameSpace)) {
                    var savedState = JSON.parse(localStorage.getItem(nameSpace));
                    var tableState = ctrl.tableState();

                    angular.extend(tableState, savedState);
                    ctrl.pipe();

                }

            }
        };
    });


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


                var unregister = $rootScope.$on('$routeChangeStart', function() {
                    if(show) {
                        element.removeClass('ng-hide');
                    } else {
                        element.addClass('ng-hide');
                    }
                });

                var unregister2 = $rootScope.$on('$routeChangeSuccess', function() {
                    if(show) {
                        element.addClass('ng-hide');
                    } else {
                        element.removeClass('ng-hide');
                    }
                });

                //scope.$on('$destroy', unregister);
                //scope.$on('$destroy', unregister2);
            }
        };
    });

    //app.directive('resolveLoader', [
    //    '$rootScope',
    //    '$timeout',
    //    function($rootScope, $timeout) {
    //
    //    return {
    //        restrict: 'A',
    //        link: function(scope, element) {
    //            $rootScope.$on('$routeChangeStart', function(event, currentRoute, previousRoute) {
    //                if (previousRoute) return;
    //
    //                $timeout(function() {
    //                    element.removeClass('ng-hide');
    //                });
    //            });
    //
    //            $rootScope.$on('$routeChangeSuccess', function() {
    //                element.addClass('ng-hide');
    //            });
    //        }
    //    };
    //}]);


    return app;






});