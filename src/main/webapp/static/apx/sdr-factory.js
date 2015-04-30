(function (ng) {

    var module = ng.module('SpringDataRest');

    module.factory('sdrFactory', ['$http', '$q', '$log', 'sdrModel', function ($http, $q, $log, sdrModel) {
        var embProp = '_embedded',
            pageProp = 'page',
            basePath = 'rest/api/',
            defaultConf = {
                objectModel : sdrModel
            };



        function callResource(url, params, method, config, success, error) {
            var request = {
                method: method,
                url: url
            };
            if (ng.isDefined(params)) {
                if (/^(POST|PUT|PATCH)$/i.test(method)) {
                    request.data = params;
                } else {
                    request.params = params;
                }
            }

            $log.debug('Configured request', config, request);
            var self = this;
            var deff = $q.defer();
            $http(request).then(function (data) {
                var result;
                var d = data.data;
                if(ng.isDefined(d)){
                    if(d instanceof Array){
                        result = [];
                        ng.forEach(d, function (e) {
                            var o = new config.objectModel(e);
                            o.$owningFactory(self);
                            result.push(o);
                        });
                    } else if(d.hasOwnProperty(embProp)){
                        result = {payload: []};
                        result.page = d[pageProp];
                        ng.forEach(d[embProp], function (typearr) {
                            ng.forEach(typearr,function(e){
                                var o = new config.objectModel(e);
                                o.$owningFactory(self);
                                result.payload.push(o);
                            });
                        });
                    } else {
                        result = new config.objectModel(d);
                        result.$owningFactory(self);
                    }
                }
                if (success && typeof success == 'function') {
                    success.apply(this, [].concat.apply([], [[result], arguments])) || result;
                }
                deff.resolve(result);
                return result;
            }, function () {
                if (error && typeof error == 'function') {
                    error.apply(this, arguments);
                }
                deff.reject(arguments);
                return;
            });
            return deff.promise;
        }


        var methods = {
            'read': {method: 'GET', appendArg: true, useParams : true},
            'save': {method: 'PUT', isPost: true}
        }

        function SDRFactory(path, config) {
            this.$entityPath = path;
            ng.extend(this, defaultConf, config);
        };


        ng.forEach(methods, function (meth, name) {
            SDRFactory.prototype[name] = function (args, s, e, conf) {
                var url = basePath + this.$entityPath,
                    method = !!meth.isPost ? (!!args && !args.$exists ? 'POST' : meth.method) : meth.method,
                    success = s || undefined,
                    error = e || undefined,
                    params = !meth.useParams ? args : undefined,
                    config = ng.extend({ objectModel: this.objectModel },conf);
                url =  meth.useParams && !args.$exists ?  url + '/' + args : args.getLink('self');
                return callResource.call(this, url, params, method, config, success, error);
            }
        });

        SDRFactory.prototype.getResource = function(url,params,success,error,config){
            return callResource.call(this, url, params, 'GET', ng.extend({hasData : true, objectModel: this.objectModel},config), success, error);
        }


        return SDRFactory;

    }]);


})(angular);