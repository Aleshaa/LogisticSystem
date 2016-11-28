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
            require('./modules/goods');

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
                        'User',
                        'Goods'
                    ]);
                angular.bootstrap(document, ['App']);
            });

        }).call(this, typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
    }, {
        "./common/auth": 4,
        "./common/flash": 6,
        "./common/message": 7,
        "./common/request": 10,
        "./modules/goods": 15,
        "./modules/home": 19,
        "./modules/login": 27,
        "./modules/register": 31,
        "./modules/user": 36,
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
                    service.getAuthUser = getAuthUser;
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
                        return localStorageService.get('globals') ? true : false;
                    }

                    function getAuthUser() {
                        return localStorageService.get('globals') ? localStorageService.get('globals').currentUser : "";
                    }

                    function checkRole(authRoles) {
                        var currentUser = {
                            role: ""
                        };
                        if (localStorageService.get('globals'))
                            currentUser = localStorageService.get('globals').currentUser;
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
                    .state('goods', {
                        url: '/goods',
                        controller: 'GoodsController',
                        controllerAs: 'vm',
                        template: require('./template.html'),
                        data: {
                            authorizedRoles: ['ADMIN', 'USER']
                        }
                    });
            }
        ];

    }, {"./template.html": 16}],
    13: [function (require, module, exports) {
        'use strict';

        module.exports = [
            '$scope',
            'goodsService',
            function ($scope, goodsService) {
                var vm = this;

                vm.goods = [];
                vm.newGoods = {};
                vm.creationForm = false;
                vm.editionForm = false;
                vm.dataLoading = false;
                vm.showEditForm = showEditForm;
                vm.showCreationForm = showCreationForm;
                vm.remove = remove;
                vm.formAction = formAction;

                initController();

                function formAction() {
                    vm.dataLoading = true;
                    if (vm.editionForm) {
                        edit();
            }
                    else if (vm.creationForm) {
                        create();
                    }
                }

                function initController() {
                    vm.dataLoading = true;
                    loadAllGoods();
                    vm.dataLoading = false;
                    vm.newGoods = {};
                }

                function showCreationForm() {
                    vm.newGoods = {};
                    vm.creationForm = true;
                    vm.editionForm = false;
                }

                function showEditForm(goods) {
                    vm.newGoods = goods;
                    vm.editionForm = true;
                    vm.creationForm = false;
                }


                function remove(idGoods) {
                    vm.dataLoading = true;
                    goodsService.Delete(idGoods)
                        .then(function (response) {
                            if (response.success) {
                                loadAllGoods();
                                vm.dataLoading = false;
                            } else {
                                console.log("Что-то пошло не так")
                            }
                        });
                }

                function create() {
                    goodsService.create(vm.newGoods)
                        .then(function (response) {
                            if (response.success) {
                                loadAllGoods();
                                vm.creationForm = false;
                                vm.newGoods = {};
                                vm.dataLoading = false;
                            } else {
                                console.log("Что-то пошло не так")
                            }
                        });
                }

                function edit() {
                    goodsService.update(vm.newGoods)
                        .then(function (response) {
                            if (response.success) {
                                loadAllGoods();
                                vm.editionForm = false;
                                vm.newGoods = {};
                                vm.dataLoading = false;
                            } else {
                                console.log("Что-то пошло не так")
                            }
                        });
                }

                function loadAllGoods() {
                    goodsService.getAll()
                        .then(function (goods) {
                            vm.goods = goods.data;
                        });
                }
            }
        ];

    }, {}],
    14: [function (require, module, exports) {
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
                service.create = create;
                service.update = update;
                service.Delete = Delete;

                return service;

                function getAll() {
                    return $http.get(REST_SERVICE_URI + 'rest/get/goods').then(handleSuccess,
                        handleError('Ошибка при получении всех товаров'));
                }

                function create(newGoods) {
                    return $http.post(REST_SERVICE_URI + 'rest/create/goods', newGoods).then(handleSuccess,
                        handleError('Ошибка при добавлении нового товара'));
                }

                function update(curGoods) {
                    return $http.put(REST_SERVICE_URI + 'rest/update/goods/' + curGoods.idGoods, curGoods).then(handleSuccess,
                        handleError('Ошибка обновления товара'));
                }

                function Delete(id) {
                    return $http.delete(REST_SERVICE_URI + 'rest/delete/goods/' + id).then(handleSuccess,
                        handleError('Ошибка удаления товара'));
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
    }, {}],
    15: [function (require, module, exports) {
        (function (global) {
            'use strict';

            var angular = (typeof window !== "undefined" ? window.angular : typeof global !== "undefined" ? global.angular : null);

            angular
                .module('Goods', [])
                .config(require('./config'))
                .controller('GoodsController', require('./controller'))
                .service('goodsService', require('./goods-service'));

        }).call(this, typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
    }, {"./config": 12, "./controller": 13, "./goods-service": 14}],
    16: [function (require, module, exports) {
        module.exports = '<div class="container" style="margin-top:70px">\n    <div class="row">\n        <div class="col-sm-2">\n            <ul id="sidebar" class="nav nav-stacked affix">\n                <li><a href="#">The Next Web</a></li>\n                <li><a href="#">Mashable</a></li>\n                <li><a href="#">TechCrunch</a></li>\n                <li><a href="#">GitHub</a></li>\n                <li><a href="#">In1</a></li>\n                <li><a href="#">TechMeMe</a></li>\n            </ul>\n        </div>\n        <div class="col-sm-10">\n            <div class="panel panel-default">\n                <!-- Default panel contents -->\n                <div class="panel-heading">Доступные товары</div>\n\n                <!-- Table -->\n                <table class="table table-hover">\n                    <thead>\n                        <tr>\n                            <th>Название</th>\n                            <th>Количество</th>\n                            <th>Цена</th>\n                            <th>О продукте</th>\n                            <th></th>\n                        </tr>\n                    </thead>\n                    <tbody>\n                    <tr ng-repeat="g in vm.goods" class="{{g.quantity > 0 ? \'\' : \'danger\'}}">\n                        <td>{{g.name}}</td>\n                        <td>{{g.quantity}}</td>\n                        <td>{{g.price}}</td>\n                        <td>{{g.about}}</td>\n                        <td>\n                            <button ng-click="vm.showEditForm(g)" ctype="button" class="btn btn-default btn-sm" data-toggle="modal" data-target="#myModal">\n                                <span class="glyphicon glyphicon-edit"></span> Редактировать\n                            </button>\n                            <button ng-click="vm.remove(g.idGoods)" type="button" class="btn btn-default btn-sm">\n                                <span class="glyphicon glyphicon-remove"></span> Удалить\n                            </button>\n                            <button ng-if="g.quantity == 0" type="button" class="btn btn-default btn-sm">\n                                <span class="glyphicon glyphicon-download"></span> Заказать товар\n                            </button>\n                        </td>\n                    </tr>\n                    </tbody>\n                </table>\n            </div>\n            <button ng-click="vm.showCreationForm()" ctype="button" class="btn btn-info btn-lg" data-toggle="modal" data-target="#myModal">\n                Добавить\n            </button>\n            <img ng-if="vm.dataLoading"\n                 src="data:image/gif;base64,R0lGODlhEAAQAPIAAP///wAAAMLCwkJCQgAAAGJiYoKCgpKSkiH/C05FVFNDQVBFMi4wAwEAAAAh/hpDcmVhdGVkIHdpdGggYWpheGxvYWQuaW5mbwAh+QQJCgAAACwAAAAAEAAQAAADMwi63P4wyklrE2MIOggZnAdOmGYJRbExwroUmcG2LmDEwnHQLVsYOd2mBzkYDAdKa+dIAAAh+QQJCgAAACwAAAAAEAAQAAADNAi63P5OjCEgG4QMu7DmikRxQlFUYDEZIGBMRVsaqHwctXXf7WEYB4Ag1xjihkMZsiUkKhIAIfkECQoAAAAsAAAAABAAEAAAAzYIujIjK8pByJDMlFYvBoVjHA70GU7xSUJhmKtwHPAKzLO9HMaoKwJZ7Rf8AYPDDzKpZBqfvwQAIfkECQoAAAAsAAAAABAAEAAAAzMIumIlK8oyhpHsnFZfhYumCYUhDAQxRIdhHBGqRoKw0R8DYlJd8z0fMDgsGo/IpHI5TAAAIfkECQoAAAAsAAAAABAAEAAAAzIIunInK0rnZBTwGPNMgQwmdsNgXGJUlIWEuR5oWUIpz8pAEAMe6TwfwyYsGo/IpFKSAAAh+QQJCgAAACwAAAAAEAAQAAADMwi6IMKQORfjdOe82p4wGccc4CEuQradylesojEMBgsUc2G7sDX3lQGBMLAJibufbSlKAAAh+QQJCgAAACwAAAAAEAAQAAADMgi63P7wCRHZnFVdmgHu2nFwlWCI3WGc3TSWhUFGxTAUkGCbtgENBMJAEJsxgMLWzpEAACH5BAkKAAAALAAAAAAQABAAAAMyCLrc/jDKSatlQtScKdceCAjDII7HcQ4EMTCpyrCuUBjCYRgHVtqlAiB1YhiCnlsRkAAAOwAAAAAAAAAAAA=="/>\n\n        </div>\n    </div>\n    <div class="modal fade" id="myModal" role="dialog">\n        <div class="modal-dialog">\n\n            <!-- Modal content-->\n            <div class="modal-content">\n                <div class="modal-header">\n                    <button type="button" class="close" data-dismiss="modal">&times;</button>\n                    <h4 class="modal-title">{{vm.creationForm ? "Добавление" : "Редактирование"}}</h4>\n                </div>\n                <form name="form" ng-submit="vm.formAction()" role="form"\n                      style="padding-left: 10px; padding-right: 10px">\n                    <div class="form-group" ng-class="{ \'has-error\': form.name.$dirty && form.name.$error.required }">\n                        <label for="name">Название товара</label>\n                        <input type="text" name="name" id="name" class="form-control" ng-model="vm.newGoods.name" required/>\n                        <span ng-show="form.name.$dirty && form.name.$error.required" class="help-block">Название товара - обязательное поле</span>\n                    </div>\n                    <div class="form-group" ng-class="{ \'has-error\': form.price.$dirty && form.price.$error.required }">\n                        <label for="name">Цена</label>\n                        <input type="text" name="price" id="price" class="form-control" ng-model="vm.newGoods.price" required/>\n                        <span ng-show="form.price.$dirty && form.price.$error.required"\n                              class="help-block">Цена - обязательное поле</span>\n                    </div>\n                    <div class="form-group" ng-class="{ \'has-error\': form.quantity.$dirty && form.quantity.$error.required }">\n                        <label for="name">Количество</label>\n                        <input type="text" name="quantity" id="quantity" class="form-control" ng-model="vm.newGoods.quantity" required/>\n                        <span ng-show="form.quantity.$dirty && form.quantity.$error.required" class="help-block">Количество - обязательное поле</span>\n                    </div>\n                    <div class="form-group" ng-class="{ \'has-error\': form.about.$dirty && form.about.$error.required }">\n                        <label for="name">Коротко о товаре:</label>\n                        <input type="text" name="about" id="about" class="form-control" ng-model="vm.newGoods.about" required/>\n                        <span ng-show="form.about.$dirty && form.about.$error.required"\n                              class="help-block">О вас - обязательное поле</span>\n                    </div>\n                    <div class="modal-footer">\n                        <button ng-click="vm.formAction()" type="submit" class="btn btn-default" data-dismiss="modal">Принять</button>\n                    </div>\n                </form>\n\n            </div>\n\n        </div>\n    </div>\n</div>\n';
    }, {}],
    17: [function (require, module, exports) {
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


    }, {"./template.html": 20}],
    18: [function (require, module, exports) {
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
                }

                function loadCurrentUser() {
                    UserService.getCurrentUser()
                        .then(function (user) {
                            vm.user = user.data;
                        });
                }
            }
        ];
    }, {}],
    19: [function (require, module, exports) {
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
    }, {"../run": 33, "./config": 17, "./controller": 18, "./top-menu/directive": 22}],
    20: [function (require, module, exports) {
        module.exports = '<div class="container" style="margin-top:50px">\n    <h1>Добро пожаловать {{vm.user.name}}!</h1>\n    <div class="row">\n        <div class="col-md-4">\n            <p>A fixed navigation bar stays visible in a fixed position (top or bottom) independent of the page\n                scroll.</p>\n            <p>A fixed navigation bar stays visible in a fixed position (top or bottom) independent of the page\n                scroll.</p>\n        </div>\n        <div class="col-md-4">\n            <p>A fixed navigation bar stays visible in a fixed position (top or bottom) independent of the page\n                scroll.</p>\n            <p>A fixed navigation bar stays visible in a fixed position (top or bottom) independent of the page\n                scroll.</p>\n        </div>\n        <div class="col-md-4">\n            <p>A fixed navigation bar stays visible in a fixed position (top or bottom) independent of the page\n                scroll.</p>\n            <p>A fixed navigation bar stays visible in a fixed position (top or bottom) independent of the page\n                scroll.</p>\n        </div>\n    </div>\n</div>\n';
    }, {}],
    21: [function (require, module, exports) {
        'use strict';

        module.exports = [
            '$scope',
            '$state',
            'authService',
            'userService',
            function ($scope, $state, authService, userService) {

                $scope.isCollapsed = true;
                $scope.authStatus = false;
                $scope.user = {};

                setTimeout(initController(), 1000);

                function initController() {
                    userService.getCurrentUser()
                        .then(function (user) {
                            $scope.user = user.data;
                        });
                    /*$scope.user = authService.getAuthUser();*/
                }

                $scope.isAuth = function () {
                    if (!$scope.authStatus)
                        $scope.authStatus = authService.isAuth();
                    return $scope.authStatus;
                };

                $scope.isAdmin = function () {
                    return authService.checkRole(['ADMIN']);
                };

                $scope.isUser = function () {
                    return authService.checkRole(['USER']);
                };

                $scope.logout = function () {
                    $scope.authStatus = false;
                    return authService.ClearCredentials();
                };
            }
        ];

    }, {}],
    22: [function (require, module, exports) {
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

    }, {"./controller": 21, "./template.html": 23}],
    23: [function (require, module, exports) {
        module.exports = '<div ng-show="isAuth()" class="container-fluid">\n    <nav class="navbar navbar-inverse navbar-fixed-top">\n        <div class="navbar-header">\n            <button type="button"\n                    ng-click="isCollapsed = !isCollapsed"\n                    class="navbar-toggle collapsed">\n                <span class="sr-only">Toggle navigation</span>\n                <span class="icon-bar"></span>\n                <span class="icon-bar"></span>\n                <span class="icon-bar"></span>\n            </button>\n            <a class="navbar-brand">LogisticSystem</a>\n        </div>\n        <div id="navbar"\n             class="navbar-collapse collapse"\n             ng-class="{\'text-align-center\': !isCollapsed}"\n             uib-collapse="isCollapsed">\n            <ul class="nav navbar-nav navbar-right margin-right-5">\n                <li><a ng-if="isAdmin()" href="#/users">Пользователи</a></li>\n                <li><a href="#/goods">Товары</a></li>\n                <li><a ui-sref="#">Page3</a></li>\n                <li ng-click="logout()"><a ng-if="isAdmin()" href="#/logout" class="cursor-pointer">Выйти</a></li>\n                <li ng-click="logout()"><a ng-if="isUser()" href="#/logout" class="cursor-pointer">{{user.name}} | Выйти</a></li>\n            </ul>\n        </div>\n    </nav>\n</div>\n';
    }, {}],
    24: [function (require, module, exports) {
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


    }, {"./forbidden-template.html": 26, "./template.html": 28}],
    25: [function (require, module, exports) {
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
    26: [function (require, module, exports) {
        module.exports = '<div class="logo-container">\n    <div>\n        <h3>Forbidden</h3>\n    </div>\n</div>';
    }, {}],
    27: [function (require, module, exports) {
        (function (global) {
            'use strict';

            var angular = (typeof window !== "undefined" ? window.angular : typeof global !== "undefined" ? global.angular : null);

            angular
                .module('Login', [])
                .config(require('./config'))
                .run(require('../run'))
                .controller('LoginController', require('./controller'));

        }).call(this, typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
    }, {"../run": 33, "./config": 24, "./controller": 25}],
    28: [function (require, module, exports) {
        module.exports = '<div ng-class="{ \'alert\': flash, \'alert-success\': flash.type === \'success\', \'alert-danger\': flash.type === \'error\' }"\n     ng-if="flash" ng-bind="flash.message"></div>\n<div class="col-md-6 col-md-offset-3">\n    <h2>Login</h2>\n    <form name="form" ng-submit="vm.login()" role="form">\n        <div class="form-group" ng-class="{ \'has-error\': form.username.$dirty && form.username.$error.required }">\n            <label for="username">Username</label>\n            <input type="text" name="username" id="username" class="form-control" ng-model="vm.username" required/>\n            <span ng-show="form.username.$dirty && form.username.$error.required" class="help-block">Username - обязательное поле</span>\n        </div>\n        <div class="form-group" ng-class="{ \'has-error\': form.password.$dirty && form.password.$error.required }">\n            <label for="password">Password</label>\n            <input type="password" name="password" id="password" class="form-control" ng-model="vm.password" required/>\n            <span ng-show="form.password.$dirty && form.password.$error.required" class="help-block">Password - обязательное поле</span>\n        </div>\n        <div class="form-actions">\n            <button type="submit" ng-disabled="form.$invalid || vm.dataLoading" class="btn btn-primary">Войти</button>\n            <img ng-if="vm.dataLoading"\n                 src="data:image/gif;base64,R0lGODlhEAAQAPIAAP///wAAAMLCwkJCQgAAAGJiYoKCgpKSkiH/C05FVFNDQVBFMi4wAwEAAAAh/hpDcmVhdGVkIHdpdGggYWpheGxvYWQuaW5mbwAh+QQJCgAAACwAAAAAEAAQAAADMwi63P4wyklrE2MIOggZnAdOmGYJRbExwroUmcG2LmDEwnHQLVsYOd2mBzkYDAdKa+dIAAAh+QQJCgAAACwAAAAAEAAQAAADNAi63P5OjCEgG4QMu7DmikRxQlFUYDEZIGBMRVsaqHwctXXf7WEYB4Ag1xjihkMZsiUkKhIAIfkECQoAAAAsAAAAABAAEAAAAzYIujIjK8pByJDMlFYvBoVjHA70GU7xSUJhmKtwHPAKzLO9HMaoKwJZ7Rf8AYPDDzKpZBqfvwQAIfkECQoAAAAsAAAAABAAEAAAAzMIumIlK8oyhpHsnFZfhYumCYUhDAQxRIdhHBGqRoKw0R8DYlJd8z0fMDgsGo/IpHI5TAAAIfkECQoAAAAsAAAAABAAEAAAAzIIunInK0rnZBTwGPNMgQwmdsNgXGJUlIWEuR5oWUIpz8pAEAMe6TwfwyYsGo/IpFKSAAAh+QQJCgAAACwAAAAAEAAQAAADMwi6IMKQORfjdOe82p4wGccc4CEuQradylesojEMBgsUc2G7sDX3lQGBMLAJibufbSlKAAAh+QQJCgAAACwAAAAAEAAQAAADMgi63P7wCRHZnFVdmgHu2nFwlWCI3WGc3TSWhUFGxTAUkGCbtgENBMJAEJsxgMLWzpEAACH5BAkKAAAALAAAAAAQABAAAAMyCLrc/jDKSatlQtScKdceCAjDII7HcQ4EMTCpyrCuUBjCYRgHVtqlAiB1YhiCnlsRkAAAOwAAAAAAAAAAAA=="/>\n            <a href="#/registration" class="btn btn-link">Зарегистрироваться</a>\n        </div>\n    </form>\n</div>\n';
    }, {}],
    29: [function (require, module, exports) {
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


    }, {"./template.html": 32}],
    30: [function (require, module, exports) {
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
    31: [function (require, module, exports) {
        (function (global) {
            'use strict';

            var angular = (typeof window !== "undefined" ? window.angular : typeof global !== "undefined" ? global.angular : null);

            angular
                .module('Registration', [])
                .config(require('./config'))
                .run(require('../run'))
                .controller('RegistrationController', require('./controller'));

        }).call(this, typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
    }, {"../run": 33, "./config": 29, "./controller": 30}],
    32: [function (require, module, exports) {
        module.exports = '<div class="col-md-6 col-md-offset-3">\n    <h2>Register</h2>\n    <form name="form" ng-submit="vm.register()" role="form">\n        <div class="form-group" ng-class="{ \'has-error\': form.name.$dirty && form.name.$error.required }">\n            <label for="username">Название компании</label>\n            <input type="text" name="name" id="name" class="form-control" ng-model="vm.user.name" required/>\n            <span ng-show="form.name.$dirty && form.name.$error.required" class="help-block">Название компании - обязательное поле</span>\n        </div>\n        <div class="form-group" ng-class="{ \'has-error\': form.email.$dirty && form.email.$error.required }">\n            <label for="username">Email</label>\n            <input type="text" name="email" id="email" class="form-control" ng-model="vm.user.email" required/>\n            <span ng-show="form.email.$dirty && form.email.$error.required"\n                  class="help-block">Email - обязательное поле</span>\n        </div>\n        <div class="form-group" ng-class="{ \'has-error\': form.phone.$dirty && form.phone.$error.required }">\n            <label for="username">Контактный номер</label>\n            <input type="text" name="phone" id="phone" class="form-control" ng-model="vm.user.phone" required/>\n            <span ng-show="form.phone.$dirty && form.phone.$error.required" class="help-block">Контактный номер - обязательное поле</span>\n        </div>\n        <div class="form-group" ng-class="{ \'has-error\': form.about.$dirty && form.about.$error.required }">\n            <label for="username">Кратко о вас:</label>\n            <input type="text" name="about" id="about" class="form-control" ng-model="vm.user.about" required/>\n            <span ng-show="form.about.$dirty && form.about.$error.required"\n                  class="help-block">О вас - обязательное поле</span>\n        </div>\n        <div class="form-group" ng-class="{ \'has-error\': form.username.$dirty && form.username.$error.required }">\n            <label for="username">Username</label>\n            <input type="text" name="username" id="username" class="form-control" ng-model="vm.user.username" required/>\n            <span ng-show="form.username.$dirty && form.username.$error.required" class="help-block">Username - обязательное поле</span>\n        </div>\n        <div class="form-group" ng-class="{ \'has-error\': form.password.$dirty && form.password.$error.required }">\n            <label for="password">Password</label>\n            <input type="password" name="password" id="password" class="form-control" ng-model="vm.user.password"\n                   required/>\n            <span ng-show="form.password.$dirty && form.password.$error.required" class="help-block">Password - обязательное поле</span>\n        </div>\n        <div class="form-actions">\n            <button type="submit" ng-disabled="form.$invalid || vm.dataLoading" class="btn btn-primary">\n                Зарегистрироваться\n            </button>\n            <img ng-if="vm.dataLoading"\n                 src="data:image/gif;base64,R0lGODlhEAAQAPIAAP///wAAAMLCwkJCQgAAAGJiYoKCgpKSkiH/C05FVFNDQVBFMi4wAwEAAAAh/hpDcmVhdGVkIHdpdGggYWpheGxvYWQuaW5mbwAh+QQJCgAAACwAAAAAEAAQAAADMwi63P4wyklrE2MIOggZnAdOmGYJRbExwroUmcG2LmDEwnHQLVsYOd2mBzkYDAdKa+dIAAAh+QQJCgAAACwAAAAAEAAQAAADNAi63P5OjCEgG4QMu7DmikRxQlFUYDEZIGBMRVsaqHwctXXf7WEYB4Ag1xjihkMZsiUkKhIAIfkECQoAAAAsAAAAABAAEAAAAzYIujIjK8pByJDMlFYvBoVjHA70GU7xSUJhmKtwHPAKzLO9HMaoKwJZ7Rf8AYPDDzKpZBqfvwQAIfkECQoAAAAsAAAAABAAEAAAAzMIumIlK8oyhpHsnFZfhYumCYUhDAQxRIdhHBGqRoKw0R8DYlJd8z0fMDgsGo/IpHI5TAAAIfkECQoAAAAsAAAAABAAEAAAAzIIunInK0rnZBTwGPNMgQwmdsNgXGJUlIWEuR5oWUIpz8pAEAMe6TwfwyYsGo/IpFKSAAAh+QQJCgAAACwAAAAAEAAQAAADMwi6IMKQORfjdOe82p4wGccc4CEuQradylesojEMBgsUc2G7sDX3lQGBMLAJibufbSlKAAAh+QQJCgAAACwAAAAAEAAQAAADMgi63P7wCRHZnFVdmgHu2nFwlWCI3WGc3TSWhUFGxTAUkGCbtgENBMJAEJsxgMLWzpEAACH5BAkKAAAALAAAAAAQABAAAAMyCLrc/jDKSatlQtScKdceCAjDII7HcQ4EMTCpyrCuUBjCYRgHVtqlAiB1YhiCnlsRkAAAOwAAAAAAAAAAAA=="/>\n            <a href="#/login" class="btn btn-link">Отмена</a>\n        </div>\n    </form>\n</div>\n';
    }, {}],
    33: [function (require, module, exports) {
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
    34: [function (require, module, exports) {
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
                            authorizedRoles: ['ADMIN']
                        }
                    });
            }
        ];

    }, {"./template.html": 37}],
    35: [function (require, module, exports) {
        'use strict';

        module.exports = [
            '$scope',
            'userService',
            '$rootScope',
            function ($scope, userService, $rootScope) {
                var vm = this;

                vm.user = null;
                vm.allUsers = [];
                vm.remove = remove;

                initController();

                function initController() {
                    loadAllUsers();
                }

                function remove(idUser) {
                    userService.Delete(idUser)
                        .then(function (response) {
                            if (response.success) {
                                loadAllUsers();
                            } else {
                                console.log("Что-то пошло не так")
                            }
                        });
                }

                function loadAllUsers() {
                    userService.getAll()
                        .then(function (users) {
                            vm.allUsers = users.data;
                        });
                }
            }
        ];

    }, {}],
    36: [function (require, module, exports) {
        (function (global) {
            'use strict';

            var angular = (typeof window !== "undefined" ? window.angular : typeof global !== "undefined" ? global.angular : null);

            angular
                .module('User', [])
                .config(require('./config'))
                .controller('UserController', require('./controller'))
                .service('userService', require('./user-service'));

        }).call(this, typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
    }, {"./config": 34, "./controller": 35, "./user-service": 38}],
    37: [function (require, module, exports) {
        module.exports = '<div class="container" style="margin-top:50px">\n    <h3>Все зарегистрированные на данный момент пользователи:</h3>\n    <ul>\n        <li ng-repeat="user in vm.allUsers">\n            {{user.username}} ({{user.name}})\n            <button type="button" ng-click="vm.remove(user.idUser)" class="btn btn-danger custom-width">Удалить</button>\n        </li>\n    </ul>\n</div>\n';
    }, {}],
    38: [function (require, module, exports) {
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
                    return $http.delete(REST_SERVICE_URI + 'rest/delete/user/' + id).then(handleSuccess, handleError('Error deleting user'));
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
