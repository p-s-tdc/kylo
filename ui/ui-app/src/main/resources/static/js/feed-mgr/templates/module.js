define(['angular', 'feed-mgr/templates/module-name','kylo-utils/LazyLoadUtil','angular-ui-router','kylo-common', 'kylo-services','kylo-feedmgr','ment-io','jquery','angular-drag-and-drop-lists'], function (angular,moduleName,lazyLoadUtil) {
    var module = angular.module(moduleName, ['mentio','dndLists']);

    module.config(["$compileProvider",function($compileProvider) {
        $compileProvider.preAssignBindingsEnabled(true);
    }]);

    /**
     * LAZY loaded in from /app.js
     */
    module.config(['$stateProvider',function ($stateProvider) {
        $stateProvider.state('registered-templates',{
            url:'/registered-templates',
            params: {
            },
            views: {
                'content': {
                    templateUrl: 'js/feed-mgr/templates/registered-templates.html',
                    controller:'RegisteredTemplatesController',
                    controllerAs:'vm'
                }
            },
            resolve: {
                loadMyCtrl: lazyLoadController(['feed-mgr/templates/RegisteredTemplatesController'])
            },
            data:{
                breadcrumbRoot:true,
                displayName:'Templates',
                module:moduleName
            }
        })


        $stateProvider.state('register-new-template',{
            url:'/register-new-template',
            views: {
                'content': {
                    templateUrl: 'js/feed-mgr/templates/new-template/register-new-template.html',
                    controller:'RegisterNewTemplateController',
                    controllerAs:'vm'
                }
            },
            resolve: {
                loadMyCtrl: lazyLoadController(['feed-mgr/templates/new-template/RegisterNewTemplateController'])
            },
            data:{
                breadcrumbRoot:false,
                displayName:'Register Template',
                module:moduleName
            }
        });
        $stateProvider.state('register-template',{
            url:'/register-template',
            params:{
                nifiTemplateId:null,
                registeredTemplateId:null
            },
            views: {
                'content': {
                    templateUrl: 'js/feed-mgr/templates/template-stepper/register-template.html',
                    controller:'RegisterTemplateController',
                    controllerAs:'vm'
                }
            },
            resolve: {
                loadMyCtrl: lazyLoadController(['feed-mgr/templates/template-stepper/RegisterTemplateController','angular-ui-router'])
            },
            data:{
                breadcrumbRoot:false,
                displayName:'Register Template',
                module:moduleName
            }
        }).state('register-template.register-template-complete', {
            url: '/register-template-complete',
            params: {
                message: '',
                templateModel: null
            },
            views: {
                'content': {
                    templateUrl: 'js/feed-mgr/templates/template-stepper/register-template/register-template-complete.html',
                    controller:'RegisterTemplateCompleteController',
                    controllerAs:'vm'
                }
            },
            resolve: {
                loadMyCtrl: lazyLoadController(['feed-mgr/templates/template-stepper/register-template/RegisterTemplateCompleteController'])
            },
            data: {
                breadcrumbRoot: false,
                displayName: 'Register Template',
                module:moduleName
            }
        }).state('import-template',{
            url:'/import-template',
            params: {
            },
            views: {
                'content': {
                    templateUrl:  'js/feed-mgr/templates/template-stepper/import-template/import-template.html',
                    controller:'ImportTemplateController',
                    controllerAs:'vm'
                }
            },
            resolve: {
                loadMyCtrl: lazyLoadController(['feed-mgr/templates/template-stepper/import-template/ImportTemplateController'])
            },
            data:{
                breadcrumbRoot:false,
                displayName:'Template Manager',
                module:moduleName
            }
        })




        function lazyLoadController(path){
            return lazyLoadUtil.lazyLoadController(path,'feed-mgr/templates/module-require');
        }

    }]);


    module.run(['$ocLazyLoad',function($ocLazyLoad){
        $ocLazyLoad.load({name:moduleName,files:['js/vendor/ment.io/styles.css','vendor/ment.io/templates']})
    }])








    return module;
});



