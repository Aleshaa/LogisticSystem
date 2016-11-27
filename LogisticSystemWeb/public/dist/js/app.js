(function e(t, n, r) {
    function s(o, u) {
        if (!n[o]) {
            if (!t[o]) {
                var a = typeof require == "function" && require;
                if (!u && a)return a(o, !0);
                if (i)return i(o, !0);
                var f = new Error("Cannot find module '" + o + "'");
                throw f.code = "MODULE_NOT_FOUND", f
            }
            var l = n[o] = {exports: {}};
            t[o][0].call(l.exports, function (e) {
                var n = t[o][1][e];
                return s(n ? n : e)
            }, l, l.exports, e, t, n, r)
        }
        return n[o].exports
    }

    var i = typeof require == "function" && require;
    for (var o = 0; o < r.length; o++)s(r[o]);
    return s
})({
    1: [function (require, module, exports) {
        /*!
         * domready (c) Dustin Diaz 2014 - License MIT
         */
        !function (name, definition) {

            if (typeof module != 'undefined') module.exports = definition()
            else if (typeof define == 'function' && typeof define.amd == 'object') define(definition)
            else this[name] = definition()

        }('domready', function () {

            var fns = [], listener
                , doc = document
                , hack = doc.documentElement.doScroll
                , domContentLoaded = 'DOMContentLoaded'
                , loaded = (hack ? /^loaded|^c/ : /^loaded|^i|^c/).test(doc.readyState)


            if (!loaded)
                doc.addEventListener(domContentLoaded, listener = function () {
                    doc.removeEventListener(domContentLoaded, listener)
                    loaded = 1
                    while (listener = fns.shift()) listener()
                })

            return function (fn) {
                loaded ? setTimeout(fn, 0) : fns.push(fn)
            }

        });

    }, {}],
    2: [function (require, module, exports) {
        (function (global) {
            'use strict';

            var domready = require('domready');
            var angular = (typeof window !== "undefined" ? window.angular : typeof global !== "undefined" ? global.angular : null);

//require common modules
            require('./common/request');
            require('./common/message');
            require('./common/auth');
            require('./common/flash');

//require project modules
            require('./modules/home');
            require('./modules/user');
            require('./modules/login');
            require('./modules/register');

            domready(function () {
                angular
                    .module('App', [
                        'ui.router',
                        'ui.bootstrap',
                        'LocalStorageModule',

                        'Request',
                        'Message',
                        'Auth',
                        'Flash',

                        'Login',
                        'Registration',
                        'Home',
                        'User'
                    ]);
                angular.bootstrap(document, ['App']);
            });

        }).call(this, typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
    }, {
        "./common/auth": 4,
        "./common/flash": 6,
        "./common/message": 7,
        "./common/request": 10,
        "./modules/home": 14,
        "./modules/login": 22,
        "./modules/register": 26,
        "./modules/user": 31,
        "domready": 1
    }],
    3: [function (require, module, exports) {
        (function (global) {
            'use strict';

            var angular = (typeof window !== "undefined" ? window.angular : typeof global !== "undefined" ? global.angular : null);

            module.exports = [
                '$http',
                'localStorageService',
                '$rootScope',
                function ($http, localStorageService, $rootScope) {
                    var service = {};

                    var REST_SERVICE_URI = 'http://localhost:8080';

                    var userRole = "";
                    service.Login = Login;
                    service.SetCredentials = SetCredentials;
                    service.ClearCredentials = ClearCredentials;
                    service.isAuth = isAuth;
                    service.checkRole = checkRole;

                    return service;

                    function Login(username, password, callback) {
                        SetCredentials(username, password);
                        $http.get(REST_SERVICE_URI + '/rest/authenticate', {})
                            .success(function (response) {
                                userRole = response.role.nameRole;
                                localStorageService.remove('globals');
                                $http.defaults.headers.common.Authorization = 'Basic';
                                response = {success: true};
                                callback(response);
                            })
                            .error(function (response, status) {
                                response = {success: false, message: 'Имя пользователя или пароль неверны'};
                                localStorageService.remove('globals');
                                $http.defaults.headers.common.Authorization = 'Basic';
                                console.error('error', status, response);
                                callback(response);
                            });

                    }

                    function SetCredentials(username, password) {
                        var encodedString = btoa(username + ':' + password);


                        $rootScope.globals = {
                            currentUser: {
                                username: username,
                                role: userRole,
                                authdata: encodedString
                            }
                        };

                        $http.defaults.headers.common['Authorization'] = 'Basic ' + encodedString; // jshint ignore:line
                        localStorageService.set('globals', $rootScope.globals);
                    }

                    function isAuth() {
                        return localStorageService.get('globals');
                    }

                    function checkRole(authRoles) {

                        var currentUser = localStorageService.get('globals').currentUser;
                        return authRoles.indexOf(currentUser.role) != -1 || authRoles == [];
                    }

                    function ClearCredentials() {
                        $rootScope.globals = {};
                        localStorageService.remove('globals');
                        $http.defaults.headers.common.Authorization = 'Basic';
                    }
                }
            ];
        }).call(this, typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
    }, {}],
    4: [function (require, module, exports) {
        (function (global) {
            'use strict';

            var angular = (typeof window !== "undefined" ? window.angular : typeof global !== "undefined" ? global.angular : null);

            angular.module('Auth', [])
                .service('authService', require('./authentication.service'));

        }).call(this, typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
    }, {"./authentication.service": 3}],
    5: [function (require, module, exports) {
        (function (global) {
            'use strict';

            var angular = (typeof window !== "undefined" ? window.angular : typeof global !== "undefined" ? global.angular : null);

            module.exports = [
                '$rootScope',
                function ($rootScope) {
                    var service = {};

                    service.Success = Success;
                    service.Error = Error;

                    initService();

                    return service;

                    function initService() {
                        $rootScope.$on('$locationChangeStart', function () {
                            clearFlashMessage();
                        });

                        function clearFlashMessage() {
                            var flash = $rootScope.flash;
                            if (flash) {
                                if (!flash.keepAfterLocationChange) {
                                    delete $rootScope.flash;
                                } else {
                                    // only keep for a single location change
                                    flash.keepAfterLocationChange = false;
                                }
                            }
                        }
                    }

                    function Success(message, keepAfterLocationChange) {
                        $rootScope.flash = {
                            message: message,
                            type: 'success',
                            keepAfterLocationChange: keepAfterLocationChange
                        };
                    }

                    function Error(message, keepAfterLocationChange) {
                        $rootScope.flash = {
                            message: message,
                            type: 'error',
                            keepAfterLocationChange: keepAfterLocationChange
                        };
                    }
                }
            ];
        }).call(this, typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
    }, {}],
    6: [function (require, module, exports) {
        (function (global) {
            'use strict';

            var angular = (typeof window !== "undefined" ? window.angular : typeof global !== "undefined" ? global.angular : null);

            angular.module('Flash', [])
                .service('flashService', require('./flash.service'));

        }).call(this, typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
    }, {"./flash.service": 5}],
    7: [function (require, module, exports) {
        (function (global) {
            'use strict';

            var angular = (typeof window !== "undefined" ? window.angular : typeof global !== "undefined" ? global.angular : null);

            angular.module('Message', [])
                .service('messageService', require('./message-service'));

        }).call(this, typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
    }, {"./message-service": 8}],
    8: [function (require, module, exports) {
        (function (global) {
            'use strict';

            var alertify = (typeof window !== "undefined" ? window.alertify : typeof global !== "undefined" ? global.alertify : null);

            module.exports = [
                '$timeout',
                function ($timeout) {
                    return {
                        alert: function (message, callback) {
                            alertify.alert(message, function () {
                                $timeout(function () {
                                    callback();
                                });
                            });
                        },
                        confirm: function (message, okCallback, cancelCallback) {
                            alertify.confirm(
                                message,
                                function (e) {
                                    if (e) {
                                        if (okCallback) {
                                            $timeout(function () {
                                                okCallback();
                                            });
                                        }
                                    } else {
                                        if (cancelCallback) {
                                            $timeout(function () {
                                                cancelCallback();
                                            });
                                        }
                                    }
                                }
                            );
                        },
                        success: function (message) {
                            alertify.success(message);
                        },
                        error: function (message) {
                            if (Array.isArray(message)) {
                                angular.forEach(message, function (value) {
                                    alertify.error(value);
                                });
                            } else {
                                alertify.error(message);
                            }
                        },
                        log: function (message) {
                            alertify.log(message);
                        },
                        errorResponse: function (response) {
                            if (typeof response.message != 'undefined') {
                                return alertify.error(response.message);
                            } else {
                                return alertify.error('Unknown Error!');
                            }
                        },
                        messageFromResponse: function (response) {
                            if (typeof response.message != 'undefined') {
                                return response.status === 'success'
                                    ? alertify.success(response.message)
                                    : alertify.error(response.message);
                            } else {
                                return response.status === 'success'
                                    ? false
                                    : alertify.error('Unknown Error!');
                            }
                        },
                        isSuccess: function (response) {
                            return response.status === 'success';
                        },
                        isError: function (response) {
                            return response.status === 'error';
                        }
                    };
                }
            ];

        }).call(this, typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
    }, {}],
    9: [function (require, module, exports) {
        'use strict';

        module.exports = ['$httpProvider', function ($httpProvider) {
            $httpProvider.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';
            $httpProvider.defaults.headers.common['Content-Type'] = 'application/json';
        }];
    }, {}],
    10: [function (require, module, exports) {
        (function (global) {
            'use strict';

            var angular = (typeof window !== "undefined" ? window.angular : typeof global !== "undefined" ? global.angular : null);

            angular.module('Request', [])
                .provider('requestService', require('./provider'))
                .config(require('./config'));

        }).call(this, typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
    }, {"./config": 9, "./provider": 11}],
    11: [function (require, module, exports) {
        (function (global) {
            'use strict';

            var angular = (typeof window !== "undefined" ? window.angular : typeof global !== "undefined" ? global.angular : null);

            module.exports = function () {
                var apiUrl = 'http://localhost:8080/',
                    defaultConfig = {
                        cache: false,
                        withCredentials: true
                    };

                this.setApiUrl = function (url) {
                    apiUrl = url;
                };

                this.$get = [
                    '$http',
                    '$q',
                    'localStorageService',
                    '$state',
                    function ($http, $q, localStorageService, $state) {
                        /*$http.defaults.headers.common['Authorization'] = 'Basic ' +
                         localStorageService.get('globals').currentUser.authdata ? localStorageService.get('globals').currentUser.authdata : "";
                         */
                        var respond = function (deferred, callback) {
                            return function (data, status, headers) {

                                var contentType = headers('content-type') || '',
                                    response;

                                if (contentType.indexOf('application/json') !== 0) {
                                    return deferred.reject({
                                        meta: {
                                            status: 500,
                                            errors: ['wrong response content type']
                                        },
                                        data: data
                                    });
                                }

                                if (!data) {
                                    return callback();
                                }

                                response = data || {};

                                if (!response.meta) {
                                    response.meta = {};
                                }

                                response.meta.headers = headers || null;
                                response.meta.status = status;

                                if (status !== 200 && status !== 201) {
                                    if (status === 500 || status === 404) {
                                        console.log(data);
                                    } else if (status === 400 || status === 403) {
                                        response.validationErrors = {};
                                    } else if (status === 401) {
                                        localStorageService.remove('token');
                                        localStorageService.remove('currentUser');
                                        $state.go('login');
                                    }

                                    return deferred.reject(response);
                                }

                                callback(response);
                            };
                        };

                        return {
                            getApiUrl: function () {
                                return apiUrl;
                            },

                            request: function (config) {
                                var deferred = $q.defer();

                                config = angular.extend({}, defaultConfig, config);

                                if (typeof config.baseUrl !== 'undefined' && config.baseUrl) {
                                    config.url = config.baseUrl + config.url;
                                } else {
                                    config.url = apiUrl + config.url;
                                }

                                var token = localStorageService.get('token');
                                if (token) {
                                    config.url += '?token=' + token;
                                }

                                if (!config.data) {
                                    config.data = {};
                                }

                                $http(config)
                                    .success(respond(deferred, deferred.resolve))
                                    .error(respond(deferred, deferred.reject));

                                return deferred.promise;
                            },

                            get: function (url, data) {
                                var config = {
                                    method: 'GET',
                                    url: url
                                };

                                if (typeof data !== 'undefined') {
                                    config.data = data;
                                }

                                return this.request(config);
                            },

                            post: function (url, data) {
                                var config = {
                                    method: 'POST',
                                    url: url
                                };

                                if (typeof data !== 'undefined') {
                                    config.data = data;
                                }

                                return this.request(config);
                            },

                            delete: function (url, data) {
                                var config = {
                                    method: 'DELETE',
                                    url: url
                                };

                                if (typeof data !== 'undefined') {
                                    config.data = data;
                                }

                                return this.request(config);
                            },

                            patch: function (url, data) {
                                var config = {
                                    method: 'PATCH',
                                    url: url
                                };

                                if (typeof data !== 'undefined') {
                                    config.data = data;
                                }

                                return this.request(config);
                            },

                            put: function (url, data) {
                                var config = {
                                    method: 'PUT',
                                    url: url
                                };

                                if (typeof data !== 'undefined') {
                                    config.data = data;
                                }

                                return this.request(config);
                            }
                        };
                    }
                ];
            };

        }).call(this, typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
    }, {}],
    12: [function (require, module, exports) {
        'use strict';

        module.exports = [
            '$stateProvider',
            function ($stateProvider) {
                $stateProvider
                    .state('home', {
                        url: '/',
                        template: require('./template.html'),
                        controller: 'HomeController',
                        controllerAs: 'vm',
                        data: {
                            authorizedRoles: ['USER', 'ADMIN']
                        }
                    });
            }
        ];


    }, {"./template.html": 15}],
    13: [function (require, module, exports) {
        'use strict';

        module.exports = [
            '$scope',
            'userService',
            '$rootScope',
            function ($scope, UserService, $rootScope) {
                var vm = this;

                vm.user = null;
                vm.allUsers = [];

                initController();

                function initController() {
                    loadCurrentUser();
                    loadAllUsers();
                }

                function loadCurrentUser() {
                    UserService.getCurrentUser()
                        .then(function (user) {
                            vm.user = user.data;
                        });
                }

                function loadAllUsers() {
                    UserService.getAll()
                        .then(function (users) {
                            vm.allUsers = users.data;
                        });
                }
            }
        ];
    }, {}],
    14: [function (require, module, exports) {
        (function (global) {
            'use strict';

            var angular = (typeof window !== "undefined" ? window.angular : typeof global !== "undefined" ? global.angular : null);

            angular
                .module('Home', [])
                .config(require('./config'))
                .run(require('../run'))
                .directive('topMenu', require('./top-menu/directive'))
                .controller('HomeController', require('./controller'));

        }).call(this, typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
    }, {"../run": 28, "./config": 12, "./controller": 13, "./top-menu/directive": 17}],
    15: [function (require, module, exports) {
        module.exports = '<div class="container" style="margin-top:50px">\n    <h1>Добро пожаловать {{vm.user.name}}!</h1>\n    <div class="row">\n        <div class="col-md-4">\n            <p>A fixed navigation bar stays visible in a fixed position (top or bottom) independent of the page scroll.</p>\n            <p>A fixed navigation bar stays visible in a fixed position (top or bottom) independent of the page scroll.</p>\n        </div>\n        <div class="col-md-4">\n            <p>A fixed navigation bar stays visible in a fixed position (top or bottom) independent of the page scroll.</p>\n            <p>A fixed navigation bar stays visible in a fixed position (top or bottom) independent of the page scroll.</p>\n        </div>\n        <div class="col-md-4">\n            <p>A fixed navigation bar stays visible in a fixed position (top or bottom) independent of the page scroll.</p>\n            <p>A fixed navigation bar stays visible in a fixed position (top or bottom) independent of the page scroll.</p>\n        </div>\n    </div>\n</div>\n<h3>Все зарегистрированные на данный момент пользователи:</h3>\n<ul>\n    <li ng-repeat="user in vm.allUsers">\n        {{user.username}} ({{user.name}})\n    </li>\n</ul>\n';
    }, {}],
    16: [function (require, module, exports) {
        'use strict';

        module.exports = [
            '$scope',
            '$state',
            'authService',
            function ($scope, $state, authService) {

                $scope.isCollapsed = true;
                $scope.authStatus = false;
                $scope.isAuth = function () {
                    if (!$scope.authStatus)
                        $scope.authStatus = authService.isAuth();
                    return $scope.authStatus;
                };

                $scope.logout = function () {
                    $scope.authStatus = false;
                    return authService.ClearCredentials();
                };
            }
        ];

    }, {}],
    17: [function (require, module, exports) {
        'use strict';

        module.exports = [function () {
            return {
                restrict: 'E',
                replace: true,
                scope: true,
                controller: require('./controller'),
                template: require('./template.html')
            };
        }
        ];

    }, {"./controller": 16, "./template.html": 18}],
    18: [function (require, module, exports) {
        module.exports = '<div ng-show="isAuth()" class="container-fluid">\n    <nav class="navbar navbar-inverse navbar-fixed-top">\n        <div class="navbar-header">\n            <button type="button"\n                    ng-click="isCollapsed = !isCollapsed"\n                    class="navbar-toggle collapsed" >\n                <span class="sr-only">Toggle navigation</span>\n                <span class="icon-bar"></span>\n                <span class="icon-bar"></span>\n                <span class="icon-bar"></span>\n            </button>\n            <a class="navbar-brand">LogisticSystem</a>\n        </div>\n        <div id="navbar"\n             class="navbar-collapse collapse"\n             ng-class="{\'text-align-center\': !isCollapsed}"\n             uib-collapse="isCollapsed">\n            <ul class="nav navbar-nav navbar-right margin-right-5">\n                <li><a ui-sref="#">Page1</a></li>\n                <li><a ui-sref="#">Page2</a></li>\n                <li><a ui-sref="#">Page3</a> </li>\n                <li ng-click="logout()"><a href="#/logout" class="cursor-pointer">Выйти</a></li>\n            </ul>\n        </div>\n    </nav>\n</div>\n';
    }, {}],
    19: [function (require, module, exports) {
        'use strict';

        module.exports = [
            '$stateProvider',
            function ($stateProvider) {
                $stateProvider
                    .state('login', {
                        url: '/login',
                        template: require('./template.html'),
                        controller: 'LoginController',
                        controllerAs: 'vm'
                    })
                    .state('logout', {
                        url: '/logout'
                    })
                    .state('forbidden', {
                        url: '/forbidden',
                        template: require('./forbidden-template.html')
                    });
            }
        ];


    }, {"./forbidden-template.html": 21, "./template.html": 23}],
    20: [function (require, module, exports) {
        'use strict';

        module.exports = [
            '$scope',
            '$location',
            'authService',
            'flashService',
            function ($scope, $location, authenticationService, flashService) {
                var vm = this;

                vm.login = login;

                (function initController() {
                    authenticationService.ClearCredentials();
                })();

                function login() {
                    vm.dataLoading = true;
                    authenticationService.SetCredentials(vm.username, vm.password);
                    authenticationService.Login(vm.username, vm.password, function (response) {
                        if (response.success) {
                            authenticationService.SetCredentials(vm.username, vm.password);
                            $location.path('/');
                        } else {
                            authenticationService.ClearCredentials();
                            flashService.Error(response.message);
                            vm.dataLoading = false;
                        }
                    });
                }
            }
        ];


    }, {}],
    21: [function (require, module, exports) {
        module.exports = '<div class="logo-container">\n    <div>\n        <h3>Forbidden</h3>\n    </div>\n</div>';
    }, {}],
    22: [function (require, module, exports) {
        (function (global) {
            'use strict';

            var angular = (typeof window !== "undefined" ? window.angular : typeof global !== "undefined" ? global.angular : null);

            angular
                .module('Login', [])
                .config(require('./config'))
                .run(require('../run'))
                .controller('LoginController', require('./controller'));

        }).call(this, typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
    }, {"../run": 28, "./config": 19, "./controller": 20}],
    23: [function (require, module, exports) {
        module.exports = '<div ng-class="{ \'alert\': flash, \'alert-success\': flash.type === \'success\', \'alert-danger\': flash.type === \'error\' }" ng-if="flash" ng-bind="flash.message"></div>\n<div class="col-md-6 col-md-offset-3">\n    <h2>Login</h2>\n    <form name="form" ng-submit="vm.login()" role="form">\n        <div class="form-group" ng-class="{ \'has-error\': form.username.$dirty && form.username.$error.required }">\n            <label for="username">Username</label>\n            <input type="text" name="username" id="username" class="form-control" ng-model="vm.username" required/>\n            <span ng-show="form.username.$dirty && form.username.$error.required" class="help-block">Username - обязательное поле</span>\n        </div>\n        <div class="form-group" ng-class="{ \'has-error\': form.password.$dirty && form.password.$error.required }">\n            <label for="password">Password</label>\n            <input type="password" name="password" id="password" class="form-control" ng-model="vm.password" required/>\n            <span ng-show="form.password.$dirty && form.password.$error.required" class="help-block">Password - обязательное поле</span>\n        </div>\n        <div class="form-actions">\n            <button type="submit" ng-disabled="form.$invalid || vm.dataLoading" class="btn btn-primary">Войти</button>\n            <img ng-if="vm.dataLoading"\n                 src="data:image/gif;base64,R0lGODlhEAAQAPIAAP///wAAAMLCwkJCQgAAAGJiYoKCgpKSkiH/C05FVFNDQVBFMi4wAwEAAAAh/hpDcmVhdGVkIHdpdGggYWpheGxvYWQuaW5mbwAh+QQJCgAAACwAAAAAEAAQAAADMwi63P4wyklrE2MIOggZnAdOmGYJRbExwroUmcG2LmDEwnHQLVsYOd2mBzkYDAdKa+dIAAAh+QQJCgAAACwAAAAAEAAQAAADNAi63P5OjCEgG4QMu7DmikRxQlFUYDEZIGBMRVsaqHwctXXf7WEYB4Ag1xjihkMZsiUkKhIAIfkECQoAAAAsAAAAABAAEAAAAzYIujIjK8pByJDMlFYvBoVjHA70GU7xSUJhmKtwHPAKzLO9HMaoKwJZ7Rf8AYPDDzKpZBqfvwQAIfkECQoAAAAsAAAAABAAEAAAAzMIumIlK8oyhpHsnFZfhYumCYUhDAQxRIdhHBGqRoKw0R8DYlJd8z0fMDgsGo/IpHI5TAAAIfkECQoAAAAsAAAAABAAEAAAAzIIunInK0rnZBTwGPNMgQwmdsNgXGJUlIWEuR5oWUIpz8pAEAMe6TwfwyYsGo/IpFKSAAAh+QQJCgAAACwAAAAAEAAQAAADMwi6IMKQORfjdOe82p4wGccc4CEuQradylesojEMBgsUc2G7sDX3lQGBMLAJibufbSlKAAAh+QQJCgAAACwAAAAAEAAQAAADMgi63P7wCRHZnFVdmgHu2nFwlWCI3WGc3TSWhUFGxTAUkGCbtgENBMJAEJsxgMLWzpEAACH5BAkKAAAALAAAAAAQABAAAAMyCLrc/jDKSatlQtScKdceCAjDII7HcQ4EMTCpyrCuUBjCYRgHVtqlAiB1YhiCnlsRkAAAOwAAAAAAAAAAAA=="/>\n            <a href="#/registration" class="btn btn-link">Зарегистрироваться</a>\n        </div>\n    </form>\n</div>\n';
    }, {}],
    24: [function (require, module, exports) {
        'use strict';

        module.exports = [
            '$stateProvider',
            function ($stateProvider) {
                $stateProvider
                    .state('registration', {
                        url: '/registration',
                        template: require('./template.html'),
                        controller: 'RegistrationController',
                        controllerAs: 'vm'
                    });
            }
        ];


    }, {"./template.html": 27}],
    25: [function (require, module, exports) {
        'use strict';

        module.exports = [
            '$scope',
            '$location',
            'userService',
            'flashService',
            function ($scope, $location, userService, flashService) {
                var vm = this;

                vm.register = register;

                function register() {
                    vm.dataLoading = true;
                    vm.user.role = {
                        idRole: 2,
                        nameRole: 'USER'
                    };
                    userService.create(vm.user)
                        .then(function (response) {
                            if (response.success) {
                                flashService.Success('Регистрация прошла успешно!', true);
                                $location.path('/login');
                            } else {
                                flashService.Error(response.message);
                                vm.dataLoading = false;
                            }
                        });
                }
            }
        ];


    }, {}],
    26: [function (require, module, exports) {
        (function (global) {
            'use strict';

            var angular = (typeof window !== "undefined" ? window.angular : typeof global !== "undefined" ? global.angular : null);

            angular
                .module('Registration', [])
                .config(require('./config'))
                .run(require('../run'))
                .controller('RegistrationController', require('./controller'));

        }).call(this, typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
    }, {"../run": 28, "./config": 24, "./controller": 25}],
    27: [function (require, module, exports) {
        module.exports = '<div class="col-md-6 col-md-offset-3">\n    <h2>Register</h2>\n    <form name="form" ng-submit="vm.register()" role="form">\n        <div class="form-group" ng-class="{ \'has-error\': form.name.$dirty && form.name.$error.required }">\n            <label for="username">Название компании</label>\n            <input type="text" name="name" id="name" class="form-control" ng-model="vm.user.name" required />\n            <span ng-show="form.name.$dirty && form.name.$error.required" class="help-block">Название компании - обязательное поле</span>\n        </div>\n        <div class="form-group" ng-class="{ \'has-error\': form.email.$dirty && form.email.$error.required }">\n            <label for="username">Email</label>\n            <input type="text" name="email" id="email" class="form-control" ng-model="vm.user.email" required />\n            <span ng-show="form.email.$dirty && form.email.$error.required" class="help-block">Email - обязательное поле</span>\n        </div>\n        <div class="form-group" ng-class="{ \'has-error\': form.phone.$dirty && form.phone.$error.required }">\n            <label for="username">Контактный номер</label>\n            <input type="text" name="phone" id="phone" class="form-control" ng-model="vm.user.phone" required />\n            <span ng-show="form.phone.$dirty && form.phone.$error.required" class="help-block">Контактный номер - обязательное поле</span>\n        </div>\n        <div class="form-group" ng-class="{ \'has-error\': form.about.$dirty && form.about.$error.required }">\n            <label for="username">Кратко о вас:</label>\n            <input type="text" name="about" id="about" class="form-control" ng-model="vm.user.about" required />\n            <span ng-show="form.about.$dirty && form.about.$error.required" class="help-block">О вас - обязательное поле</span>\n        </div>\n        <div class="form-group" ng-class="{ \'has-error\': form.username.$dirty && form.username.$error.required }">\n            <label for="username">Username</label>\n            <input type="text" name="username" id="username" class="form-control" ng-model="vm.user.username" required />\n            <span ng-show="form.username.$dirty && form.username.$error.required" class="help-block">Username - обязательное поле</span>\n        </div>\n        <div class="form-group" ng-class="{ \'has-error\': form.password.$dirty && form.password.$error.required }">\n            <label for="password">Password</label>\n            <input type="password" name="password" id="password" class="form-control" ng-model="vm.user.password" required />\n            <span ng-show="form.password.$dirty && form.password.$error.required" class="help-block">Password - обязательное поле</span>\n        </div>\n        <div class="form-actions">\n            <button type="submit" ng-disabled="form.$invalid || vm.dataLoading" class="btn btn-primary">Зарегистрироваться</button>\n            <img ng-if="vm.dataLoading" src="data:image/gif;base64,R0lGODlhEAAQAPIAAP///wAAAMLCwkJCQgAAAGJiYoKCgpKSkiH/C05FVFNDQVBFMi4wAwEAAAAh/hpDcmVhdGVkIHdpdGggYWpheGxvYWQuaW5mbwAh+QQJCgAAACwAAAAAEAAQAAADMwi63P4wyklrE2MIOggZnAdOmGYJRbExwroUmcG2LmDEwnHQLVsYOd2mBzkYDAdKa+dIAAAh+QQJCgAAACwAAAAAEAAQAAADNAi63P5OjCEgG4QMu7DmikRxQlFUYDEZIGBMRVsaqHwctXXf7WEYB4Ag1xjihkMZsiUkKhIAIfkECQoAAAAsAAAAABAAEAAAAzYIujIjK8pByJDMlFYvBoVjHA70GU7xSUJhmKtwHPAKzLO9HMaoKwJZ7Rf8AYPDDzKpZBqfvwQAIfkECQoAAAAsAAAAABAAEAAAAzMIumIlK8oyhpHsnFZfhYumCYUhDAQxRIdhHBGqRoKw0R8DYlJd8z0fMDgsGo/IpHI5TAAAIfkECQoAAAAsAAAAABAAEAAAAzIIunInK0rnZBTwGPNMgQwmdsNgXGJUlIWEuR5oWUIpz8pAEAMe6TwfwyYsGo/IpFKSAAAh+QQJCgAAACwAAAAAEAAQAAADMwi6IMKQORfjdOe82p4wGccc4CEuQradylesojEMBgsUc2G7sDX3lQGBMLAJibufbSlKAAAh+QQJCgAAACwAAAAAEAAQAAADMgi63P7wCRHZnFVdmgHu2nFwlWCI3WGc3TSWhUFGxTAUkGCbtgENBMJAEJsxgMLWzpEAACH5BAkKAAAALAAAAAAQABAAAAMyCLrc/jDKSatlQtScKdceCAjDII7HcQ4EMTCpyrCuUBjCYRgHVtqlAiB1YhiCnlsRkAAAOwAAAAAAAAAAAA==" />\n            <a href="#/login" class="btn btn-link">Отмена</a>\n        </div>\n    </form>\n</div>\n';
    }, {}],
    28: [function (require, module, exports) {
        'use strict';

        module.exports = [
            '$rootScope',
            'authService',
            '$state',
            function ($rootScope, authService, $state) {

                var statesWithoutAuth = [
                    'login',
                    'registration'
                ];

                var defaultAuthState = 'home';
                var defaultNonAuthState = 'login';
                var accessDenyState = 'forbidden';

                $rootScope.$on('$stateChangeStart', function (event, toState) {

                    var redirect = function (state) {
                        event.preventDefault();
                        return $state.go(state);
                    };

                    var checkAuth = function () {

                        if (toState.name === 'logout') {
                            authService.ClearCredentials();
                            return redirect('login');
                        } else {
                            if (statesWithoutAuth.indexOf(toState.name) != -1) {
                                if (authService.isAuth()) {
                                    return redirect(defaultAuthState);
                                }
                            } else {
                                var authorizedRoles = (!toState.data || !toState.data.authorizedRoles)
                                    ? []
                                    : toState.data.authorizedRoles;
                                if (!authService.isAuth()) {
                                    return redirect(defaultNonAuthState);
                                } else if (!authService.checkRole(authorizedRoles)) {
                                    return redirect(accessDenyState);
                                }
                            }
                        }
                    };

                    checkAuth();
                });
            }
        ];
    }, {}],
    29: [function (require, module, exports) {
        'use strict';

        module.exports = [
            '$stateProvider',
            function ($stateProvider) {
                $stateProvider
                    .state('users', {
                        url: '/users',
                        controller: 'UserController',
                        controllerAs: 'vm',
                        template: require('./template.html'),
                        data: {
                            authorizedRoles: ['admin']
                        }
                    });
            }
        ];

    }, {"./template.html": 32}],
    30: [function (require, module, exports) {
        'use strict';

        module.exports = [
            '$scope',
            function ($scope) {

            }
        ];

    }, {}],
    31: [function (require, module, exports) {
        (function (global) {
            'use strict';

            var angular = (typeof window !== "undefined" ? window.angular : typeof global !== "undefined" ? global.angular : null);

            angular
                .module('User', [])
                .config(require('./config'))
                .controller('UserController', require('./controller'))
                .service('userService', require('./user-service'));

        }).call(this, typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
    }, {"./config": 29, "./controller": 30, "./user-service": 33}],
    32: [function (require, module, exports) {
        module.exports = '<div class="main-block max-block-width\n            col-lg-7 col-lg-offset-3\n            col-md-8 col-md-offset-2\n            col-sm-offset-10 col-sm-offset-1\n            col-xs-12">\n    <div class="col-md-6 col-md-offset-3">\n        User Module\n    </div>\n\n</div>\n';
    }, {}],
    33: [function (require, module, exports) {
        'use strict';

        module.exports = [
            '$http',
            'localStorageService',
            function ($http, localStorageService) {
                var service = {};

                var REST_SERVICE_URI = 'http://localhost:8080/';

                var authData = localStorageService.get('globals') ? localStorageService.get('globals').currentUser.authdata : "";

                $http.defaults.headers.common['Authorization'] = 'Basic ' + authData;

                service.getAll = getAll;
                service.getCurrentUser = getCurrentUser;
                service.create = create;
                service.update = update;
                service.Delete = Delete;

                return service;

                function getAll() {
                    return $http.get(REST_SERVICE_URI + 'rest/get/role/users').then(handleSuccess,
                        handleError('Ошибка при получении всех пользователей'));
                }

                function getCurrentUser() {
                    return $http.get(REST_SERVICE_URI + 'rest/get/currentUser').then(handleSuccess,
                        handleError('Ошибка при получении текущего пользователя'));
                }

                function create(user) {
                    return $http.post(REST_SERVICE_URI + 'user', user).then(handleSuccess,
                        handleError('Ошибка регистрации пользователя'));
                }

                function update(user) {
                    return $http.put('/api/users/' + user.id, user).then(handleSuccess, handleError('Error updating user'));
                }

                function Delete(id) {
                    return $http.delete('/api/users/' + id).then(handleSuccess, handleError('Error deleting user'));
                }

                function handleSuccess(res) {
                    return {
                        success: true,
                        data: res.data
                    };
                }

                function handleError(error) {
                    return function () {
                        return {success: false, message: error};
                    };
                }

            }
        ];
    }, {}]
}, {}, [2]);
