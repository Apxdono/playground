try{
    (function (window) {
        window.require.config({
            baseUrl: '/pg',
            //  псевдонимы и пути используемых библиотек и плагинов
            paths: {
                'angular': 'webjars/angularjs/${wj.angularjs}/angular',
                'angular-sanitize': 'webjars/angular-sanitize/1.3.11/angular-sanitize.min',
                'adapt-strap-base': 'static/vendor/adapt-strap/adapt-strap',
                'adapt-strap-tpl': 'static/vendor/adapt-strap/adapt-strap.tpl.min',
                'smart-table' : 'webjars/smart-table/2.0.1/smart-table',
                'extra-smart-table' : 'static/apx/smart-table-addons',
                'ng-route': 'webjars/angularjs/${wj.angularjs}/angular-route',
                'uiRouter': 'webjars/angular-ui-router/${wj.angularui.router}/angular-ui-router.min',
                'sdr': 'static/apx/data-rest'

            },

            // angular не поддерживает AMD из коробки, поэтому экспортируем перменную angular в глобальную область
            shim: {
                'angular': {
                    exports: 'angular'
                },
                'angular-sanitize' : ['angular'],
                'ng-route' : ['angular'],
                'sdr' : ['angular'],
                'uiRouter' : {
                    deps: ['ng-route'],
                    exports : 'uiRouter'
                },
                'adapt-strap-base' : ['angular'],
                'adapt-strap-tpl' : ['angular','adapt-strap-base'],
                'smart-table' : ['angular'],
                'extra-smart-table' : ['angular','smart-table']
            },

            // запустить приложение
            deps: ['static/js/spa/entry-point']
        });
    })(window);
} finally {

}