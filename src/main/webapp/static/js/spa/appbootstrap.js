define(['angular','./app','./routes'], function(ng,app) {
    'use strict';

    //$(document).ready(function(){
        ng.bootstrap(document, ['pg']);
        //app.run('shit.list');
    //})
    return app;
});
