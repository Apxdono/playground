define([
    '../app'
], function (app) {
    'use strict';
    app.register.controller('MainCtrl2',
        [
            '$scope',
            '$log',
            '$state',
            'api',
            'model',
            function (scp, log, $state, api, model) {
                log.info('View started!!!')
                scp.api = api;
                scp.model = model;
                log.info('scope', scp);

                function relocateToView(d) {
                    var loc = d.headers('Location') + '';
                    var id = loc.substring(loc.lastIndexOf('/') + 1);
                    log.debug('response got', d.headers('location'), ' ID ', id);
                    if (!model.id) {
                        $state.go('^.view', {id: id});
                    }
                    else {
                        $state.forceReload()
                    }
                }

                scp.save = function () {
                    api.save(model).then(relocateToView);
                };

                scp.delete = function () {
                    api.delete(model.id).then(function (d) {
                        $state.go('^.list')
                    })
                }
            }]);
});