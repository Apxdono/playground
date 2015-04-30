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
//            'items',

            function (scp, $log, api, $q, items,delay) {
                scp.api = api;
                scp.pageLoader = function(options){
                    $log.debug('Requesting page', options);
                    var deffered = $q.defer();
                    var params = {
                        page : options.pageNumber-1,
                        size : options.pageSize
                    };
                    if(ng.isDefined(options.sortKey)){
                        params.sort = options.sortKey + ',' + (options.sortDirection ? 'desc':'asc')
                    }

                    scp.api.tableData(params).then(function(d){
                        d.token = options.token;
                        deffered.resolve(d);
                    })

                    return deffered.promise;

//                    scp.api.read(params).then(function(data){
//                        if(data.payload && data.payload.length > 0){
//                            deffered.resolve({
//                                items: data.payload,
//                                currentPage: data.page.number+1,
//                                totalPages: data.page.totalPages,
//                                totalItems: data.page.totalElements,
//                                pagingArray: [1,2,3,4,5],
//                                token: options.token
//                            });
//                        } else {
//                            deffered.reject();
//                        }
//
//                    },function(reason){
//                        deffered.reject(reason);
//                    })
//                    return deffered.promise;
                };
                scp.ajaxConfig = {

                };
                scp.columnsDefinition = [
                    {
                        columnHeaderDisplayName: 'Название',
                        template: '<a ui-sref="shit.view(item)" ng-bind="::item.name"></a>',
                        width: '40%',
                        sortKey: 'name'
                    },
                    {
                        columnHeaderDisplayName: 'Внутреннее имя',
                        displayProperty: 'internalName',
                        sortKey: 'internalName'
                    }
                ];

//                scp.items = items.payload;
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