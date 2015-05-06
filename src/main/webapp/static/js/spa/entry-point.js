define(['angular', './app', './config','./load-lazy', './routes'], function (ng, app) {
    'use strict';
    ng.bootstrap(document, ['pg']);
    return app;
});
