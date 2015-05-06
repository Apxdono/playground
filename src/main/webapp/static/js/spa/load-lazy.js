define([
    './app'
], function (app) {
    'use strict';
    return app.config(['$controllerProvider', function ($controllerProvider) {
        app.register = {
            controller: $controllerProvider.register
        }


    }]);
});