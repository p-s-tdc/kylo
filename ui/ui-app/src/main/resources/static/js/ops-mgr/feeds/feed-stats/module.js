define(['angular','ops-mgr/feeds/feed-stats/module-name',  'kylo-utils/LazyLoadUtil','kylo-common', 'kylo-services','kylo-opsmgr','angular-nvd3'], function (angular,moduleName,lazyLoadUtil) {
   var module = angular.module(moduleName, []);


    module.config(['$stateProvider','$compileProvider',function ($stateProvider,$compileProvider) {
        //preassign modules until directives are rewritten to use the $onInit method.
        //https://docs.angularjs.org/guide/migration#migrating-from-1-5-to-1-6
        $compileProvider.preAssignBindingsEnabled(true);

        $stateProvider.state('feed-stats',{
            url:'/feed-stats/{feedName}',
            params:{
               feedName:null
            },
            views: {
                'content': {
                    templateUrl: 'js/ops-mgr/feeds/feed-stats/feed-stats.html',
                    controller:"FeedStatsController",
                    controllerAs:"vm"
                }
            },
            resolve: {
                loadMyCtrl: lazyLoadController(['ops-mgr/feeds/feed-stats/feed-stats'])
            },
            data:{
                breadcrumbRoot:true,
                displayName:'Feed Stats',
                module:moduleName
            }
        });


        function lazyLoadController(path){
            return lazyLoadUtil.lazyLoadController(path,['ops-mgr/feeds/feed-stats/module-require']);
        }

        function lazyLoad(){
            return lazyLoadUtil.lazyLoad(['ops-mgr/feeds/feed-stats/module-require']);
        }

    }]);
    return module;






});




