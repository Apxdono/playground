try{
    (function (window) {
        window.require.config({
            baseUrl: '/pg',
            //  псевдонимы и пути используемых библиотек и плагинов
            paths: {
                'angular': 'webjars/angularjs/${wj.angularjs}/angular',
                'ng-route': 'webjars/angularjs/${wj.angularjs}/angular-route',
                'uiRouter': 'webjars/angular-ui-router/${wj.angularui.router}/angular-ui-router.min',
                'sdr-model': 'static/apx/sdr-model-factory',
                'sdr-factory': 'static/apx/sdr-factory'
            },

            // angular не поддерживает AMD из коробки, поэтому экспортируем перменную angular в глобальную область
            shim: {
                'angular': {
                    exports: 'angular'
                },
                'ng-route' : ['angular'],
                'uiRouter' : {
                    deps: ['ng-route'],
                    exports : 'uiRouter'
                },
                'sdr-model' : ['angular'],
                'sdr-factory' : ['angular','sdr-model']
            },

            // запустить приложение
            deps: ['static/js/spa/appbootstrap']
        });
    })(window);
} finally {

}