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

        /*
        * Whole spec is
         *  name : {
         *      method : 'GET'/'POST'/'PUT'/'PATCH'/'DELETE'
         *      firstArgIsSuffix : true/false -- should first argument be a part of rest path
         *      functionIsSuffix : true/false -- should function name argument be a part of rest path
         *      noParams : true/false -- use parameters or not
         *      processResponse : true/false -- post processing of response (wrapping data into RestResource utility function). Doesn't affect processingFunction call
         *      processingFunction : function -- will process data instead/after built in function (depending on processResponse)
         *      url : string -- url to be used instead of calculating one. (Substitutes only basePath and DataRest constructor path. Applies flags firstArgIsSuffix and functionIsSuffix)
         *      altMethod : another alternative to method (requires useAltMethodCheck and altMethodUrl to be present as well)
         *      useAltMethodCheck : true/function --  use default function or a custom function that returns true or false. (*altMethod will be applied)
         *      altMethodUrl : true/function --  use default function or a custom function that returns a valid url. (*altMethod will be applied)
         *      batchMode : true/false -- if stumbled across array params in POST/PUT/PATCH defines should each object be processed in a same separate function call
         *      parent : string -- function name of a parent function
         *      parentArgs : function -- function that returns argumetns for parent
         *  }
        */
        var _methods = {
            'read': {method: 'GET', firstArgIsSuffix: true, noParams: true, processResponse: true},
            'save': {method: 'POST', altMethod: 'PUT', useAltMethodCheck : true, altMethodUrl : true, batchMode : true, processResponse: true},
            'delete': {method: 'DELETE', firstArgIsSuffix: true, noParams: true},
            'search': {method: 'GET', firstArgIsSuffix: true, functionIsSuffix: true, processResponse: true}
        };

        var _extraMethods = {};

        this.basePath = function (prefix) {
            if (ng.isDefined(prefix) && prefix != '') {
                _basePath = prefix;
            }
            return _basePath;
        };

        this.config = function (cfg,methods) {
            if (ng.isDefined(cfg) && ng.isObject(cfg)) {
                ng.extend(_config, cfg);
            }
            if (ng.isDefined(methods) && ng.isObject(methods)) {
               _extraMethods = methods;
            }
            return ng.extend({},_config);
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
             * Creating necessary methods
             * @param attrs
             * @param name
             */
            function addPrototypeMethod(attrs, name) {
                DataRest.prototype[name] = function () {
                    if(attrs.parent){
                        return this[attrs.parent].apply(this,attrs.parentArgs.apply(this,arguments));
                    }

                    var url = ng.isDefined(attrs.url) ? attrs.url : _basePath + this.getPath(),
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

                    if(attrs.batchMode && /^(POST|PUT|PATCH)$/i.test(method) && data instanceof Array){
                        var self = this;
                        return $q.all(data.map(self[name],self));
                    }

                    if (attrs.useAltMethodCheck) {
                        var check = ng.isFunction(attrs.useAltMethodCheck) ? attrs.useAltMethodCheck : objectExists;
                        if(check.call(this,data)){
                            method = attrs.altMethod;
                            url = ng.isFunction(attrs.altMethodUrl) ? attrs.altMethodUrl.apply(this,data) : data.link('self');
                        }
                    }
                    return processRequest(url, method, data, attrs);
                };
            }


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

            ng.forEach(_methods,addPrototypeMethod);
            ng.forEach(_extraMethods,addPrototypeMethod);

            return DataRest;
        }];
    });

})(angular,undefined, {});
