define([
    './app',
    'sdr'
], function(app) {
    'use strict';
    return app.config(['dataRestProvider',function(drp){

        drp.basePath('/pg/rest/api');
        var methods = {
            'tableData' : {
                parent: 'search',
                parentArgs: function () {
                    return ['tableData'].concat(Array.prototype.slice.call(arguments));
                }
            }
        }
        drp.config({
            postReturnsValue: false,
            putReturnsValue: false
        },methods);


    }]);
});