(function (ng, undefined,emptyObject) {

    var module = ng.module('SpringDataRest', []);

    module.provider('dataRest', function () {
        var _basePath = '';

        var _config = {
            linksKey: '_links',
            pageKey: 'page',
            selfKey: 'self',
            embeddedKey: '_embedded',
            mergeEmbedded: true,
            postReturnsValue: true,
            putReturnsValue: true,
            processResponse : true
        };

        function adaptStrapPostProcess($q,data) {
            var pages = 5, parr=[];
            var minimumBound = data.page.number - Math.floor(pages / 2);
            for (var i = minimumBound; i <= data.page.number; i++) {
                if (i > 0) {
                    parr.push(i);
                }
            }
            while (parr.length < pages) {
                if (i > data.page.totalPages) {
                    break;
                }
                parr.push(i);
                i++;
            }
            return {
                items: data.payload,
                currentPage: data.page.number+1,
                totalPages: data.page.totalPages,
                totalItems: data.page.totalElements,
                pagingArray: parr
            }
        }
        
        var _methods = {
            'read': {method: 'GET', firstArgIsSuffix: true, noParams: true, processResponse: true},
            'save': {method: 'POST', altMethod: 'PUT', useSelf: true, processResponse: true},
            'delete': {method: 'DELETE', firstArgIsSuffix: true, noParams: true},
            'search': {method: 'GET', firstArgIsSuffix: true, functionIsSuffix: true, processResponse: true},
            'tableData': {method: 'GET',  processResponse: true, processingFunction : adaptStrapPostProcess }
        };

        this.basePath = function (prefix) {
            if (ng.isDefined(prefix) && prefix != '') {
                _basePath = prefix;
            }
            return _basePath;
        };

        this.config = function (cfg) {
            if (ng.isDefined(cfg) && ng.isObject(cfg)) {
                ng.extend(_config, cfg);
            }
            return _config;
        };

        this.$get = ['$log', '$http', '$q', function ($log, $http, $q) {

            /**
             * Checks is object is undefined, null or primitive
             * @param target object to check
             * @returns {boolean} true if primitive
             */
            var isPrimitive = function (target) {
                return ng.isUndefined(target) || target == null || target.constructor === Boolean || ng.isNumber(target) || ng.isString(target) ;
            };

            /**
             * Checks for hateos special _links.self.href in current object. If it's present it's an existing object
             * @param obj object to check
             * @returns {boolean} true if object is an existing one
             */
            var objectExists = function (obj) {
                return ng.isDefined(obj) && ng.isObject(obj) && obj instanceof RestResource && obj.link('self');
            };


            /**
             * A wrapper for all objects that will be received from server.
             * @param obj object to be created from
             * @constructor
             */
            function RestResource(obj){
                var links = obj[_config.linksKey] || {};
                var self = this;
                ng.extend(self,obj);
                delete self[_config.linksKey];

                /**
                 * Get existing links
                 * @returns {Object}
                 */
                self.links = function(){
                    return ng.extend({},links);
                };

                return this;
            };

            /**
             * Get resource's link
             * @param linkName name of linked resource
             * @returns {*} resource link or empty string
             */
            RestResource.prototype.link = function(linkName){
                return this.links()[linkName] ? this.links()[linkName]['href'] : undefined;
            };


            /**
             * Fetch nested resource(s). Uses arguments as array of resource names
             */
            RestResource.prototype.resource = function(){
                var ress = Array.prototype.slice.call(arguments).map(RestResource.prototype.link,this).filter(ng.isDefined);
                return ress.length == 0 ? undefined : ( ress.length == 1 ? fetchResource(ress[0]) : $q.all(ress.map(fetchResource)) );
            };


            /**
             * A wrapper around $http
             * @param url
             * @param method
             * @param params
             * @returns {promise.promise|jQuery.promise|d.promise|promise|jQuery.ready.promise|qFactory.Deferred.promise|*}
             */
            var processRequest = function (url, method, params,cfg) {
                var request = {
                    method: method || 'GET',
                    url: url
                };
                cfg = ng.extend({},_config,cfg);
                if (ng.isDefined(params)) {
                    if (/^(POST|PUT|PATCH)$/i.test(request.method)) {
                        request.data = params || {};
                    } else {
                        request.params = params || {};
                    }
                }
                $log.debug('Configured request', request);
                var deff = $q.defer();
                $http(request).then(function (response) {

                    if ((request.method == 'POST' && !cfg.postReturnsValue) || (request.method == 'PUT' && !cfg.putReturnsValue)) {
                        deff.resolve(response);
                    } else {
                        var processed = cfg.processResponse ? processData(response.data) : response.data;
                        if(cfg.processingFunction && ng.isFunction(cfg.processingFunction)){
                            processed = cfg.processingFunction.call(this,$q,processed);
                        }
                        deff.resolve(processed);
                    }
                }, function (response) {
                    deff.reject(response);
                })
                return deff.promise;
            };

            var fetchResource = function(url){
                return processRequest(url,'GET',undefined,emptyObject);
            };

            /**
             * Wrapping of data
             * @param data
             * @returns {*} wrapped data
             */
            var processData = function (data) {
                $log.debug('Processing data', data);
                //Do nothing
                if (isPrimitive(data)) return data;
                var result;
                //Piece of cake
                if(data instanceof Array){
                    result = [];
                    data.map(RestResource).forEach(result.push);
                } else if (data.hasOwnProperty(_config.embeddedKey) || (data.hasOwnProperty(_config.linksKey) && data[_config.linksKey][_config.selfKey].hasOwnProperty('templated') )){
                    //If we have embedded items or if they are missing but the self reference is templated, then we have a page object probably anyway
                    result = {
                        page : data[_config.pageKey],
                        payload : _config.mergeEmbedded ? [] : {}
                    }
                    ng.forEach(data[_config.embeddedKey],function(v,k){
                        var target = result.payload;
                        if(!_config.mergeEmbedded){
                            result.payload[k] = [];
                            target = result.payload[k];
                        }
                        v.map(processData).forEach(function(e){target.push(e)});
                    })
                } else {
                    result = new RestResource(data);
                }
                return result;
            };


            /**
             * The rest factory
             * @param entityPath specific entity path
             * @constructor path to entity
             */
            function DataRest(entityPath) {
                var _entityPath = entityPath;
                this.getPath = function () {
                    return _entityPath;
                };
            };

            ng.forEach(_methods, function (attrs, name) {
                DataRest.prototype[name] = function () {
                    var url = _basePath + this.getPath(),
                        firstArgProcessed = false;
                    if (attrs.functionIsSuffix) {
                        url += '/' + name;
                    }
                    if (attrs.firstArgIsSuffix && ng.isDefined(arguments[0]) && isPrimitive(arguments[0])) {
                        url += '/' + arguments[0];
                        firstArgProcessed = true;
                    }
                    var needArgs = attrs.firstArgIsSuffix && firstArgProcessed;
                    var data = needArgs ? arguments[1] : arguments[0];
                    var method = attrs.method;

                    if(/^(POST|PUT|PATCH)$/i.test(method) && data instanceof Array){
                        var self = this;
                        return $q.all(data.map(self[name],self));
                    }

                    if (attrs.useSelf && objectExists(data) && attrs.altMethod) {
                        method = attrs.altMethod;
                        url = data.link('self');
                    }
                    return processRequest(url, method, data, attrs);
                };
            })

            return DataRest;
        }];
    });


    //var app = ng.module('testapp', ['SpringDataRest']);
    //
    //app.config(['dataRestProvider', function ($dataRestProvider) {
    //    console.log('Data rest provider config', $dataRestProvider.config({
    //        //mergeEmbedded: false,
    //        //postReturnsValue: false,
    //        //putReturnsValue: false
    //    }));
    //    $dataRestProvider.basePath('/pg/rest/api')
    //}]);
    //
    //
    //app.controller('TestCt', ['$scope', '$log', 'dataRest', function ($scope, $log, dataRest) {
    //    $log.debug('Data rest service', dataRest);
    //    $scope.api1 = new dataRest('/shits');
    //    $scope.api2 = new dataRest('/bitches');
    //}]);

    //ng.bootstrap(document,['testapp']);

})(angular,undefined, {});
