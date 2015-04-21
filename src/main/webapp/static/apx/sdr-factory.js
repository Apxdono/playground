(function (ng) {

    var module = ng.module('SpringDataRest');

    module.factory('sdrFactory', ['$http', '$q', '$log', 'sdrModel', function ($http, $q, $log, defmdl) {


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
                data = data.data;
                if (config.hasData) {
                    switch (config.dtype) {
                        case 'page' :
                            result = {payload: []};
                            var embd = data['_embedded'];
                            result.page = data.page;
                            ng.forEach(embd, function (typearr,tname) {
                                ng.forEach(typearr,function(e){
                                    var o = new config.objectModel(e);
                                    o.$owningFactory(self);
                                    result.payload.push(o);
                                });
                            });
                            break;
                        case 'array' :
                            result = [];
                            ng.forEach(data, function (e) {
                                var o = new config.objectModel(e);
                                o.$owningFactory(self);
                                result.push(o);
                            });
                            break;
                        default :
                            result = new config.objectModel(data);
                            result.$owningFactory(self);
                            break;
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
            'read': {method: 'GET', appendParam: true},
            'save': {method: 'PUT', isPost: true}
        }

        function SDRFactory(path, config) {
            this.$entityPath = path;
            ng.extend(this, {
                objectModel: defmdl
            }, config);
        };


        ng.forEach(methods, function (meth, name) {
            SDRFactory.prototype[name] = function (args, s, e, conf) {
                var url = meth.appendParam ? 'rest/api/' + this.$entityPath + '/' + args : this.$entityPath,
                    method = !!meth.isPost ? 'POST' : meth.method,
                    success = s || undefined,
                    error = e || undefined,
                    params = !meth.appendParam ? args : undefined,
                    config = ng.extend({
                        objectModel: this.objectModel || conf.objectModel,
                        hasData: true,
                        isArray: false,
                        isPage: false
                    }, conf || meth.config);
                return callResource.call(this, url, params, method, config, success, error);
            }
        });

        SDRFactory.prototype.getResource = function(url,params,success,error,config){
            return callResource.call(this, url, params, 'GET', ng.extend({hasData : true, objectModel: this.objectModel},config), success, error);
        }


        return SDRFactory;

    }]);


})(angular);