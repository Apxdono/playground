(function(ng){

    var module = ng.module('SpringDataRest',[]);


    module.factory('sdrModel', [function(){


        function hasLinks(){
            return this.hasOwnProperty('_links');
        };

        function getLink(rname){
            if(hasLinks.apply(this) && ng.isDefined(rname) && this['_links'].hasOwnProperty(rname)){
                return this['_links'][rname].href;
            }
        };

        function $owningFactory(){
            if(ng.isDefined(arguments[0])){
                this.$factory = arguments[0];
            }
            return this.$factory;
        };

        function getResource(resName,type,success,error){
            if(!this.$exists) return;
            return this.$owningFactory().getResource(this.getLink('self')+'/'+resName,undefined,success,error,{dtype:type});
        };


        function SDRModel(/*copyFrom*/){
            this.$exists = false;
            if(arguments.length == 1){
                ng.extend(this,arguments[0]);
                if(this.hasLinks()){
                    this.$exists = true;
                }
            }
        };

        SDRModel.prototype.hasLinks = hasLinks;
        SDRModel.prototype.getResource = getResource;
        SDRModel.prototype.getLink = getLink;
        SDRModel.prototype.$owningFactory = $owningFactory;
        SDRModel.prototype.$existingObject = function(){
            return this.$exists;
        };


        return SDRModel;

    }]);



})(angular);