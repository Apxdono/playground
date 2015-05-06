(function(ng){
    var extras = ng.module('smart-table-addons',['smart-table']);

    extras.directive('pageSelect', function($timeout) {
        return {
            restrict: 'E',
            template: '<input type="number" class="form-control" style="width:80px" ng-model="inputPage" ng-change="delayedSelectPage(inputPage)">',
            link: function(scope, element, attrs) {
                var time;
                scope.delayedSelectPage = function(inputPage){
                    $timeout.cancel(time);
                    time = $timeout(function(){
                        scope.selectPage(inputPage);
                    },400);
                };
                scope.$watch('currentPage', function(c) {
                    scope.inputPage = c;
                });
            }
        }
    });

    extras.directive('stPersist', function ($parse) {
        return {
            require: '^stTable',
            link : {
                pre : function(scope, element, attr, ctrl){
                    //fetch the table state when the directive is loaded
                    if (localStorage.getItem(attr.stPersist)) {
                        var savedState = JSON.parse(localStorage.getItem(attr.stPersist));
                        var tableState = ctrl.tableState();
                        angular.extend(tableState, savedState);
                        //notify those who thirst
                        if(attr.stRestored){
                            var fn = $parse(attr.stRestored);
                            fn(scope,{tableState:tableState});
                        }
                    }
                },
                post : function(scope, element, attr, ctrl){
                    //save the table state every time it changes
                    scope.$watch(function () {
                        return ctrl.tableState();
                    }, function (newValue, oldValue) {
                        if (newValue !== oldValue) {
                            localStorage.setItem(attr.stPersist, JSON.stringify(newValue));
                        }
                    }, true);
                }
            }
        };
    });


})(angular)