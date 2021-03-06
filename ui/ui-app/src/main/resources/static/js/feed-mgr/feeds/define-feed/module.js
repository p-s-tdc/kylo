define(['angular','feed-mgr/feeds/define-feed/module-name','kylo-utils/LazyLoadUtil','feed-mgr/feeds/module','angular-ui-router','kylo-feedmgr','feed-mgr/visual-query/module'], function (angular,moduleName,lazyLoadUtil) {
    //LAZY LOADED into the application
    var module = angular.module(moduleName, []);
    module.config(["$compileProvider",function($compileProvider) {
        $compileProvider.preAssignBindingsEnabled(true);
    }]);

    module.config(['$stateProvider','$compileProvider',function ($stateProvider,$compileProvider) {
        //preassign modules until directives are rewritten to use the $onInit method.
        //https://docs.angularjs.org/guide/migration#migrating-from-1-5-to-1-6
        $compileProvider.preAssignBindingsEnabled(true);

        $stateProvider.state('define-feed', {
            url: '/define-feed',
            params: {
                templateId: null
            },
            views: {
                'content': {
                    templateUrl: 'js/feed-mgr/feeds/define-feed/define-feed.html',
                    controller: 'DefineFeedController',
                    controllerAs: 'vm'
                }
            },
            resolve: {
                loadMyCtrl: lazyLoadController(['feed-mgr/feeds/define-feed/DefineFeedController'])
            },
            data: {
                breadcrumbRoot: false,
                displayName: 'Define Feed',
                module:moduleName
            }
        });

        $stateProvider.state('import-feed', {
            url: '/import-feed',
            params: {},
            views: {
                'content': {
                    templateUrl: 'js/feed-mgr/feeds/define-feed/import-feed.html',
                    controller: 'ImportFeedController',
                    controllerAs: 'vm'
                }
            },
            resolve: {
                loadMyCtrl: lazyLoadController(['feed-mgr/feeds/define-feed/ImportFeedController'])
            },
            data: {
                breadcrumbRoot: false,
                displayName: 'Import Feed',
                module:moduleName
            }
        });

        function lazyLoadController(path){
            return lazyLoadUtil.lazyLoadController(path,['feed-mgr/feeds/define-feed/module-require','feed-mgr/visual-query/module-require']);
        }
    }]);




return module;



});