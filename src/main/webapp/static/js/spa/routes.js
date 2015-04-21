define(['./app'], function(app) {
    'use strict';
    return app.config(['$stateProvider', '$urlRouterProvider',function($sp,$urlp){


        $sp.state('main',{
            url : '/',
            controller : 'MainCtrl',
            templateUrl : 'test.html',
            resolve : {
                api : function(sdrFactory){
                    return new sdrFactory('shits');
                },
                model : ['$log','api',function(log,api){
                    log.info('api got',api);
                    return api.read('1')
                }],
                children : ['model', function(model){
                    return model.getResource('children','page');
                }]
            }

        });

        $urlp.otherwise('/');

    }]);
});