define([
    'angular',
    'uiRouter',
    'sdr-model',
    'sdr-factory'
], function (ng) {
    'use strict';
    var app = ng.module('pg', ['SpringDataRest','ui.router']);




    app.factory('PGModel',['sdrModel',function(mdl){

        function PGModel(/*copyobj*/){
            mdl.apply(this, arguments);
            this.id = "new";
        };

        PGModel.prototype = new mdl();

        return PGModel;

    }]);

    app.controller('MainCtrl',
        [
            '$scope',
            '$log',
            'api',
            'model',
            'children',
            function (scp, log, api, model,children) {
                log.info('We\'ve started!!!')
                //scp.model = new mdlFactory();
                //scp.api = new restFactory('baseObject',{ factory : mdlFactory });
                scp.api = api;
                scp.model = model;
                scp.children = children.payload;
                log.info('scope', scp);
            }]);


    return app;






});