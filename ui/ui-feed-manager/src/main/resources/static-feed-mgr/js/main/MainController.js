/*-
 * #%L
 * thinkbig-ui-feed-manager
 * %%
 * Copyright (C) 2017 ThinkBig Analytics
 * %%
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * 
 *     http://www.apache.org/licenses/LICENSE-2.0
 * 
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * #L%
 */
/**
 * Controller for the Main App index.html
 */
(function() {
    var controller = function($scope, $http, $location, $window, $mdSidenav, $mdMedia, $mdBottomSheet, $log, $q, $element, $rootScope, RestUrlService, StateService, ElasticSearchService,
                              SideNavService, ConfigurationService, AccessControlService) {
        var self = this;
        self.toggleSideNavList = toggleSideNavList;
        self.menu = [];
        self.selectedMenuItem = null;
        self.selectMenuItem = selectMenuItem;
        self.currentState = null;
        self.topNavMenu = [];

        self.sideNavOpen = SideNavService.isLockOpen;
        self.sideNavService = SideNavService;

        this.searchQuery = '';

        $scope.$mdMedia = $mdMedia;

        this.search = function() {
            ElasticSearchService.searchQuery = this.searchQuery;
            if (self.currentState.name != 'search') {
                StateService.navigateToSearch();
            }
        };

        this.onSearchKeypress = function($event) {
            if ($event.which === 13) {
                self.search();
            }
        };

        function buildSideNavMenu(allowed) {
            var menu = [];
            if (AccessControlService.hasAction(AccessControlService.FEEDS_ACCESS, allowed)) {
                menu.push({sref: "feeds", icon: "linear_scale", text: "Feeds", defaultActive: false, fullscreen: false});
            }
            if (AccessControlService.hasAction(AccessControlService.CATEGORIES_ACCESS, allowed)) {
                menu.push({sref: "categories", icon: "folder_special", text: "Categories", defaultActive: false, fullscreen: false});
            }
            if (AccessControlService.hasAction(AccessControlService.FEED_MANAGER_ACCESS, allowed)) {
                menu.push({sref: "tables", icon: "grid_on", text: "Tables", defaultActive: false, fullscreen: false});
            }
            if (AccessControlService.hasAction(AccessControlService.FEEDS_ACCESS, allowed)) {
                menu.push({sref: "service-level-agreements", icon: "beenhere", text: "SLA", defaultActive: false, fullscreen: false});
            }
            if (AccessControlService.hasAction(AccessControlService.FEED_MANAGER_ACCESS, allowed)) {
                menu.push({sref: "visual-query", icon: "transform", text: "Visual Query", defaultActive: false, fullscreen: true});
            }
            self.selectedMenuItem = menu[0];
            self.menu = menu;
        }

        this.gotoOperationsManager = function() {
            if (self.opsManagerUrl == undefined) {
                $http.get(ConfigurationService.MODULE_URLS).then(function(response) {
                    self.opsManagerUrl = response.data.opsMgr;
                    window.location.href = window.location.origin + self.opsManagerUrl;
                });
            }
            else {
                window.location.href = window.location.origin + self.opsManagerUrl;
            }
        };

        this.isSideNavHidden = function() {
            return ($mdMedia('gt-md') && SideNavService.isLockOpen)
        };

        function buildAdminMenu(allowed) {
            var menu = [];
            if (AccessControlService.hasAction(AccessControlService.USERS_ACCESS, allowed)) {
                menu.push({sref: "users", icon: "account_box", text: "Users", defaultActive: false});
            }
            if (AccessControlService.hasAction(AccessControlService.GROUP_ACCESS, allowed)) {
                menu.push({sref: "groups", icon: "group", text: "Groups", defaultActive: false});
            }
            if (AccessControlService.hasAction(AccessControlService.CATEGORIES_ADMIN, allowed) || AccessControlService.hasAction(AccessControlService.FEEDS_ADMIN, allowed)) {
                menu.push({sref: "business-metadata", icon: "business", text: "Properties", defaultActive: false});
            }
            if (AccessControlService.hasAction(AccessControlService.TEMPLATES_ACCESS, allowed)) {
                menu.push({sref: "registered-templates", icon: "layers", text: "Templates", defaultActive: false});
            }
            self.adminMenu = menu;
        }

        function toggleSideNavList() {
            // var pending = $mdBottomSheet.hide() || $q.when(true);
            $q.when(true).then(function() {
                $mdSidenav('left').toggle();
            });
        }

        function closeSideNavList() {
            $mdSidenav('left').close();
        }

        function selectMenuItem($event, menuItem) {
            self.selectedMenuItem = menuItem;
            closeSideNavList();
        }

        // Fetch list of allowed actions
        AccessControlService.getAllowedActions()
                .then(function(actionSet) {
                    buildSideNavMenu(actionSet.actions);
                    buildAdminMenu(actionSet.actions);
                });

        $rootScope.previousState;
        $rootScope.currentState;

        $rootScope.$on('$stateChangeSuccess', function (event, toState, toParams, fromState, fromParams) {
            self.currentState = toState;
            if (self.currentState.name != 'search') {
                self.searchQuery = '';
            }
            $rootScope.previousState = fromState.name;
            $rootScope.currentState = toState.name;
        });
    };

    angular.module(MODULE_FEED_MGR).controller('MainController', controller);
}());
