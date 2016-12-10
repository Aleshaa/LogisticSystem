(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
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

},{}],2:[function(require,module,exports){
(function (global){
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
require('./modules/addresses');
require('./modules/purchases');

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
            'Goods',
            'Addresses',
            'Purchases'
        ]);
    angular.bootstrap(document, ['App']);
});

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./common/auth":4,"./common/flash":6,"./common/message":7,"./common/request":10,"./modules/addresses":15,"./modules/goods":24,"./modules/home":38,"./modules/login":46,"./modules/purchases":59,"./modules/register":64,"./modules/user":70,"domready":1}],3:[function(require,module,exports){
(function (global){
'use strict';

var angular = (typeof window !== "undefined" ? window.angular : typeof global !== "undefined" ? global.angular : null);

module.exports = [
    '$http',
    'localStorageService',
    '$rootScope',
    'userService',
    function ($http, localStorageService, $rootScope, userService) {
        var service = {};

        var REST_SERVICE_URI = 'http://localhost:8080';

        var userRole = "";
        var authStatus = true;
        service.Login = Login;
        service.SetCredentials = SetCredentials;
        service.ClearCredentials = ClearCredentials;
        service.isAuth = isAuth;
        service.getAuthUser = getAuthUser;
        service.getCurrentUser = getCurrentUser;
        service.checkRole = checkRole;

        return service;

        function Login(username, password, callback) {
            authStatus = false;
            SetCredentials(username, password);
            $http.get(REST_SERVICE_URI + '/rest/authenticate', {})
                .success(function (response) {
                    userRole = response.role.nameRole;
                    $rootScope.globals = {};
                    localStorageService.remove('globals');
                    $http.defaults.headers.common.Authorization = 'Basic';
                    authStatus = true;
                    response = {success: true};
                    callback(response);
                })
                .error(function (response, status) {
                    response = {success: false, message: 'Имя пользователя или пароль неверны'};
                    $rootScope.globals = {};
                    localStorageService.remove('globals');
                    console.log("ОЧИСТИЛИ ГЛОБАЛС");
                    $http.defaults.headers.common.Authorization = 'Basic';
                    console.error('error', status, response);
                    callback(response);
                });

        }

        function getCurrentUser() {
            userService.getCurrentUser()
                .then(function (response) {
                    if (response.success) {
                        return response.data;
                    } else {
                        console.log("Что-то пошло не так");
                        return {};
                    }
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
            return authStatus ? localStorageService.get('globals') ? true : false : authStatus;
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
}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],4:[function(require,module,exports){
(function (global){
'use strict';

var angular = (typeof window !== "undefined" ? window.angular : typeof global !== "undefined" ? global.angular : null);

angular.module('Auth', [])
    .service('authService', require('./authentication.service'));

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./authentication.service":3}],5:[function(require,module,exports){
(function (global){
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
}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],6:[function(require,module,exports){
(function (global){
'use strict';

var angular = (typeof window !== "undefined" ? window.angular : typeof global !== "undefined" ? global.angular : null);

angular.module('Flash', [])
    .service('flashService', require('./flash.service'));

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./flash.service":5}],7:[function(require,module,exports){
(function (global){
'use strict';

var angular = (typeof window !== "undefined" ? window.angular : typeof global !== "undefined" ? global.angular : null);

angular.module('Message', [])
    .service('messageService', require('./message-service'));

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./message-service":8}],8:[function(require,module,exports){
(function (global){
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

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],9:[function(require,module,exports){
'use strict';

module.exports = ['$httpProvider', function ($httpProvider) {
    $httpProvider.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';
    $httpProvider.defaults.headers.common['Content-Type'] = 'application/json';
}];
},{}],10:[function(require,module,exports){
(function (global){
'use strict';

var angular = (typeof window !== "undefined" ? window.angular : typeof global !== "undefined" ? global.angular : null);

angular.module('Request', [])
    .provider('requestService', require('./provider'))
    .config(require('./config'));

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./config":9,"./provider":11}],11:[function(require,module,exports){
(function (global){
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

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],12:[function(require,module,exports){
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
        service.getAllStores = getAllStores;
        service.getAllAddresses = getAllAddresses;
        service.getStoresForCurrentGoods = getStoresForCurrentGoods;
        service.create = create;
        service.update = update;
        service.remove = remove;

        return service;

        function getAll() {
            return $http.get(REST_SERVICE_URI + 'rest/get/addresses').then(handleSuccess,
                handleError('Ошибка при получении всех адресов'));
        }

        function getAllStores() {
            return $http.get(REST_SERVICE_URI + 'rest/get/stores')
                .then(handleSuccess, handleError('Ошибка при получении всех складов'));
        }

        function getAllAddresses() {
            return $http.get(REST_SERVICE_URI + 'rest/get/addresses/user')
                .then(handleSuccess, handleError('Ошибка при получении всех складов'));
        }

        function getStoresForCurrentGoods(id) {
            return $http.get(REST_SERVICE_URI + 'rest/get/addresses/cur/goods/' + id).then(handleSuccess,
                handleError('Ошибка при получении всех адресов для опредленного товара'));
        }

        function create(newAddress, idUser) {
            return $http.post(REST_SERVICE_URI + 'address/' + idUser, newAddress).then(handleSuccess,
                handleError('Ошибка при добавлении нового адреса'));
        }

        function update(curAddress) {
            return $http.put(REST_SERVICE_URI + 'rest/update/address/' + curAddress.idAddress, curAddress)
                .then(handleSuccess, handleError('Ошибка обновления товара'));
        }

        function remove(id) {
            return $http.delete(REST_SERVICE_URI + 'rest/delete/address/' + id).then(handleSuccess,
                handleError('Ошибка удаления товара'));
        }

        function handleSuccess(res) {
            return {
                success: true,
                data: res.data,
                message: "Операция выполнена успешно!"
            };
        }

        function handleError(error) {
            return function () {
                return {success: false, message: error};
            };
        }

    }
];
},{}],13:[function(require,module,exports){
'use strict';

module.exports = [
    '$stateProvider',
    function ($stateProvider) {
        $stateProvider
            .state('addresses', {
                url: '/addresses',
                controller: 'AddressController',
                controllerAs: 'vm',
                template: require('./template.html'),
                data: {
                    authorizedRoles: ['ADMIN', 'USER']
                }
            });
    }
];

},{"./template.html":16}],14:[function(require,module,exports){
'use strict';

module.exports = [
    '$scope',
    'addressService',
    'userService',
    'flashService',
    function ($scope, addressService, userService, flashService) {
        var vm = this;

        vm.stores = [];
        vm.newStore = {};
        vm.creationForm = false;
        vm.editionForm = false;
        vm.dataLoading = true;
        vm.currentUser = {};
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
            loadAllStores();
            getCurrentUser();
            vm.dataLoading = false;
            vm.newStore = {};
        }

        function showCreationForm() {
            vm.newStore = {};
            vm.creationForm = true;
            vm.editionForm = false;
        }

        function showEditForm(store) {
            vm.newStore = store;
            vm.editionForm = true;
            vm.creationForm = false;
        }


        function remove(idStore) {
            vm.dataLoading = true;
            addressService.remove(idStore)
                .then(function (response) {
                    if (response.success) {
                        loadAllStores();
                        flashService.Success(response.message);
                        vm.dataLoading = false;
                    } else {
                        flashService.Error(response.message);
                        vm.dataLoading = false;
                        console.log("Что-то пошло не так")
                    }
                });
        }

        function create() {
            addressService.create(vm.newStore, vm.currentUser.idUser)
                .then(function (response) {
                    if (response.success) {
                        loadAllStores();
                        flashService.Success(response.message);
                        vm.dataLoading = false;
                        vm.creationForm = false;
                        vm.newStore = {};
                    } else {
                        flashService.Error(response.message);
                        vm.dataLoading = false;
                        console.log("Что-то пошло не так")
                    }
                });
        }

        function edit() {
            addressService.update(vm.newStore)
                .then(function (response) {
                    if (response.success) {
                        loadAllStores();
                        flashService.Success(response.message);
                        vm.dataLoading = false;
                        vm.editionForm = false;
                        vm.newStore = {};
                    } else {
                        flashService.Error(response.message);
                        vm.dataLoading = false;
                        console.log("Что-то пошло не так")
                    }
                });
        }

        function loadAllStores() {
            addressService.getAllAddresses()
                .then(function (stores) {
                    vm.stores = stores.data;
                });
        }

        function getCurrentUser() {
            userService.getCurrentUser()
                .then(function (user) {
                    vm.currentUser = user.data;
                });
        }
    }
];

},{}],15:[function(require,module,exports){
(function (global){
'use strict';

var angular = (typeof window !== "undefined" ? window.angular : typeof global !== "undefined" ? global.angular : null);

angular
    .module('Addresses', [])
    .config(require('./config'))
    .controller('AddressController', require('./controller'))
    .service('addressService', require('./addresses-service'));

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./addresses-service":12,"./config":13,"./controller":14}],16:[function(require,module,exports){
module.exports = '<div class="container" style="margin-top:70px">\n    <div class="row">\n        <div class="col-sm-12">\n            <div ng-class="{ \'alert\': flash, \'alert-success\': flash.type === \'success\', \'alert-danger\': flash.type === \'error\' }"\n                 ng-if="flash" ng-bind="flash.message"></div>\n            <div class="panel panel-default">\n                <!-- Default panel contents -->\n                <div class="panel-heading">Склады:</div>\n                <div class="custom-search">\n                    <label for="countrySearch">Поиск по стране:</label>\n                    <div class="input-group">\n                        <input type="text" placeholder="Поиск" class="form-control" id="countrySearch" ng-model="search.country">\n                        <div class="input-group-btn">\n                            <button class="btn btn-default">\n                                <i class="glyphicon glyphicon-search"></i>\n                            </button>\n                        </div>\n                    </div>\n                    <label for="citySearch">Поиск по городу:</label>\n                    <div class="input-group">\n                        <input type="text" placeholder="Поиск" class="form-control" id="citySearch" ng-model="search.city">\n                        <div class="input-group-btn">\n                            <button class="btn btn-default">\n                                <i class="glyphicon glyphicon-search"></i>\n                            </button>\n                        </div>\n                    </div>\n                    <label for="streetSearch">Поиск по улице: </label>\n                    <div class="input-group">\n                        <input type="text" placeholder="Поиск" class="form-control" id="streetSearch" ng-model="search.street">\n                        <div class="input-group-btn">\n                            <button class="btn btn-default">\n                                <i class="glyphicon glyphicon-search"></i>\n                            </button>\n                        </div>\n                    </div>\n                </div>\n                <br>\n                <!-- Table -->\n                <table class="table table-hover">\n                    <thead>\n                    <tr>\n                        <th>Страна</th>\n                        <th>Город</th>\n                        <th>Адрес</th>\n                        <th></th>\n                    </tr>\n                    </thead>\n                    <tbody>\n                    <tr ng-repeat="s in vm.stores | filter:search:strict">\n                        <td>{{s.country}}</td>\n                        <td>{{s.city}}</td>\n                        <td>{{s.street}}, {{s.number}}</td>\n                        <td>\n                            <button ng-click="vm.showEditForm(s)" ctype="button" class="btn btn-default btn-sm"\n                                    data-toggle="modal" data-target="#myModal">\n                                <span class="glyphicon glyphicon-edit"></span> Редактировать\n                            </button>\n                            <button ng-click="vm.remove(s.idAddress)" type="button" class="btn btn-default btn-sm">\n                                <span class="glyphicon glyphicon-remove"></span> Удалить\n                            </button>\n                        </td>\n                    </tr>\n                    </tbody>\n                </table>\n            </div>\n            <button ng-click="vm.showCreationForm()" ctype="button" class="btn btn-info btn-lg" data-toggle="modal"\n                    data-target="#myModal">\n                Добавить\n            </button>\n            <img ng-if="vm.dataLoading"\n                 src="data:image/gif;base64,R0lGODlhEAAQAPIAAP///wAAAMLCwkJCQgAAAGJiYoKCgpKSkiH/C05FVFNDQVBFMi4wAwEAAAAh/hpDcmVhdGVkIHdpdGggYWpheGxvYWQuaW5mbwAh+QQJCgAAACwAAAAAEAAQAAADMwi63P4wyklrE2MIOggZnAdOmGYJRbExwroUmcG2LmDEwnHQLVsYOd2mBzkYDAdKa+dIAAAh+QQJCgAAACwAAAAAEAAQAAADNAi63P5OjCEgG4QMu7DmikRxQlFUYDEZIGBMRVsaqHwctXXf7WEYB4Ag1xjihkMZsiUkKhIAIfkECQoAAAAsAAAAABAAEAAAAzYIujIjK8pByJDMlFYvBoVjHA70GU7xSUJhmKtwHPAKzLO9HMaoKwJZ7Rf8AYPDDzKpZBqfvwQAIfkECQoAAAAsAAAAABAAEAAAAzMIumIlK8oyhpHsnFZfhYumCYUhDAQxRIdhHBGqRoKw0R8DYlJd8z0fMDgsGo/IpHI5TAAAIfkECQoAAAAsAAAAABAAEAAAAzIIunInK0rnZBTwGPNMgQwmdsNgXGJUlIWEuR5oWUIpz8pAEAMe6TwfwyYsGo/IpFKSAAAh+QQJCgAAACwAAAAAEAAQAAADMwi6IMKQORfjdOe82p4wGccc4CEuQradylesojEMBgsUc2G7sDX3lQGBMLAJibufbSlKAAAh+QQJCgAAACwAAAAAEAAQAAADMgi63P7wCRHZnFVdmgHu2nFwlWCI3WGc3TSWhUFGxTAUkGCbtgENBMJAEJsxgMLWzpEAACH5BAkKAAAALAAAAAAQABAAAAMyCLrc/jDKSatlQtScKdceCAjDII7HcQ4EMTCpyrCuUBjCYRgHVtqlAiB1YhiCnlsRkAAAOwAAAAAAAAAAAA=="/>\n\n        </div>\n    </div>\n    <div class="modal fade" id="myModal" role="dialog">\n        <div class="modal-dialog">\n\n            <!-- Modal content-->\n            <div class="modal-content">\n                <div class="modal-header">\n                    <button type="button" class="close" data-dismiss="modal">&times;</button>\n                    <h4 class="modal-title">{{vm.creationForm ? "Добавление" : "Редактирование"}}</h4>\n                </div>\n                <form name="form" ng-submit="vm.formAction()" role="form"\n                      style="padding-left: 10px; padding-right: 10px">\n                    <div class="form-group"\n                         ng-class="{ \'has-error\': form.country.$dirty && form.country.$error.required }">\n                        <label for="country">Страна</label>\n                        <input type="text" name="country" id="country" class="form-control"\n                               ng-model="vm.newStore.country"\n                               required/>\n                        <span ng-show="form.country.$dirty && form.country.$error.required" class="help-block">Страна - обязательное поле</span>\n                    </div>\n                    <div class="form-group" ng-class="{ \'has-error\': form.city.$dirty && form.city.$error.required }">\n                        <label for="country">Город</label>\n                        <input type="text" name="city" id="city" class="form-control" ng-model="vm.newStore.city"\n                               required/>\n                        <span ng-show="form.city.$dirty && form.city.$error.required"\n                              class="help-block">Город - обязательное поле</span>\n                    </div>\n                    <div class="form-group"\n                         ng-class="{ \'has-error\': form.street.$dirty && form.street.$error.required }">\n                        <label for="country">Улица</label>\n                        <input type="text" name="street" id="street" class="form-control"\n                               ng-model="vm.newStore.street" required/>\n                        <span ng-show="form.street.$dirty && form.street.$error.required" class="help-block">Улицы - обязательное поле</span>\n                    </div>\n                    <div class="form-group"\n                         ng-class="{ \'has-error\': form.number.$dirty && form.number.$error.required }">\n                        <label for="country">Номер</label>\n                        <input type="number" name="number" id="number" class="form-control"\n                               ng-model="vm.newStore.number"\n                               required/>\n                        <span ng-show="form.number.$dirty && form.number.$error.required"\n                              class="help-block">Номер - обязательное поле</span>\n                    </div>\n                    <div class="modal-footer">\n                        <button ng-click="vm.formAction()" type="submit" class="btn btn-default" data-dismiss="modal">\n                            Принять\n                        </button>\n                    </div>\n                </form>\n\n            </div>\n\n        </div>\n    </div>\n</div>\n';
},{}],17:[function(require,module,exports){
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

},{"./template.html":35}],18:[function(require,module,exports){
'use strict';

module.exports = [
    '$scope',
    'goodsService',
    'addressService',
    'authService',
    'supplierService',
    'supplyService',
    'flashService',
    function ($scope, goodsService, addressService, authService, supplierService, supplyService, flashService) {
        var vm = this;

        vm.goods = [];
        vm.suppliers = [];
        vm.addresses = [];
        vm.newGoods = {};
        vm.currentGoods = {};
        vm.newSupply = {};
        vm.creationForm = false;
        vm.editionForm = false;
        vm.orderForm = false;
        vm.dataLoading = true;
        vm.showEditForm = showEditForm;
        vm.showCreationForm = showCreationForm;
        vm.remove = remove;
        vm.formAction = formAction;
        vm.isAdmin = isAdmin;
        vm.showOrderForm = showOrderForm;

        initController();

        function formAction() {
            vm.dataLoading = true;
            if (vm.editionForm) {
                edit();
            }
            else if (vm.creationForm) {
                create();
            }
            else if (vm.orderForm) {
                createSupply();
            }
        }

        function initController() {
            loadAllGoods();
            loadAllSuppliers();
            loadAllAddresses();
            vm.dataLoading = false;
            vm.newGoods = {};
        }

        function isAdmin() {
            return authService.checkRole(['ADMIN']);
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

        function showOrderForm(goods) {
            vm.currentGoods = goods;
            vm.orderForm = true;
        }


        function remove(idGoods) {
            vm.dataLoading = true;
            goodsService.Delete(idGoods)
                .then(function (response) {
                    if (response.success) {
                        loadAllGoods();
                        vm.dataLoading = false;
                    } else {
                        flashService.Error(response.message);
                        vm.dataLoading = false;
                        console.log("Что-то пошло не так")
                    }
                });
        }

        function create() {
            vm.newGoods.quantity = 0;
            goodsService.create(vm.newGoods)
                .then(function (response) {
                    if (response.success) {
                        loadAllGoods();
                        flashService.Success(response.message);
                        vm.creationForm = false;
                        vm.newGoods = {};
                        vm.dataLoading = false;
                    } else {
                        flashService.Error(response.message);
                        vm.dataLoading = false;
                        console.log("Что-то пошло не так")
                    }
                });
        }

        function edit() {
            vm.newGoods.quantity = 0;
            goodsService.update(vm.newGoods)
                .then(function (response) {
                    if (response.success) {
                        loadAllGoods();
                        vm.editionForm = false;
                        vm.newGoods = {};
                        vm.dataLoading = false;
                    } else {
                        flashService.Error(response.message);
                        vm.dataLoading = false;
                        console.log("Что-то пошло не так")
                    }
                });
        }

        function loadAllGoods() {
            goodsService.getAll()
                .then(function (goods) {
                    vm.goods = goods.data;
                    for (var i = 0; i < vm.goods.length; i++) {
                        loadAddresses(i);
                    }
                });
        }

        function loadAddresses(i) {
            addressService.getStoresForCurrentGoods(vm.goods[i].idGoods)
                .then(function (addresses) {
                    vm.goods[i].addresses = [];
                    vm.goods[i].addresses = addresses.data;
                });
        }

        function loadAllSuppliers() {
            supplierService.getAll()
                .then(function (suppliers) {
                    vm.suppliers = suppliers.data;
                });
        }

        function createSupply() {
            var idGoods = vm.currentGoods.idGoods;
            var idSupplier = vm.newSupply.supplier;
            var idAddress = vm.newSupply.address;
            delete vm.newSupply.supplier;
            delete vm.newSupply.address;
            var date = new Date();
            vm.newSupply.date = date.getFullYear() + "-" +
                ((date.getMonth() + 1) < 10 ? ("0" + (date.getMonth() + 1)) : (date.getMonth() + 1)) + "-" +
                (date.getDate() < 10 ? ("0" + date.getDate()) : date.getDate());
            supplyService.create(vm.newSupply, idSupplier, idGoods, idAddress)
                .then(function (response) {
                    if (response.success) {
                        loadAllGoods();
                        vm.creationForm = false;
                        vm.orderForm = false;
                        vm.currentGoods = {};
                        vm.newSupply = {};
                        vm.dataLoading = false;
                    } else {
                        console.log(response.message)
                    }
                });
        }

        function loadAllAddresses() {
            addressService.getAllStores()
                .then(function (addresses) {
                    vm.addresses = addresses.data;
                })
        }
    }
];

},{}],19:[function(require,module,exports){
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
        service.putGoodsToStore = putGoodsToStore;
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

        function putGoodsToStore(idGoods, idStore) {
            return $http.post(REST_SERVICE_URI + 'rest/add/goods/' + idGoods + '/address/' + idStore)
                .then(handleSuccess, handleError('Ошибка при добавлении поставке товара на склад'));
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
                data: res.data,
                message: "Операция выполнена успешно!"
            };
        }

        function handleError(error) {
            return function () {
                return {
                    success: false,
                    message: error
                };
            };
        }

    }
];
},{}],20:[function(require,module,exports){
'use strict';

module.exports = [
    '$stateProvider',
    function ($stateProvider) {
        $stateProvider
            .state('goods-stat', {
                url: '/goods-stat',
                controller: 'StatsController',
                controllerAs: 'vm',
                template: require('./template.html'),
                data: {
                    authorizedRoles: ['USER', 'ADMIN']
                }
            });
    }
];

},{"./template.html":23}],21:[function(require,module,exports){
'use strict';

module.exports = [
    'statService',
    'authService',
    function (statService, authService) {
        var vm = this;

        vm.data = [];
        vm.userData = [];
        vm.dataLoading = false;
        vm.isAdmin = isAdmin;
        initController();

        function initController() {
            vm.dataLoading = true;
            loadData();
        }

        vm.goodsProfitChart = {};
        vm.goodsProfitChart.type = "PieChart";

        vm.goodsCountChart = {};
        vm.goodsCountChart.type = "BarChart";

        vm.goodsProfit = [];
        vm.goodsCount = [];

        function loadData() {
            if (isAdmin()) {
                statService.getGoodsStat()
                    .then(function (stats) {
                        vm.data = stats.data;
                        loadCharts();
                        vm.dataLoading = false;
                    });
            }
            else {
                statService.getGoodsStatForCurrentUser()
                    .then(function (stats) {
                        vm.data = stats.data;
                        loadCharts();
                        vm.dataLoading = false;
                    });
            }
        }

        function loadCharts() {
            for (var i = 0; i < vm.data.length; i++) {
                var goodsDataProfit = {};
                var goodsDataCount = {};
                goodsDataCount.c = [
                    {v: vm.data[i].goods.name},
                    {v: Number(vm.data[i].countOfPurchases)}
                ];
                goodsDataProfit.c = [
                    {v: vm.data[i].goods.name},
                    {v: Number(vm.data[i].broughtProfit)}
                ];
                vm.goodsProfit.push(goodsDataProfit);
                vm.goodsCount.push(goodsDataCount);
            }

            vm.goodsProfitChart.data = {
                "cols": [
                    {id: "t", label: "Topping", type: "string"},
                    {id: "s", label: "$", type: "number"}
                ],
                "rows": vm.goodsProfit
            };

            vm.goodsProfitChart.options = {
                'title': 'Круговая диаграмма распределения прибыли по товарам'
            };

            vm.goodsCountChart.data = {
                "cols": [
                    {id: "t", label: "Topping", type: "string"},
                    {id: "s", label: "количество", type: "number"}
                ],
                "rows": vm.goodsCount
            };

            vm.goodsCountChart.options = {
                'title': 'Столбчатая диаграмма популярности товаров'
            };
        }

        function isAdmin() {
            return authService.checkRole(['ADMIN']);
        }
    }
];

},{}],22:[function(require,module,exports){
(function (global){
'use strict';

var angular = (typeof window !== "undefined" ? window.angular : typeof global !== "undefined" ? global.angular : null);

angular
    .module('Goods.Statistics', ['googlechart'])
    .config(require('./config'))
    .controller('StatsController', require('./controller'));
}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./config":20,"./controller":21}],23:[function(require,module,exports){
module.exports = '<div class="container"style="margin-top:70px">\n    <div id="wrapper" class="toggled">\n        <div id="page-content-wrapper">\n            <ul class="breadcrumb">\n                <li><a href="#/goods">Товары</a></li>\n                <li class="active">Статистика</li>\n            </ul>\n            <div class="container-fluid" align="center">\n                <div ng-if="!vm.dataLoading" class="row">\n                    <div class="col-lg-5">\n                        <div google-chart chart="vm.goodsProfitChart" style="height:600px; width:100%;"></div>\n                    </div>\n                    <div class="col-lg-7">\n                        <div google-chart chart="vm.goodsCountChart" style="height:600px; width:100%;"></div>\n                    </div>\n                </div>\n                <div ng-if="vm.dataLoading" class="row vertical-center-row">\n                    <div class="text-center col-md-4 col-md-offset-4">\n                        <i class="fa fa-spinner fa-pulse fa-5x fa-fw"></i>\n                        <span class="sr-only">Loading...</span>\n                    </div>\n                </div>\n            </div>\n        </div>\n    </div>\n</div>\n\n\n';
},{}],24:[function(require,module,exports){
(function (global){
'use strict';

var angular = (typeof window !== "undefined" ? window.angular : typeof global !== "undefined" ? global.angular : null);
require('./supplier');
require('./supply');
require('./goods-stat');

angular
    .module('Goods',
        [
            'Goods.Supplier',
            'Goods.Supply',
            'Goods.Statistics'
        ])
    .config(require('./config'))
    .controller('GoodsController', require('./controller'))
    .service('goodsService', require('./goods-service'));

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./config":17,"./controller":18,"./goods-service":19,"./goods-stat":22,"./supplier":27,"./supply":32}],25:[function(require,module,exports){
'use strict';

module.exports = [
    '$stateProvider',
    function ($stateProvider) {
        $stateProvider
            .state('suppliers', {
                url: '/suppliers',
                controller: 'SupplierController',
                controllerAs: 'vm',
                template: require('./template.html'),
                data: {
                    authorizedRoles: ['ADMIN']
                }
            });
    }
];

},{"./template.html":29}],26:[function(require,module,exports){
'use strict';

module.exports = [
    '$scope',
    'supplierService',
    'flashService',
    function ($scope, supplierService, flashService) {
        var vm = this;

        vm.suppliers = [];
        vm.newSupplier = {};
        vm.creationForm = false;
        vm.editionForm = false;
        vm.dataLoading = true;
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
            loadAllSuppliers();
            vm.dataLoading = false;
            vm.newSupplier = {};
        }

        function showCreationForm() {
            vm.newSupplier = {};
            vm.creationForm = true;
            vm.editionForm = false;
        }

        function showEditForm(supplier) {
            vm.newSupplier = supplier;
            vm.editionForm = true;
            vm.creationForm = false;
        }


        function remove(idSupplier) {
            vm.dataLoading = true;
            supplierService.remove(idSupplier)
                .then(function (response) {
                    if (response.success) {
                        loadAllSuppliers();
                        flashService.Success(response.message);
                        vm.dataLoading = false;
                    } else {
                        flashService.Error(response.message);
                        vm.dataLoading = false;
                        console.log("Что-то пошло не так")
                    }
                });
        }

        function create() {
            supplierService.create(vm.newSupplier)
                .then(function (response) {
                    if (response.success) {
                        loadAllSuppliers();
                        vm.creationForm = false;
                        vm.newSupplier = {};
                        flashService.Success(response.message);
                        vm.dataLoading = false;
                    } else {
                        flashService.Error(response.message);
                        vm.dataLoading = false;
                        console.log("Что-то пошло не так")
                    }
                });
        }

        function edit() {
            supplierService.update(vm.newSupplier)
                .then(function (response) {
                    if (response.success) {
                        loadAllSuppliers();
                        vm.editionForm = false;
                        vm.newSupplier = {};
                        flashService.Success(response.message);
                        vm.dataLoading = false;
                    } else {
                        flashService.Error(response.message);
                        vm.dataLoading = false;
                        console.log("Что-то пошло не так")
                    }
                });
        }

        function loadAllSuppliers() {
            supplierService.getAll()
                .then(function (suppliers) {
                    vm.suppliers = suppliers.data;
                });
        }
    }
];

},{}],27:[function(require,module,exports){
(function (global){
'use strict';

var angular = (typeof window !== "undefined" ? window.angular : typeof global !== "undefined" ? global.angular : null);

angular
    .module('Goods.Supplier', [])
    .config(require('./config'))
    .controller('SupplierController', require('./controller'))
    .service('supplierService', require('./supplier-service'));

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./config":25,"./controller":26,"./supplier-service":28}],28:[function(require,module,exports){
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
        service.remove = remove;

        return service;

        function getAll() {
            return $http.get(REST_SERVICE_URI + 'rest/get/suppliers').then(handleSuccess,
                handleError('Ошибка при получении всех поставщиков'));
        }

        function create(newSupplier) {
            return $http.post(REST_SERVICE_URI + 'rest/create/supplier', newSupplier).then(handleSuccess,
                handleError('Ошибка при добавлении нового поставщика'));
        }

        function update(curSupplier) {
            return $http.put(REST_SERVICE_URI + 'rest/update/supplier/' + curSupplier.idSupplier, curSupplier)
                .then(handleSuccess, handleError('Ошибка обновления поставщика'));
        }

        function remove(id) {
            return $http.delete(REST_SERVICE_URI + 'rest/delete/supplier/' + id).then(handleSuccess,
                handleError('Ошибка удаления поставщика'));
        }

        function handleSuccess(res) {
            return {
                success: true,
                data: res.data,
                message: "Операция выполнена успешно!"
            };
        }

        function handleError(error) {
            return function () {
                return {success: false, message: error};
            };
        }

    }
];
},{}],29:[function(require,module,exports){
module.exports = '<div class="container" style="margin-top:70px">\n    <div class="row">\n        <div class="col-sm-12">\n            <div ng-class="{ \'alert\': flash, \'alert-success\': flash.type === \'success\', \'alert-danger\': flash.type === \'error\' }"\n                 ng-if="flash" ng-bind="flash.message"></div>\n            <ul class="breadcrumb">\n                <li><a href="#/goods">Товары</a></li>\n                <li class="active">Поставщики</li>\n            </ul>\n            <div class="panel panel-default">\n                <!-- Default panel contents -->\n                <div class="panel-heading">Поставщики:</div>\n                <div class="custom-search">\n                    <label for="nameSearch">Поиск по имени:</label>\n                    <div class="input-group">\n                        <input type="text" placeholder="Поиск" class="form-control" id="nameSearch" ng-model="search.name">\n                        <div class="input-group-btn">\n                            <button class="btn btn-default">\n                                <i class="glyphicon glyphicon-search"></i>\n                            </button>\n                        </div>\n                    </div>\n                    <label for="emailSearch">Поиск по email:</label>\n                    <div class="input-group">\n                        <input type="text" placeholder="Поиск" class="form-control" id="emailSearch" ng-model="search.email">\n                        <div class="input-group-btn">\n                            <button class="btn btn-default">\n                                <i class="glyphicon glyphicon-search"></i>\n                            </button>\n                        </div>\n                    </div>\n                    <label for="phoneSearch">Поиск по номеру телефона: </label>\n                    <div class="input-group">\n                        <input type="text" placeholder="Поиск" class="form-control" id="phoneSearch" ng-model="search.phone">\n                        <div class="input-group-btn">\n                            <button class="btn btn-default">\n                                <i class="glyphicon glyphicon-search"></i>\n                            </button>\n                        </div>\n                    </div>\n                </div>\n                <br>\n                <!-- Table -->\n                <table class="table table-hover">\n                    <thead>\n                    <tr>\n                        <th>Имя</th>\n                        <th>Email</th>\n                        <th>Телефон</th>\n                        <th>О поставщике</th>\n                        <th></th>\n                    </tr>\n                    </thead>\n                    <tbody>\n                    <tr ng-repeat="s in vm.suppliers | filter:search:strict">\n                        <td>{{s.name}}</td>\n                        <td>{{s.email}}</td>\n                        <td>{{s.phone}}</td>\n                        <td>{{s.about}}</td>\n                        <td>\n                            <button ng-click="vm.showEditForm(s)" ctype="button" class="btn btn-default btn-sm"\n                                    data-toggle="modal" data-target="#myModal">\n                                <span class="glyphicon glyphicon-edit"></span> Редактировать\n                            </button>\n                            <button ng-click="vm.remove(s.idSupplier)" type="button" class="btn btn-default btn-sm">\n                                <span class="glyphicon glyphicon-remove"></span> Удалить\n                            </button>\n                        </td>\n                    </tr>\n                    </tbody>\n                </table>\n            </div>\n            <button ng-click="vm.showCreationForm()" ctype="button" class="btn btn-info btn-lg" data-toggle="modal"\n                    data-target="#myModal">\n                Добавить\n            </button>\n            <img ng-if="vm.dataLoading"\n                 src="data:image/gif;base64,R0lGODlhEAAQAPIAAP///wAAAMLCwkJCQgAAAGJiYoKCgpKSkiH/C05FVFNDQVBFMi4wAwEAAAAh/hpDcmVhdGVkIHdpdGggYWpheGxvYWQuaW5mbwAh+QQJCgAAACwAAAAAEAAQAAADMwi63P4wyklrE2MIOggZnAdOmGYJRbExwroUmcG2LmDEwnHQLVsYOd2mBzkYDAdKa+dIAAAh+QQJCgAAACwAAAAAEAAQAAADNAi63P5OjCEgG4QMu7DmikRxQlFUYDEZIGBMRVsaqHwctXXf7WEYB4Ag1xjihkMZsiUkKhIAIfkECQoAAAAsAAAAABAAEAAAAzYIujIjK8pByJDMlFYvBoVjHA70GU7xSUJhmKtwHPAKzLO9HMaoKwJZ7Rf8AYPDDzKpZBqfvwQAIfkECQoAAAAsAAAAABAAEAAAAzMIumIlK8oyhpHsnFZfhYumCYUhDAQxRIdhHBGqRoKw0R8DYlJd8z0fMDgsGo/IpHI5TAAAIfkECQoAAAAsAAAAABAAEAAAAzIIunInK0rnZBTwGPNMgQwmdsNgXGJUlIWEuR5oWUIpz8pAEAMe6TwfwyYsGo/IpFKSAAAh+QQJCgAAACwAAAAAEAAQAAADMwi6IMKQORfjdOe82p4wGccc4CEuQradylesojEMBgsUc2G7sDX3lQGBMLAJibufbSlKAAAh+QQJCgAAACwAAAAAEAAQAAADMgi63P7wCRHZnFVdmgHu2nFwlWCI3WGc3TSWhUFGxTAUkGCbtgENBMJAEJsxgMLWzpEAACH5BAkKAAAALAAAAAAQABAAAAMyCLrc/jDKSatlQtScKdceCAjDII7HcQ4EMTCpyrCuUBjCYRgHVtqlAiB1YhiCnlsRkAAAOwAAAAAAAAAAAA=="/>\n\n        </div>\n    </div>\n    <div class="modal fade" id="myModal" role="dialog">\n        <div class="modal-dialog">\n\n            <!-- Modal content-->\n            <div class="modal-content">\n                <div class="modal-header">\n                    <button type="button" class="close" data-dismiss="modal">&times;</button>\n                    <h4 class="modal-title">{{vm.creationForm ? "Добавление" : "Редактирование"}}</h4>\n                </div>\n                <form name="form" ng-submit="vm.formAction()" role="form"\n                      style="padding-left: 10px; padding-right: 10px">\n                    <div class="form-group" ng-class="{ \'has-error\': form.name.$dirty && form.name.$error.required }">\n                        <label for="name">Название</label>\n                        <input type="text" name="name" id="name" class="form-control" ng-model="vm.newSupplier.name"\n                               required/>\n                        <span ng-show="form.name.$dirty && form.name.$error.required" class="help-block">Название - обязательное поле</span>\n                    </div>\n                    <div class="form-group" ng-class="{ \'has-error\': form.email.$dirty && form.email.$error.required }">\n                        <label for="email">Email</label>\n                        <input type="text" name="email" id="email" class="form-control" ng-model="vm.newSupplier.email"\n                               required/>\n                        <span ng-show="form.email.$dirty && form.email.$error.required"\n                              class="help-block">Email - обязательное поле</span>\n                    </div>\n                    <div class="form-group"\n                         ng-class="{ \'has-error\': form.phone.$dirty && form.phone.$error.required }">\n                        <label for="phone">Телефона</label>\n                        <input type="text" name="phone" id="phone" class="form-control"\n                               ng-model="vm.newSupplier.phone" required/>\n                        <span ng-show="form.phone.$dirty && form.phone.$error.required" class="help-block">Телефон - обязательное поле</span>\n                    </div>\n                    <div class="form-group" ng-class="{ \'has-error\': form.about.$dirty && form.about.$error.required }">\n                        <label for="about">О поставщике</label>\n                        <input type="text" name="about" id="about" class="form-control" ng-model="vm.newSupplier.about"\n                               required/>\n                        <span ng-show="form.about.$dirty && form.about.$error.required"\n                              class="help-block">О поставщике - обязательное поле</span>\n                    </div>\n                    <div class="modal-footer">\n                        <button ng-click="vm.formAction()" type="submit" class="btn btn-default" data-dismiss="modal">\n                            Принять\n                        </button>\n                    </div>\n                </form>\n\n            </div>\n\n        </div>\n    </div>\n</div>\n';
},{}],30:[function(require,module,exports){
'use strict';

module.exports = [
    '$stateProvider',
    function ($stateProvider) {
        $stateProvider
            .state('supplies', {
                url: '/supplies',
                controller: 'SupplyController',
                controllerAs: 'vm',
                template: require('./template.html'),
                data: {
                    authorizedRoles: ['ADMIN']
                }
            });
    }
];

},{"./template.html":34}],31:[function(require,module,exports){
'use strict';

module.exports = [
    '$scope',
    'supplyService',
    'goodsService',
    'supplierService',
    'addressService',
    'flashService',
    function ($scope, supplyService, goodsService, supplierService, addressService, flashService) {
        var vm = this;

        vm.supplies = [];
        vm.newSupply = {};
        vm.goods = [];
        vm.suppliers = [];
        vm.addresses = [];
        vm.creationForm = false;
        vm.editionForm = false;
        vm.dataLoading = true;
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
            loadAllSupplies();
            loadAllGoods();
            loadAllSuppliers();
            loadAllAddresses();
            vm.dataLoading = false;
            vm.newSupply = {};
        }

        function showCreationForm() {
            vm.newSupply = {};
            vm.creationForm = true;
            vm.editionForm = false;
        }

        function showEditForm(supply) {
            vm.newSupply = supply;
            vm.editionForm = true;
            vm.creationForm = false;
        }


        function remove(idSupply) {
            vm.dataLoading = true;
            supplyService.remove(idSupply)
                .then(function (response) {
                    if (response.success) {
                        loadAllSupplies();
                        vm.dataLoading = false;
                    } else {
                        flashService.Error(response.message);
                        vm.dataLoading = false;
                        console.log(response.message)
                    }
                });
        }

        function create() {
            var idGoods = vm.newSupply.goods;
            var idSupplier = vm.newSupply.supplier;
            var idAddress = vm.newSupply.address;
            delete vm.newSupply.goods;
            delete vm.newSupply.supplier;
            delete vm.newSupply.address;
            var date = new Date();
            vm.newSupply.date = date.getFullYear() + "-" +
                ((date.getMonth() + 1) < 10 ? ("0" + (date.getMonth() + 1)) : (date.getMonth() + 1)) + "-" +
                (date.getDate() < 10 ? ("0" + date.getDate()) : date.getDate());
            supplyService.create(vm.newSupply, idSupplier, idGoods, idAddress)
                .then(function (response) {
                    if (response.success) {
                        loadAllSupplies();
                        vm.creationForm = false;
                        vm.newSupply = {};
                        vm.dataLoading = false;
                    } else {
                        flashService.Error(response.message);
                        vm.dataLoading = false;
                        console.log(response.message)
                    }
                });
        }

        function edit() {
            supplyService.update(vm.newSupply)
                .then(function (response) {
                    if (response.success) {
                        loadAllSupplies();
                        vm.editionForm = false;
                        vm.newSupply = {};
                        vm.dataLoading = false;
                    } else {
                        flashService.Error(response.message);
                        vm.dataLoading = false;
                        console.log(response.message)
                    }
                });
        }

        function loadAllSupplies() {
            supplyService.getAll()
                .then(function (supplies) {
                    vm.supplies = supplies.data;
                });
        }

        function loadAllGoods() {
            goodsService.getAll()
                .then(function (goods) {
                    vm.goods = goods.data;
                });
        }

        function loadAllSuppliers() {
            supplierService.getAll()
                .then(function (suppliers) {
                    vm.suppliers = suppliers.data;
                });
        }

        function loadAllAddresses() {
            addressService.getAllStores()
                .then(function (addresses) {
                    vm.addresses = addresses.data;
                })
        }
    }
];

},{}],32:[function(require,module,exports){
(function (global){
'use strict';

var angular = (typeof window !== "undefined" ? window.angular : typeof global !== "undefined" ? global.angular : null);

angular
    .module('Goods.Supply', [])
    .config(require('./config'))
    .controller('SupplyController', require('./controller'))
    .service('supplyService', require('./supply-service'));

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./config":30,"./controller":31,"./supply-service":33}],33:[function(require,module,exports){
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
        service.remove = remove;

        return service;

        function getAll() {
            return $http.get(REST_SERVICE_URI + 'rest/get/supplies').then(handleSuccess,
                handleError('Ошибка при получении всех поставок'));
        }

        function create(newSupply, idSupplier, idGoods, idAddress) {
            return $http.post(REST_SERVICE_URI + 'rest/create/supply/' + idSupplier + '/' + idGoods + '/' + idAddress,
                newSupply).then(handleSuccess, handleError('Ошибка при добавлении новой поставки'));
        }

        function update(curSupply) {
            return $http.put(REST_SERVICE_URI + 'rest/update/supply/' + curSupply.idSupply, curSupply)
                .then(handleSuccess, handleError('Ошибка обновлении поставки'));
        }

        function remove(id) {
            return $http.delete(REST_SERVICE_URI + 'rest/delete/supply/' + id).then(handleSuccess,
                handleError('Ошибка удаления поставки'));
        }

        function handleSuccess(res) {
            return {
                success: true,
                data: res.data,
                message: "Операция выполнена успешно!"
            };
        }

        function handleError(error) {
            return function () {
                return {
                    success: false,
                    message: error
                };
            };
        }

    }
];
},{}],34:[function(require,module,exports){
module.exports = '<div class="container" style="margin-top:70px">\n    <div class="row">\n        <div class="col-sm-2">\n            <ul id="sidebar" class="nav nav-stacked affix">\n                <li><a href="#">\n                    <i class="fa fa-line-chart" aria-hidden="true"></i>\n                    Статистики</a></li>\n            </ul>\n        </div>\n        <div class="col-sm-10">\n            <div ng-class="{ \'alert\': flash, \'alert-success\': flash.type === \'success\', \'alert-danger\': flash.type === \'error\' }"\n                 ng-if="flash" ng-bind="flash.message"></div>\n            <ul class="breadcrumb">\n                <li><a href="#/goods">Товары</a></li>\n                <li class="active">Поставки</li>\n            </ul>\n            <div class="panel panel-default">\n                <!-- Default panel contents -->\n                <div class="panel-heading">Поставки:</div>\n                <div class="custom-search">\n                    <label for="nameSearch">Поиск по названию:</label>\n                    <div class="input-group">\n                        <input type="text" placeholder="Поиск" class="form-control" id="nameSearch" ng-model="search.goods.name">\n                        <div class="input-group-btn">\n                            <button class="btn btn-default">\n                                <i class="glyphicon glyphicon-search"></i>\n                            </button>\n                        </div>\n                    </div>\n                    <label for="supSearch">Поиск по поставщику:</label>\n                    <div class="input-group">\n                        <input type="text" placeholder="Поиск" class="form-control" id="supSearch" ng-model="search.supplier.name">\n                        <div class="input-group-btn">\n                            <button class="btn btn-default">\n                                <i class="glyphicon glyphicon-search"></i>\n                            </button>\n                        </div>\n                    </div>\n                    <label for="quantitySearch">Поиск по количеству: </label>\n                    <div class="input-group">\n                        <input type="text" placeholder="Поиск" class="form-control" id="quantitySearch" ng-model="search.quantity">\n                        <div class="input-group-btn">\n                            <button class="btn btn-default">\n                                <i class="glyphicon glyphicon-search"></i>\n                            </button>\n                        </div>\n                    </div>\n                </div>\n                <br>\n                <!-- Table -->\n                <table class="table table-hover">\n                    <thead>\n                    <tr>\n                        <th>Название товара</th>\n                        <th>Поставщик</th>\n                        <th>Количество</th>\n                        <th>Дата</th>\n                    </tr>\n                    </thead>\n                    <tbody>\n                    <tr ng-repeat="s in vm.supplies | filter:search:strict">\n                        <td>{{s.goods.name}}</td>\n                        <td>{{s.supplier.name}}</td>\n                        <td>{{s.quantity}}</td>\n                        <td>{{s.date}}</td>\n                    </tr>\n                    </tbody>\n                </table>\n            </div>\n            <button ng-click="vm.showCreationForm()" ctype="button" class="btn btn-info btn-lg" data-toggle="modal"\n                    data-target="#myModal">\n                Добавить\n            </button>\n            <img ng-if="vm.dataLoading"\n                 src="data:image/gif;base64,R0lGODlhEAAQAPIAAP///wAAAMLCwkJCQgAAAGJiYoKCgpKSkiH/C05FVFNDQVBFMi4wAwEAAAAh/hpDcmVhdGVkIHdpdGggYWpheGxvYWQuaW5mbwAh+QQJCgAAACwAAAAAEAAQAAADMwi63P4wyklrE2MIOggZnAdOmGYJRbExwroUmcG2LmDEwnHQLVsYOd2mBzkYDAdKa+dIAAAh+QQJCgAAACwAAAAAEAAQAAADNAi63P5OjCEgG4QMu7DmikRxQlFUYDEZIGBMRVsaqHwctXXf7WEYB4Ag1xjihkMZsiUkKhIAIfkECQoAAAAsAAAAABAAEAAAAzYIujIjK8pByJDMlFYvBoVjHA70GU7xSUJhmKtwHPAKzLO9HMaoKwJZ7Rf8AYPDDzKpZBqfvwQAIfkECQoAAAAsAAAAABAAEAAAAzMIumIlK8oyhpHsnFZfhYumCYUhDAQxRIdhHBGqRoKw0R8DYlJd8z0fMDgsGo/IpHI5TAAAIfkECQoAAAAsAAAAABAAEAAAAzIIunInK0rnZBTwGPNMgQwmdsNgXGJUlIWEuR5oWUIpz8pAEAMe6TwfwyYsGo/IpFKSAAAh+QQJCgAAACwAAAAAEAAQAAADMwi6IMKQORfjdOe82p4wGccc4CEuQradylesojEMBgsUc2G7sDX3lQGBMLAJibufbSlKAAAh+QQJCgAAACwAAAAAEAAQAAADMgi63P7wCRHZnFVdmgHu2nFwlWCI3WGc3TSWhUFGxTAUkGCbtgENBMJAEJsxgMLWzpEAACH5BAkKAAAALAAAAAAQABAAAAMyCLrc/jDKSatlQtScKdceCAjDII7HcQ4EMTCpyrCuUBjCYRgHVtqlAiB1YhiCnlsRkAAAOwAAAAAAAAAAAA=="/>\n\n        </div>\n    </div>\n    <div class="modal fade" id="myModal" role="dialog">\n        <div class="modal-dialog">\n\n            <!-- Modal content-->\n            <div class="modal-content">\n                <div class="modal-header">\n                    <button type="button" class="close" data-dismiss="modal">&times;</button>\n                    <h4 class="modal-title">{{vm.creationForm ? "Добавление" : "Редактирование"}}</h4>\n                </div>\n                <form name="form" ng-submit="vm.formAction()" role="form"\n                      style="padding-left: 10px; padding-right: 10px">\n                    <div class="form-group" ng-class="{ \'has-error\': form.goods.$dirty && form.goods.$error.required }">\n                        <label for="goods">Товар</label>\n                        <select class="form-control" id="goods" name="goods" ng-model="vm.newSupply.goods" required>\n                            <option ng-repeat="g in vm.goods" value="{{g.idGoods}}">{{g.name}}</option>\n                        </select>\n                        <span ng-show="form.goods.$dirty && form.goods.$error.required" class="help-block">Товар - обязательное поле</span>\n                    </div>\n                    <div class="form-group"\n                         ng-class="{ \'has-error\': form.supplier.$dirty && form.supplier.$error.required }">\n                        <label for="supplier">Поставщик</label>\n                        <select class="form-control" id="supplier" name="supplier" ng-model="vm.newSupply.supplier"\n                                required>\n                            <option ng-repeat="s in vm.suppliers" value="{{s.idSupplier}}">{{s.name}}</option>\n                        </select>\n                        <span ng-show="form.supplier.$dirty && form.supplier.$error.required"\n                              class="help-block">Поставщик - обязательное поле</span>\n                    </div>\n                    <div class="form-group"\n                         ng-class="{ \'has-error\': form.supplier.$dirty && form.supplier.$error.required }">\n                        <label for="supplier">Склад</label>\n                        <br/>\n                        <label ng-repeat="a in vm.addresses" class="radio-inline">\n                            <input value="{{a.idAddress}}" type="radio" ng-model="vm.newSupply.address">\n                            {{a.country}}, {{a.city}}, {{a.street}} {{a.number}}\n                        </label>\n                        <span ng-show="form.supplier.$dirty && form.supplier.$error.required"\n                              class="help-block">Поставщик - обязательное поле</span>\n                    </div>\n                    <div class="form-group"\n                         ng-class="{ \'has-error\': form.quantity.$dirty && form.quantity.$error.required }">\n                        <label for="quantity">Количество</label>\n                        <input type="number" min="0" name="quantity" id="quantity" class="form-control"\n                               ng-model="vm.newSupply.quantity" required/>\n                        <span ng-show="form.quantity.$dirty && form.quantity.$error.required" class="help-block">Количество - обязательное поле</span>\n                    </div>\n                    <div class="modal-footer">\n                        <button ng-click="vm.formAction()" type="submit" class="btn btn-default" data-dismiss="modal">\n                            Принять\n                        </button>\n                    </div>\n                </form>\n\n            </div>\n\n        </div>\n    </div>\n</div>\n';
},{}],35:[function(require,module,exports){
module.exports = '<div class="container" style="margin-top:70px">\n    <div class="row">\n        <div class="col-sm-2">\n            <ul id="sidebar" class="nav nav-stacked affix">\n                <li><a ng-if="vm.isAdmin()" href="#/suppliers"><i class="fa fa-truck" aria-hidden="true"></i>Поставщики</a>\n                </li>\n                <li><a ng-if="vm.isAdmin()" href="#/supplies"><i class="fa fa-download" aria-hidden="true"></i>Поставки</a>\n                </li>\n                <li><a href="#/goods-stat"><i class="fa fa-pie-chart" aria-hidden="true"></i>Статистики</a></li>\n            </ul>\n        </div>\n        <div class="col-sm-10">\n            <div ng-class="{ \'alert\': flash, \'alert-success\': flash.type === \'success\', \'alert-danger\': flash.type === \'error\' }"\n                 ng-if="flash" ng-bind="flash.message"></div>\n            <ul class="breadcrumb">\n                <li class="active">Товары</li>\n            </ul>\n            <div class="panel panel-default">\n                <!-- Default panel contents -->\n                <div class="panel-heading">Доступные товары</div>\n                <div class="custom-search">\n                    <label for="nameSearch">Поиск по названию:</label>\n                    <div class="input-group">\n                        <input type="text" placeholder="Поиск" class="form-control" id="nameSearch" ng-model="search.name">\n                        <div class="input-group-btn">\n                            <button class="btn btn-default">\n                                <i class="glyphicon glyphicon-search"></i>\n                            </button>\n                        </div>\n                    </div>\n                    <label for="quantitySearch">Поиск по количеству:</label>\n                    <div class="input-group">\n                        <input type="text" placeholder="Поиск" class="form-control" id="quantitySearch" ng-model="search.quantity">\n                        <div class="input-group-btn">\n                            <button class="btn btn-default">\n                                <i class="glyphicon glyphicon-search"></i>\n                            </button>\n                        </div>\n                    </div>\n                    <label for="priceSearch">Поиск по цене: </label>\n                    <div class="input-group">\n                        <input type="text" placeholder="Поиск" class="form-control" id="priceSearch" ng-model="search.price">\n                        <div class="input-group-btn">\n                            <button class="btn btn-default">\n                                <i class="glyphicon glyphicon-search"></i>\n                            </button>\n                        </div>\n                    </div>\n                </div>\n                <br>\n                <!-- Table -->\n                <table class="table table-hover">\n                    <thead>\n                    <tr>\n                        <th>Название</th>\n                        <th>Количество</th>\n                        <th>Цена</th>\n                        <th>О продукте</th>\n                        <th>Склады</th>\n                        <th></th>\n                    </tr>\n                    </thead>\n                    <tbody>\n                    <tr ng-repeat="g in vm.goods | filter:search:strict" class="{{g.quantity > 0 ? \'\' : \'danger\'}}">\n                        <td>{{g.name}}</td>\n                        <td>{{g.quantity}}</td>\n                        <td>{{g.price}}</td>\n                        <td>{{g.about}}</td>\n                        <td>\n                            <ul>\n                                <li ng-repeat="address in g.addresses">\n                                    {{address.country}}, {{address.city}}, {{address.street}} {{address.number}}\n                                </li>\n                            </ul>\n                        </td>\n                        <td>\n                            <button ng-if="vm.isAdmin()"\n                                    ng-click="vm.showEditForm(g)"\n                                    ctype="button" class="btn btn-default btn-sm"\n                                    data-toggle="modal" data-target="#myModal">\n                                <span class="glyphicon glyphicon-edit"></span> Редактировать\n                            </button>\n                            <button ng-if="vm.isAdmin()"\n                                    ng-click="vm.remove(g.idGoods)"\n                                    type="button" class="btn btn-default btn-sm">\n                                <span class="glyphicon glyphicon-remove"></span> Удалить\n                            </button>\n                            <button ng-if="g.quantity == 0 && vm.isAdmin()"\n                                    ng-click="vm.showOrderForm(g)"\n                                    ctype="button" class="btn btn-default btn-sm"\n                                    data-toggle="modal" data-target="#orderSupply">\n                                <span class="glyphicon glyphicon-download"></span> Заказать товар\n                            </button>\n                        </td>\n                    </tr>\n                    </tbody>\n                </table>\n            </div>\n            <button ng-if="vm.isAdmin()"\n                    ng-click="vm.showCreationForm()"\n                    ctype="button" class="btn btn-info btn-lg"\n                    data-toggle="modal" data-target="#myModal">\n                Добавить\n            </button>\n            <img ng-if="vm.dataLoading"\n                 src="data:image/gif;base64,R0lGODlhEAAQAPIAAP///wAAAMLCwkJCQgAAAGJiYoKCgpKSkiH/C05FVFNDQVBFMi4wAwEAAAAh/hpDcmVhdGVkIHdpdGggYWpheGxvYWQuaW5mbwAh+QQJCgAAACwAAAAAEAAQAAADMwi63P4wyklrE2MIOggZnAdOmGYJRbExwroUmcG2LmDEwnHQLVsYOd2mBzkYDAdKa+dIAAAh+QQJCgAAACwAAAAAEAAQAAADNAi63P5OjCEgG4QMu7DmikRxQlFUYDEZIGBMRVsaqHwctXXf7WEYB4Ag1xjihkMZsiUkKhIAIfkECQoAAAAsAAAAABAAEAAAAzYIujIjK8pByJDMlFYvBoVjHA70GU7xSUJhmKtwHPAKzLO9HMaoKwJZ7Rf8AYPDDzKpZBqfvwQAIfkECQoAAAAsAAAAABAAEAAAAzMIumIlK8oyhpHsnFZfhYumCYUhDAQxRIdhHBGqRoKw0R8DYlJd8z0fMDgsGo/IpHI5TAAAIfkECQoAAAAsAAAAABAAEAAAAzIIunInK0rnZBTwGPNMgQwmdsNgXGJUlIWEuR5oWUIpz8pAEAMe6TwfwyYsGo/IpFKSAAAh+QQJCgAAACwAAAAAEAAQAAADMwi6IMKQORfjdOe82p4wGccc4CEuQradylesojEMBgsUc2G7sDX3lQGBMLAJibufbSlKAAAh+QQJCgAAACwAAAAAEAAQAAADMgi63P7wCRHZnFVdmgHu2nFwlWCI3WGc3TSWhUFGxTAUkGCbtgENBMJAEJsxgMLWzpEAACH5BAkKAAAALAAAAAAQABAAAAMyCLrc/jDKSatlQtScKdceCAjDII7HcQ4EMTCpyrCuUBjCYRgHVtqlAiB1YhiCnlsRkAAAOwAAAAAAAAAAAA=="/>\n\n        </div>\n    </div>\n    <div class="modal fade" id="myModal" role="dialog">\n        <div class="modal-dialog">\n\n            <!-- Modal content-->\n            <div class="modal-content">\n                <div class="modal-header">\n                    <button type="button" class="close" data-dismiss="modal">&times;</button>\n                    <h4 class="modal-title">{{vm.creationForm ? "Добавление" : "Редактирование"}}</h4>\n                </div>\n                <form name="form" ng-submit="vm.formAction()" role="form"\n                      style="padding-left: 10px; padding-right: 10px">\n                    <div class="form-group" ng-class="{ \'has-error\': form.name.$dirty && form.name.$error.required }">\n                        <label for="name">Название товара</label>\n                        <input type="text" name="name" id="name" class="form-control" ng-model="vm.newGoods.name"\n                               required/>\n                        <span ng-show="form.name.$dirty && form.name.$error.required" class="help-block">Название товара - обязательное поле</span>\n                    </div>\n                    <div class="form-group" ng-class="{ \'has-error\': form.price.$dirty && form.price.$error.required }">\n                        <label for="name">Цена</label>\n                        <input type="number" name="price" id="price" class="form-control" ng-model="vm.newGoods.price"\n                               required/>\n                        <span ng-show="form.price.$dirty && form.price.$error.required"\n                              class="help-block">Цена - обязательное поле</span>\n                    </div>\n                    <div class="form-group" ng-class="{ \'has-error\': form.about.$dirty && form.about.$error.required }">\n                        <label for="name">Коротко о товаре:</label>\n                        <input type="text" name="about" id="about" class="form-control" ng-model="vm.newGoods.about"\n                               required/>\n                        <span ng-show="form.about.$dirty && form.about.$error.required"\n                              class="help-block">О вас - обязательное поле</span>\n                    </div>\n                    <div class="modal-footer">\n                        <button ng-click="vm.formAction()" type="submit" class="btn btn-default" data-dismiss="modal">\n                            Принять\n                        </button>\n                    </div>\n                </form>\n\n            </div>\n\n        </div>\n    </div>\n    <div class="modal fade" id="orderSupply" role="dialog">\n        <div class="modal-dialog">\n\n            <!-- Modal content-->\n            <div class="modal-content">\n                <div class="modal-header">\n                    <button type="button" class="close" data-dismiss="modal">&times;</button>\n                    <h4 class="modal-title">Заказать</h4>\n                </div>\n                <form name="form" ng-submit="vm.formAction()" role="form"\n                      style="padding-left: 10px; padding-right: 10px">\n                    <div class="form-group"\n                         ng-class="{ \'has-error\': form.supplier.$dirty && form.supplier.$error.required }">\n                        <label for="supplier">Поставщик</label>\n                        <select class="form-control" id="supplier" name="supplier" ng-model="vm.newSupply.supplier"\n                                required>\n                            <option ng-repeat="s in vm.suppliers" value="{{s.idSupplier}}">{{s.name}}</option>\n                        </select>\n                        <span ng-show="form.supplier.$dirty && form.supplier.$error.required"\n                              class="help-block">Поставщик - обязательное поле</span>\n                    </div>\n                    <div class="form-group"\n                         ng-class="{ \'has-error\': form.supplier.$dirty && form.supplier.$error.required }">\n                        <label for="supplier">Склад</label>\n                        <br/>\n                        <label ng-repeat="a in vm.addresses" class="radio-inline">\n                            <input value="{{a.idAddress}}" type="radio" ng-model="vm.newSupply.address">\n                            {{a.country}}, {{a.city}}, {{a.street}} {{a.number}}\n                        </label>\n                        <span ng-show="form.supplier.$dirty && form.supplier.$error.required"\n                              class="help-block">Поставщик - обязательное поле</span>\n                    </div>\n                    <div class="form-group"\n                         ng-class="{ \'has-error\': form.quantity.$dirty && form.quantity.$error.required }">\n                        <label for="quantity">Количество</label>\n                        <input type="number" min="0" name="quantity" id="quantity" class="form-control"\n                               ng-model="vm.newSupply.quantity" required/>\n                        <span ng-show="form.quantity.$dirty && form.quantity.$error.required" class="help-block">Количество - обязательное поле</span>\n                    </div>\n                    <div class="modal-footer">\n                        <button ng-click="vm.formAction()" type="submit" class="btn btn-default" data-dismiss="modal">\n                            Принять\n                        </button>\n                    </div>\n                </form>\n\n            </div>\n\n        </div>\n    </div>\n</div>\n';
},{}],36:[function(require,module,exports){
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


},{"./template.html":39}],37:[function(require,module,exports){
'use strict';

module.exports = [
    '$scope',
    'userService',
    function ($scope, UserService) {
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
},{}],38:[function(require,module,exports){
(function (global){
'use strict';

var angular = (typeof window !== "undefined" ? window.angular : typeof global !== "undefined" ? global.angular : null);

angular
    .module('Home', [])
    .config(require('./config'))
    .run(require('../run'))
    .service('statService', require('../statistics-service'))
    .directive('topMenu', require('./top-menu/directive'))
    .controller('HomeController', require('./controller'));

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"../run":66,"../statistics-service":67,"./config":36,"./controller":37,"./top-menu/directive":41}],39:[function(require,module,exports){
module.exports = '<div class="container" style="margin-top:50px">\n    <h1>Добро пожаловать {{vm.user.name}}!</h1>\n    <div class="row">\n        <div class="col-md-4">\n            <p>A fixed navigation bar stays visible in a fixed position (top or bottom) independent of the page\n                scroll.</p>\n            <p>A fixed navigation bar stays visible in a fixed position (top or bottom) independent of the page\n                scroll.</p>\n        </div>\n        <div class="col-md-4">\n            <p>A fixed navigation bar stays visible in a fixed position (top or bottom) independent of the page\n                scroll.</p>\n            <p>A fixed navigation bar stays visible in a fixed position (top or bottom) independent of the page\n                scroll.</p>\n        </div>\n        <div class="col-md-4">\n            <p>A fixed navigation bar stays visible in a fixed position (top or bottom) independent of the page\n                scroll.</p>\n            <p>A fixed navigation bar stays visible in a fixed position (top or bottom) independent of the page\n                scroll.</p>\n        </div>\n    </div>\n</div>\n';
},{}],40:[function(require,module,exports){
'use strict';

module.exports = [
    '$scope',
    '$state',
    'authService',
    'userService',
    'purchaseService',
    function ($scope, $state, authService, userService, purchaseService) {

        $scope.isCollapsed = true;
        $scope.authStatus = false;
        var flag = false;
        $scope.countNonConfirmPurchases = 0;
        $scope.user = {};

        setTimeout(initController(), 1000);

        function initController() {
            getCurrentUser();
            getCountOfNonConfirm();
        }

        function getCurrentUser() {
            userService.getCurrentUser()
                .then(function (user) {
                    if(user.success)
                        $scope.user = user.data;
                    else {
                        $scope.authStatus = false;
                        flag = false;
                        getCurrentUser();
                        getCountOfNonConfirm();
                        authService.ClearCredentials();
                    }
                });
        }

        function getCountOfNonConfirm() {
            purchaseService.getCountOfNonConfirm()
                .then(function (count) {
                    if (count.success) {
                        $scope.countNonConfirmPurchases = count.data;
                    } else {
                        console.log(count.message);
                    }
                });
        }

        $scope.refresh = function () {
            getCurrentUser();
            getCountOfNonConfirm();
        };

        $scope.isAuth = function () {
            if (!$scope.authStatus) {
                $scope.authStatus = authService.isAuth();
            }
            if ($scope.authStatus && !flag) {
                getCurrentUser();
                getCountOfNonConfirm();
                flag = true;
            }
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
            flag = false;
            getCurrentUser();
            getCountOfNonConfirm();
            return authService.ClearCredentials();
        };

    }
];

},{}],41:[function(require,module,exports){
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

},{"./controller":40,"./template.html":42}],42:[function(require,module,exports){
module.exports = '<div ng-show="isAuth()" class="container-fluid">\n    <nav class="navbar navbar-inverse navbar-fixed-top">\n        <div class="navbar-header">\n            <button type="button"\n                    ng-click="isCollapsed = !isCollapsed"\n                    class="navbar-toggle collapsed">\n                <span class="sr-only">Toggle navigation</span>\n                <span class="icon-bar"></span>\n                <span class="icon-bar"></span>\n                <span class="icon-bar"></span>\n            </button>\n            <a class="navbar-brand">LogisticSystem</a>\n        </div>\n        <div id="navbar"\n             class="navbar-collapse collapse"\n             ng-class="{\'text-align-center\': !isCollapsed}"\n             uib-collapse="isCollapsed">\n            <ul class="nav navbar-nav navbar-right margin-right-5">\n                <li>\n                    <a ng-click="refresh()" ng-if="isAdmin()" href="#/users">\n                        <i class="fa fa-users" aria-hidden="true"></i> Пользователи\n                    </a>\n                </li>\n                <li><a ng-click="refresh()" href="#/goods"><i class="fa fa-shopping-bag"\n                                                              aria-hidden="true"></i>Товары</a></li>\n                <li><a ng-click="refresh()" ng-if="isAdmin()" href="#/addresses"><i class="fa fa-building-o"\n                                                                                    aria-hidden="true"></i>Склады</a>\n                </li>\n                <li><a ng-click="refresh()" ng-if="isUser()" href="#/addresses"><i class="fa fa-building-o"\n                                                                                   aria-hidden="true"></i>Магазины</a>\n                </li>\n                <li>\n                    <a ng-click="refresh()" href="#/purchases">\n                        <i class="fa fa-shopping-cart" aria-hidden="true"></i> Заказы на поставку\n                        <span ng-if="countNonConfirmPurchases > 0" class="badge">{{countNonConfirmPurchases}}</span>\n                    </a>\n                </li>\n                <li ng-click="logout()">\n                    <a ng-if="isAdmin()" href="#/logout" class="cursor-pointer">\n                        <span class="glyphicon glyphicon-off"></span> Выйти\n                    </a>\n                </li>\n                <li ng-if="isUser()" class="dropdown">\n                    <a href="#" class="dropdown-toggle" data-toggle="dropdown" role="button" aria-haspopup="true"\n                       aria-expanded="false">{{user.name}}<span class="caret"></span></a>\n                    <ul class="dropdown-menu">\n                        <li><a href="#/user-profile">\n                            <i class="fa fa-user-o" aria-hidden="true"></i> Профиль</a></li>\n                        <li role="separator" class="divider"></li>\n                        <li ng-click="logout()"><a href="#/logout"><span class="glyphicon glyphicon-off"></span>\n                            Выйти</a></li>\n                    </ul>\n                </li>\n            </ul>\n        </div>\n    </nav>\n</div>\n';
},{}],43:[function(require,module,exports){
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


},{"./forbidden-template.html":45,"./template.html":47}],44:[function(require,module,exports){
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


},{}],45:[function(require,module,exports){
module.exports = '<div class="logo-container">\n    <div>\n        <h3>Forbidden</h3>\n    </div>\n</div>';
},{}],46:[function(require,module,exports){
(function (global){
'use strict';

var angular = (typeof window !== "undefined" ? window.angular : typeof global !== "undefined" ? global.angular : null);

angular
    .module('Login', [])
    .config(require('./config'))
    .run(require('../run'))
    .controller('LoginController', require('./controller'));

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"../run":66,"./config":43,"./controller":44}],47:[function(require,module,exports){
module.exports = '<div ng-class="{ \'alert\': flash, \'alert-success\': flash.type === \'success\', \'alert-danger\': flash.type === \'error\' }"\n     ng-if="flash" ng-bind="flash.message"></div>\n<div class="col-md-6 col-md-offset-3">\n    <h2>Login</h2>\n    <form name="form" ng-submit="vm.login()" role="form">\n        <div class="form-group" ng-class="{ \'has-error\': form.username.$dirty && form.username.$error.required }">\n            <label for="username">Username</label>\n            <input type="text" name="username" id="username" class="form-control" ng-model="vm.username" required/>\n            <span ng-show="form.username.$dirty && form.username.$error.required" class="help-block">Username - обязательное поле</span>\n        </div>\n        <div class="form-group" ng-class="{ \'has-error\': form.password.$dirty && form.password.$error.required }">\n            <label for="password">Password</label>\n            <input type="password" name="password" id="password" class="form-control" ng-model="vm.password" required/>\n            <span ng-show="form.password.$dirty && form.password.$error.required" class="help-block">Password - обязательное поле</span>\n        </div>\n        <div class="form-actions">\n            <button type="submit" ng-disabled="form.$invalid || vm.dataLoading" class="btn btn-primary">Войти</button>\n            <img ng-if="vm.dataLoading"\n                 src="data:image/gif;base64,R0lGODlhEAAQAPIAAP///wAAAMLCwkJCQgAAAGJiYoKCgpKSkiH/C05FVFNDQVBFMi4wAwEAAAAh/hpDcmVhdGVkIHdpdGggYWpheGxvYWQuaW5mbwAh+QQJCgAAACwAAAAAEAAQAAADMwi63P4wyklrE2MIOggZnAdOmGYJRbExwroUmcG2LmDEwnHQLVsYOd2mBzkYDAdKa+dIAAAh+QQJCgAAACwAAAAAEAAQAAADNAi63P5OjCEgG4QMu7DmikRxQlFUYDEZIGBMRVsaqHwctXXf7WEYB4Ag1xjihkMZsiUkKhIAIfkECQoAAAAsAAAAABAAEAAAAzYIujIjK8pByJDMlFYvBoVjHA70GU7xSUJhmKtwHPAKzLO9HMaoKwJZ7Rf8AYPDDzKpZBqfvwQAIfkECQoAAAAsAAAAABAAEAAAAzMIumIlK8oyhpHsnFZfhYumCYUhDAQxRIdhHBGqRoKw0R8DYlJd8z0fMDgsGo/IpHI5TAAAIfkECQoAAAAsAAAAABAAEAAAAzIIunInK0rnZBTwGPNMgQwmdsNgXGJUlIWEuR5oWUIpz8pAEAMe6TwfwyYsGo/IpFKSAAAh+QQJCgAAACwAAAAAEAAQAAADMwi6IMKQORfjdOe82p4wGccc4CEuQradylesojEMBgsUc2G7sDX3lQGBMLAJibufbSlKAAAh+QQJCgAAACwAAAAAEAAQAAADMgi63P7wCRHZnFVdmgHu2nFwlWCI3WGc3TSWhUFGxTAUkGCbtgENBMJAEJsxgMLWzpEAACH5BAkKAAAALAAAAAAQABAAAAMyCLrc/jDKSatlQtScKdceCAjDII7HcQ4EMTCpyrCuUBjCYRgHVtqlAiB1YhiCnlsRkAAAOwAAAAAAAAAAAA=="/>\n            <a href="#/registration" class="btn btn-link">Зарегистрироваться</a>\n        </div>\n    </form>\n</div>\n';
},{}],48:[function(require,module,exports){
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
        service.getCountOfNonComplete = getCountOfNonComplete;
        service.confirm = confirm;
        service.update = update;
        service.remove = remove;

        return service;

        function getAll() {
            return $http.get(REST_SERVICE_URI + 'rest/get/buys/user').then(handleSuccess,
                handleError('Ошибка при получении всех поставок'));
        }

        function getCountOfNonComplete() {
            return $http.get(REST_SERVICE_URI + 'rest/get/buys/nocompleted/size')
                .then(handleSuccess, handleError('Ошибка при получении количества не подтвержденных поставок'));
        }

        function create(idClient, idGoods, buy) {
            return $http.post(REST_SERVICE_URI + 'rest/create/buy/' + idClient + '/' + idGoods, buy)
                .then(handleSuccess, handleError('Ошибка при фиксировании новой поставки клиенту'));
        }

        function confirm(id) {
            return $http.put(REST_SERVICE_URI + 'rest/update/buy/' + id + '/complete')
                .then(handleSuccess, handleError('Ошибка при подтверждении выполнения заказа'));
        }

        function update(curBuy) {
            return $http.put(REST_SERVICE_URI + 'rest/update/buy/' + curBuy.idBuy)
                .then(handleSuccess, handleError('Ошибка обновления поставки'));
        }

        function remove(id) {
            return $http.delete(REST_SERVICE_URI + 'rest/delete/buy/' + id).then(handleSuccess, handleError('Ошибка удаления поставки клиенту'));
        }

        function handleSuccess(res) {
            return {
                success: true,
                data: res.data,
                message: "Операция выполнена успешно!"
            };
        }

        function handleError(error) {
            return function () {
                return {
                    success: false,
                    message: error
                };
            };
        }

    }
];
},{}],49:[function(require,module,exports){
'use strict';

module.exports = [
    '$stateProvider',
    function ($stateProvider) {
        $stateProvider
            .state('buy-stat', {
                url: '/buy-stat',
                controller: 'BuyStatController',
                controllerAs: 'vm',
                template: require('./template.html'),
                data: {
                    authorizedRoles: ['USER', 'ADMIN']
                }
            });
    }
];

},{"./template.html":52}],50:[function(require,module,exports){
'use strict';

module.exports = [
    'statService',
    'authService',
    function (statService, authService) {
        var vm = this;

        vm.data = [];
        vm.dataLoading = true;
        vm.isAdmin = isAdmin;
        initController();

        function initController() {
            loadData();
        }

        vm.BuyChart = {};
        vm.BuyChart.type = "LineChart";

        function loadData() {
            statService.getBuysStat()
                .then(function (stats) {
                    getDataForCharts(stats.data);
                    loadCharts();
                    vm.dataLoading = false;
                });
        }

        function loadCharts() {

            vm.BuyChart.data = {
                "cols": [
                    {id: "t", label: "Дата", type: "date"},
                    {id: "s", label: "Количество", type: "number"}
                ],
                "rows": vm.data
            };

            vm.BuyChart.options = {
                title: 'График выполненых заказов',
                width: 900,
                height: 500,
                hAxis: {
                    format: 'MMM yyyy',
                    gridlines: {count: 15}
                },
                vAxis: {
                    gridlines: {color: 'none'},
                    minValue: 0
                }
            };
        }

        function isAdmin() {
            return authService.checkRole(['ADMIN']);
        }

        function getDataForCharts(stats) {
            for(var index in stats) {
                var buyDate = new Date(stats[index].date);
                var flag = true;
                for(var curIndex in vm.data) {
                    if (buyDate.getMonth() === vm.data[curIndex].c[0].v.getMonth() &&
                        buyDate.getYear() === vm.data[curIndex].c[0].v.getYear()) {
                        vm.data[curIndex].c[1].v++;
                        flag = false;
                    }
                }
                if (flag === true) {
                    vm.data.push(
                        {
                            c: [
                                {v: buyDate},
                                {v: 1}
                            ]
                        }
                    )
                }
            }
        }

    }
];

},{}],51:[function(require,module,exports){
(function (global){
'use strict';

var angular = (typeof window !== "undefined" ? window.angular : typeof global !== "undefined" ? global.angular : null);

angular
    .module('Buys.Stat', ['googlechart'])
    .config(require('./config'))
    .controller('BuyStatController', require('./controller'));
}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./config":49,"./controller":50}],52:[function(require,module,exports){
module.exports = '<div class="container" style="margin-top:70px">\n    <div id="wrapper" class="toggled">\n        <div id="page-content-wrapper">\n            <ul class="breadcrumb">\n                <li><a href="#/purchases">Заказы на поставку</a></li>\n                <li><a href="#/buys">Поставки клиенту</a></li>\n                <li class="active">Статистика</li>\n            </ul>\n            <div class="container-fluid" align="center" >\n                <div ng-if="!vm.dataLoading" class="row">\n                    <div class="col-lg-12">\n                        <div google-chart chart="vm.BuyChart" style="height:600px; width:100%;"></div>\n                    </div>\n                </div>\n                <div ng-if="vm.dataLoading"  class="row vertical-center-row">\n                    <div class="text-center col-md-4 col-md-offset-4">\n                        <i class="fa fa-spinner fa-pulse fa-5x fa-fw"></i>\n                        <span class="sr-only">Loading...</span>\n                    </div>\n                </div>\n            </div>\n        </div>\n    </div>\n</div>\n\n\n';
},{}],53:[function(require,module,exports){
'use strict';

module.exports = [
    '$stateProvider',
    function ($stateProvider) {
        $stateProvider
            .state('buys', {
                url: '/buys',
                controller: 'BuyController',
                controllerAs: 'vm',
                template: require('./template.html'),
                data: {
                    authorizedRoles: ['ADMIN', 'USER']
                }
            });
    }
];

},{"./template.html":56}],54:[function(require,module,exports){
'use strict';

module.exports = [
    'buyService',
    'authService',
    'flashService',
    function (buyService, authService, flashService) {
        var vm = this;

        vm.buys = [];
        vm.dataLoading = true;
        vm.isAdmin = isAdmin;
        vm.confirm = confirm;
        vm.remove = remove;

        initController();

        function initController() {
            loadAllBuys();
            vm.dataLoading = false;
        }

        function isAdmin() {
            return authService.checkRole(['ADMIN']);
        }

        function confirm(idBuy) {
            vm.dataLoading = true;
            buyService.confirm(idBuy)
                .then(function (response) {
                    if (response.success) {
                        loadAllBuys();
                        flashService.Success(response.message);
                        vm.dataLoading = false;
                    } else {
                        flashService.Error(response.message);
                        vm.dataLoading = false;
                        console.log(response.message)
                    }
                });
        }

        function remove(idPurchase) {
            vm.dataLoading = true;
            buyService.remove(idPurchase)
                .then(function (response) {
                    if (response.success) {
                        loadAllBuys();
                        flashService.Success(response.message);
                        vm.dataLoading = false;
                    } else {
                        flashService.Error(response.message);
                        vm.dataLoading = false;
                        console.log("Что-то пошло не так")
                    }
                });
        }

        function loadAllBuys() {
            buyService.getAll()
                .then(function (buys) {
                    vm.buys = buys.data;
                });
        }
    }
];

},{}],55:[function(require,module,exports){
(function (global){
'use strict';

var angular = (typeof window !== "undefined" ? window.angular : typeof global !== "undefined" ? global.angular : null);
require('./buy-stat');

angular
    .module('Purchases.Buys',
        [
        'Buys.Stat'
        ])
    .config(require('./config'))
    .controller('BuyController', require('./controller'))
    .service('buyService', require('./buy-service'));

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./buy-service":48,"./buy-stat":51,"./config":53,"./controller":54}],56:[function(require,module,exports){
module.exports = '<div class="container" style="margin-top:70px">\n    <div class="row">\n        <div class="col-sm-2">\n            <ul id="sidebar" class="nav nav-stacked affix">\n                <li><a href="#/buy-stat">\n                    <i class="fa fa-line-chart" aria-hidden="true"></i>\n                    Статистика\n                </a></li>\n            </ul>\n        </div>\n        <div class="col-sm-10">\n            <div ng-class="{ \'alert\': flash, \'alert-success\': flash.type === \'success\', \'alert-danger\': flash.type === \'error\' }"\n                 ng-if="flash" ng-bind="flash.message"></div>\n            <ul class="breadcrumb">\n                <li><a href="#/purchases">Заказы на поставку</a></li>\n                <li class="active">Поставки клиенту</li>\n            </ul>\n            <div class="panel panel-default">\n                <!-- Default panel contents -->\n                <div class="panel-heading">Поставки клиенту</div>\n                <div class="custom-search">\n                    <label for="nameSearch">Поиск по товару:</label>\n                    <div class="input-group">\n                        <input type="text" placeholder="Поиск" class="form-control" id="nameSearch" ng-model="search.goods.name">\n                        <div class="input-group-btn">\n                            <button class="btn btn-default">\n                                <i class="glyphicon glyphicon-search"></i>\n                            </button>\n                        </div>\n                    </div>\n                    <label for="clientSearch">Поиск по клиенту:</label>\n                    <div class="input-group">\n                        <input type="text" placeholder="Поиск" class="form-control" id="clientSearch" ng-model="search.client.name">\n                        <div class="input-group-btn">\n                            <button class="btn btn-default">\n                                <i class="glyphicon glyphicon-search"></i>\n                            </button>\n                        </div>\n                    </div>\n                    <label for="quantitySearch">Поиск по количеству: </label>\n                    <div class="input-group">\n                        <input type="text" placeholder="Поиск" class="form-control" id="quantitySearch" ng-model="search.quantity">\n                        <div class="input-group-btn">\n                            <button class="btn btn-default">\n                                <i class="glyphicon glyphicon-search"></i>\n                            </button>\n                        </div>\n                    </div>\n                </div>\n                <br>\n                <!-- Table -->\n                <table class="table table-hover">\n                    <thead>\n                    <tr>\n                        <th>Товар</th>\n                        <th>Клиент</th>\n                        <th>Количество</th>\n                        <th>Дата</th>\n                        <th>Статус</th>\n                        <th></th>\n                    </tr>\n                    </thead>\n                    <tbody>\n                    <tr ng-repeat="b in vm.buys | filter:search:strict"\n                        class="{{b.completed == false && b.goods.quantity === 0 ? \'danger\' : (\n                        (b.completed == false && b.goods.quantity != 0) ||\n                        (b.completed == true && b.goods.quantity === 0) ? \'warning\' : \'success\'\n                        )}}">\n                        <td>{{b.goods.name}}</td>\n                        <td>{{b.client.name}}</td>\n                        <td>{{b.quantity}}</td>\n                        <td>{{b.date}}</td>\n                        <td>{{b.completed ? "Подтверждено" : "Не подтверждено"}}</td>\n                        <td>\n                            <button ng-if="b.completed == false && b.goods.quantity != 0 && !vm.isAdmin()"\n                                    ng-click="vm.confirm(b.idBuy)" type="button" class="btn btn-default btn-sm">\n                                <span class="glyphicon glyphicon-ok"></span> Подтвердить\n                            </button>\n                            <button ng-if="!b.completed && !vm.isAdmin()" ng-click="vm.remove(b.idBuy)" type="button"\n                                    class="btn btn-default btn-sm">\n                                <span class="glyphicon glyphicon-remove"></span> Удалить\n                            </button>\n                        </td>\n                    </tr>\n                    </tbody>\n                </table>\n            </div>\n            <img ng-if="vm.dataLoading"\n                 src="data:image/gif;base64,R0lGODlhEAAQAPIAAP///wAAAMLCwkJCQgAAAGJiYoKCgpKSkiH/C05FVFNDQVBFMi4wAwEAAAAh/hpDcmVhdGVkIHdpdGggYWpheGxvYWQuaW5mbwAh+QQJCgAAACwAAAAAEAAQAAADMwi63P4wyklrE2MIOggZnAdOmGYJRbExwroUmcG2LmDEwnHQLVsYOd2mBzkYDAdKa+dIAAAh+QQJCgAAACwAAAAAEAAQAAADNAi63P5OjCEgG4QMu7DmikRxQlFUYDEZIGBMRVsaqHwctXXf7WEYB4Ag1xjihkMZsiUkKhIAIfkECQoAAAAsAAAAABAAEAAAAzYIujIjK8pByJDMlFYvBoVjHA70GU7xSUJhmKtwHPAKzLO9HMaoKwJZ7Rf8AYPDDzKpZBqfvwQAIfkECQoAAAAsAAAAABAAEAAAAzMIumIlK8oyhpHsnFZfhYumCYUhDAQxRIdhHBGqRoKw0R8DYlJd8z0fMDgsGo/IpHI5TAAAIfkECQoAAAAsAAAAABAAEAAAAzIIunInK0rnZBTwGPNMgQwmdsNgXGJUlIWEuR5oWUIpz8pAEAMe6TwfwyYsGo/IpFKSAAAh+QQJCgAAACwAAAAAEAAQAAADMwi6IMKQORfjdOe82p4wGccc4CEuQradylesojEMBgsUc2G7sDX3lQGBMLAJibufbSlKAAAh+QQJCgAAACwAAAAAEAAQAAADMgi63P7wCRHZnFVdmgHu2nFwlWCI3WGc3TSWhUFGxTAUkGCbtgENBMJAEJsxgMLWzpEAACH5BAkKAAAALAAAAAAQABAAAAMyCLrc/jDKSatlQtScKdceCAjDII7HcQ4EMTCpyrCuUBjCYRgHVtqlAiB1YhiCnlsRkAAAOwAAAAAAAAAAAA=="/>\n\n        </div>\n    </div>\n</div>\n';
},{}],57:[function(require,module,exports){
'use strict';

module.exports = [
    '$stateProvider',
    function ($stateProvider) {
        $stateProvider
            .state('purchases', {
                url: '/purchases',
                controller: 'PurchaseController',
                controllerAs: 'vm',
                template: require('./template.html'),
                data: {
                    authorizedRoles: ['ADMIN', 'USER']
                }
            });
    }
];

},{"./template.html":61}],58:[function(require,module,exports){
'use strict';

module.exports = [
    'purchaseService',
    'authService',
    'supplierService',
    'supplyService',
    'goodsService',
    'addressService',
    'buyService',
    'userService',
    'flashService',
    function (purchaseService, authService, supplierService,
              supplyService, goodsService, addressService,
              buyService, userService, flashService) {
        var vm = this;

        vm.suppliers = [];
        vm.addresses = [];
        vm.purchases = [];
        vm.goods = [];
        vm.newSupply = {};
        vm.newPurchase = {};
        vm.currentGoods = {};
        vm.currentUser = {};
        vm.countOfNonComplete = 0;
        vm.creationForm = false;
        vm.editionForm = false;
        vm.orderForm = false;
        vm.dataLoading = true;
        vm.formAction = formAction;
        vm.getCountOfNonComplete = getCountOfNonComplete;
        vm.isAdmin = isAdmin;
        vm.showEditForm = showEditForm;
        vm.showCreationForm = showCreationForm;
        vm.showOrderForm = showOrderForm;
        vm.confirm = confirm;
        vm.remove = remove;

        initController();

        function initController() {
            getCountOfNonComplete();
            getCurrentUser();
            loadAllGoods();
            loadAllPurchases();
            loadAllSuppliers();
            loadAllAddresses();
            vm.dataLoading = false;
        }

        function formAction() {
            vm.dataLoading = true;
            if (vm.editionForm) {
                edit();
            }
            else if (vm.creationForm) {
                create();
            }
            else if (vm.orderForm) {
                createSupply();
            }
        }

        function isAdmin() {
            return authService.checkRole(['ADMIN']);
        }

        function showCreationForm() {
            vm.newPurchase = {};
            vm.creationForm = true;
            vm.editionForm = false;
        }

        function showEditForm(purchase) {
            vm.newPurchase.idPurchase = purchase.idPurchase;
            vm.newPurchase.goods = purchase.goods.idGoods;
            vm.newPurchase.frequency = purchase.frequency;
            vm.newPurchase.quantity = purchase.quantity;
            vm.editionForm = true;
            vm.creationForm = false;
        }

        function showOrderForm(goods) {
            vm.currentGoods = goods;
            vm.orderForm = true;
        }

        function confirm(idPurchase) {
            vm.dataLoading = true;
            purchaseService.confirm(idPurchase)
                .then(function (response) {
                    if (response.success) {
                        loadAllPurchases();
                        flashService.Success(response.message);
                        vm.dataLoading = false;
                    } else {
                        flashService.Error(response.message);
                        vm.dataLoading = false;
                        console.log(response.message)
                    }
                });
        }

        function remove(idPurchase) {
            vm.dataLoading = true;
            purchaseService.remove(idPurchase)
                .then(function (response) {
                    if (response.success) {
                        loadAllPurchases();
                        flashService.Success(response.message);
                        vm.dataLoading = false;
                    } else {
                        flashService.Error(response.message);
                        vm.dataLoading = false;
                        console.log("Что-то пошло не так")
                    }
                });
        }

        function create() {
            var idGoods = vm.newPurchase.goods;
            delete vm.newPurchase.goods;
            purchaseService.create(vm.currentUser.idUser, idGoods, vm.newPurchase)
                .then(function (response) {
                    if (response.success) {
                        loadAllPurchases();
                        flashService.Success(response.message);
                        vm.creationForm = false;
                        vm.newPurchase = {};
                        vm.dataLoading = false;
                    } else {
                        flashService.Error(response.message);
                        vm.dataLoading = false;
                        console.log("Что-то пошло не так");
                        console.log(response.message);
                    }
                });
        }

        function edit() {
            var idGoods = vm.newPurchase.goods;
            delete vm.newPurchase.goods;
            purchaseService.update(vm.newPurchase, idGoods)
                .then(function (response) {
                    if (response.success) {
                        loadAllPurchases();
                        flashService.Success(response.message);
                        vm.editionForm = false;
                        vm.newPurchase = {};
                        vm.dataLoading = false;
                    } else {
                        flashService.Error(response.message);
                        vm.dataLoading = false;
                        console.log("Что-то пошло не так");
                        console.log(response.message);
                    }
                });
        }

        function loadAllPurchases() {
            purchaseService.getAll()
                .then(function (purchases) {
                    vm.purchases = purchases.data;
                });
        }

        function loadAllSuppliers() {
            supplierService.getAll()
                .then(function (suppliers) {
                    vm.suppliers = suppliers.data;
                });
        }

        function createSupply() {
            var idGoods = vm.currentGoods.idGoods;
            var idSupplier = vm.newSupply.supplier;
            var idAddress = vm.newSupply.address;
            delete vm.newSupply.supplier;
            delete vm.newSupply.address;
            var date = new Date();
            vm.newSupply.date = date.getFullYear() + "-" +
                ((date.getMonth() + 1) < 10 ? ("0" + (date.getMonth() + 1)) : (date.getMonth() + 1)) + "-" +
                (date.getDate() < 10 ? ("0" + date.getDate()) : date.getDate());
            supplyService.create(vm.newSupply, idSupplier, idGoods, idAddress)
                .then(function (response) {
                    if (response.success) {
                        loadAllPurchases();
                        flashService.Success(response.message);
                        vm.orderForm = false;
                        vm.currentGoods = {};
                        vm.newSupply = {};
                        vm.dataLoading = false;
                    } else {
                        flashService.Error(response.message);
                        vm.dataLoading = false;
                        console.log(response.message)
                    }
                });
        }

        function loadAllAddresses() {
            addressService.getAllStores()
                .then(function (addresses) {
                    vm.addresses = addresses.data;
                })
        }

        function loadAllGoods() {
            goodsService.getAll()
                .then(function (goods) {
                    vm.goods = goods.data;
                });
        }

        function getCountOfNonComplete() {
            buyService.getCountOfNonComplete()
                .then(function (count) {
                    if (count.success) {
                        vm.countOfNonComplete = count.data;
                    } else {
                        flashService.Error(response.message);
                        vm.dataLoading = false;
                        console.log(count.message);
                    }
                })
        }

        function getCurrentUser() {
            userService.getCurrentUser()
                .then(function (user) {
                    vm.currentUser = user.data;
                });
        }
    }
];

},{}],59:[function(require,module,exports){
(function (global){
'use strict';

var angular = (typeof window !== "undefined" ? window.angular : typeof global !== "undefined" ? global.angular : null);
require('./buy');

angular
    .module('Purchases',
        [
            'Purchases.Buys'
        ])
    .config(require('./config'))
    .controller('PurchaseController', require('./controller'))
    .service('purchaseService', require('./purchase-service'));

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./buy":55,"./config":57,"./controller":58,"./purchase-service":60}],60:[function(require,module,exports){
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
        service.getCountOfNonConfirm = getCountOfNonConfirm;
        service.create = create;
        service.confirm = confirm;
        service.update = update;
        service.remove = remove;

        return service;

        function getAll() {
            return $http.get(REST_SERVICE_URI + 'rest/get/purchases/user').then(handleSuccess,
                handleError('Ошибка при получении всех заказов на поставку'));
        }

        function getCountOfNonConfirm() {
            return $http.get(REST_SERVICE_URI + 'rest/get/purchases/noconfirm/size').then(handleSuccess,
                handleError('Ошибка при получении количества неподтвержденных заявок'));
        }

        function create(idClient, idGoods, purchase) {
            return $http.post(REST_SERVICE_URI + 'rest/create/purchase/' + idClient + '/' + idGoods, purchase)
                .then(handleSuccess, handleError('Ошибка при создание новой заявки на поставку клиенту'));
        }

        function confirm(id) {
            return $http.put(REST_SERVICE_URI + 'rest/update/purchase/' + id + '/confirm')
                .then(handleSuccess, handleError('Ошибка при подтверждении поставки'));
        }

        function update(curPurchase, newGoods) {
            return $http.put(REST_SERVICE_URI + 'rest/update/purchase/' + curPurchase.idPurchase + '/' + newGoods, curPurchase)
                .then(handleSuccess, handleError('Ошибка обновления поставки'));
        }

        function remove(id) {
            return $http.delete(REST_SERVICE_URI + 'rest/delete/purchase/' + id).then(handleSuccess,
                handleError('Ошибка удаления поставки клиенту'));
        }

        function handleSuccess(res) {
            return {
                success: true,
                data: res.data,
                message: "Операция выполнена успешно!"
            };
        }

        function handleError(error) {
            return function () {
                return {success: false, message: error};
            };
        }

    }
];
},{}],61:[function(require,module,exports){
module.exports = '<div class="container" style="margin-top:70px">\n    <div class="row">\n        <div class="col-sm-2">\n            <ul id="sidebar" class="nav nav-stacked affix">\n                <li>\n                    <a href="#/buys"><i class="fa fa-history" aria-hidden="true"></i>История поставок\n                        <span ng-if="vm.countOfNonComplete > 0" class="badge">\n                            {{vm.countOfNonComplete}}\n                        </span>\n                    </a>\n                </li>\n            </ul>\n        </div>\n        <div class="col-sm-10">\n            <div ng-class="{ \'alert\': flash, \'alert-success\': flash.type === \'success\', \'alert-danger\': flash.type === \'error\' }"\n                 ng-if="flash" ng-bind="flash.message"></div>\n            <div class="panel panel-default">\n                <!-- Default panel contents -->\n                <div class="panel-heading">Заказы:</div>\n\n                <div class="custom-search">\n                    <label for="nameSearch">Поиск по товару:</label>\n                    <div class="input-group">\n                        <input type="text" placeholder="Поиск" class="form-control" id="nameSearch" ng-model="search.goods.name">\n                        <div class="input-group-btn">\n                            <button class="btn btn-default">\n                                <i class="glyphicon glyphicon-search"></i>\n                            </button>\n                        </div>\n                    </div>\n                    <label for="clientSearch">Поиск по клиенту:</label>\n                    <div class="input-group">\n                        <input type="text" placeholder="Поиск" class="form-control" id="clientSearch" ng-model="search.client.name">\n                        <div class="input-group-btn">\n                            <button class="btn btn-default">\n                                <i class="glyphicon glyphicon-search"></i>\n                            </button>\n                        </div>\n                    </div>\n                    <label for="frequencySearch">Поиск по периодичности: </label>\n                    <div class="input-group">\n                        <input type="text" placeholder="Поиск" class="form-control" id="frequencySearch" ng-model="search.frequency">\n                        <div class="input-group-btn">\n                            <button class="btn btn-default">\n                                <i class="glyphicon glyphicon-search"></i>\n                            </button>\n                        </div>\n                    </div>\n                    <label for="quantitySearch">Поиск по количеству: </label>\n                    <div class="input-group">\n                        <input type="text" placeholder="Поиск" class="form-control" id="quantitySearch" ng-model="search.quantity">\n                        <div class="input-group-btn">\n                            <button class="btn btn-default">\n                                <i class="glyphicon glyphicon-search"></i>\n                            </button>\n                        </div>\n                    </div>\n                </div>\n                <br>\n                <!-- Table -->\n                <table class="table table-hover">\n                    <thead>\n                    <tr>\n                        <th>Товар</th>\n                        <th>Клиент</th>\n                        <th>Периодичность (раз в n дней)</th>\n                        <th>Размер поставки(шт.)</th>\n                        <th>Статус</th>\n                        <th></th>\n                    </tr>\n                    </thead>\n                    <tbody>\n                    <tr ng-repeat="p in vm.purchases | filter:search:strict"\n                        class="{{p.confirmed == false && p.goods.quantity === 0 ? \'danger\' : (\n                        (p.confirmed == false && p.goods.quantity != 0) ||\n                        (p.confirmed == true && p.goods.quantity === 0) ? \'warning\' : \'success\'\n                        )}}">\n                        <td>{{p.goods.name}}</td>\n                        <td>{{p.client.name}}</td>\n                        <td>{{p.frequency}}</td>\n                        <td>{{p.quantity}}</td>\n                        <td>{{p.confirmed ? "Подтверждено" : "Не подтверждено"}}</td>\n                        <td>\n                            <button ng-if="p.confirmed == false && p.goods.quantity != 0 && vm.isAdmin()"\n                                    ng-click="vm.confirm(p.idPurchase)" type="button" class="btn btn-default btn-sm">\n                                <span class="glyphicon glyphicon-ok"></span> Подтвердить\n                            </button>\n                            <button ng-if="!vm.isAdmin()" ng-click="vm.showEditForm(p)" ctype="button"\n                                    class="btn btn-default btn-sm"\n                                    data-toggle="modal" data-target="#myModal">\n                                <span class="glyphicon glyphicon-edit"></span> Редактировать\n                            </button>\n                            <button ng-if="p.goods.quantity === 0 && vm.isAdmin()" ng-click="vm.showOrderForm(p.goods)"\n                                    ctype="button"\n                                    class="btn btn-default btn-sm"\n                                    data-toggle="modal" data-target="#orderSupply">\n                                <span class="glyphicon glyphicon-download"></span> Заказать товар на склад\n                            </button>\n                            <button ng-click="vm.remove(p.idPurchase)" type="button" class="btn btn-default btn-sm">\n                                <span class="glyphicon glyphicon-remove"></span> Удалить\n                            </button>\n                        </td>\n                    </tr>\n                    </tbody>\n                </table>\n            </div>\n            <button ng-if="!isAdmin()" ng-click="vm.showCreationForm()" ctype="button" class="btn btn-info btn-lg"\n                    data-toggle="modal"\n                    data-target="#myModal">\n                Создать заказ на поставки\n            </button>\n            <img ng-if="vm.dataLoading"\n                 src="data:image/gif;base64,R0lGODlhEAAQAPIAAP///wAAAMLCwkJCQgAAAGJiYoKCgpKSkiH/C05FVFNDQVBFMi4wAwEAAAAh/hpDcmVhdGVkIHdpdGggYWpheGxvYWQuaW5mbwAh+QQJCgAAACwAAAAAEAAQAAADMwi63P4wyklrE2MIOggZnAdOmGYJRbExwroUmcG2LmDEwnHQLVsYOd2mBzkYDAdKa+dIAAAh+QQJCgAAACwAAAAAEAAQAAADNAi63P5OjCEgG4QMu7DmikRxQlFUYDEZIGBMRVsaqHwctXXf7WEYB4Ag1xjihkMZsiUkKhIAIfkECQoAAAAsAAAAABAAEAAAAzYIujIjK8pByJDMlFYvBoVjHA70GU7xSUJhmKtwHPAKzLO9HMaoKwJZ7Rf8AYPDDzKpZBqfvwQAIfkECQoAAAAsAAAAABAAEAAAAzMIumIlK8oyhpHsnFZfhYumCYUhDAQxRIdhHBGqRoKw0R8DYlJd8z0fMDgsGo/IpHI5TAAAIfkECQoAAAAsAAAAABAAEAAAAzIIunInK0rnZBTwGPNMgQwmdsNgXGJUlIWEuR5oWUIpz8pAEAMe6TwfwyYsGo/IpFKSAAAh+QQJCgAAACwAAAAAEAAQAAADMwi6IMKQORfjdOe82p4wGccc4CEuQradylesojEMBgsUc2G7sDX3lQGBMLAJibufbSlKAAAh+QQJCgAAACwAAAAAEAAQAAADMgi63P7wCRHZnFVdmgHu2nFwlWCI3WGc3TSWhUFGxTAUkGCbtgENBMJAEJsxgMLWzpEAACH5BAkKAAAALAAAAAAQABAAAAMyCLrc/jDKSatlQtScKdceCAjDII7HcQ4EMTCpyrCuUBjCYRgHVtqlAiB1YhiCnlsRkAAAOwAAAAAAAAAAAA=="/>\n\n        </div>\n    </div>\n    <div class="modal fade" id="orderSupply" role="dialog">\n        <div class="modal-dialog">\n\n            <!-- Modal content-->\n            <div class="modal-content">\n                <div class="modal-header">\n                    <button type="button" class="close" data-dismiss="modal">&times;</button>\n                    <h4 class="modal-title">Заказать</h4>\n                </div>\n                <form name="form" ng-submit="vm.formAction()" role="form"\n                      style="padding-left: 10px; padding-right: 10px">\n                    <div class="form-group"\n                         ng-class="{ \'has-error\': form.supplier.$dirty && form.supplier.$error.required }">\n                        <label for="supplier">Поставщик</label>\n                        <select class="form-control" id="supplier" name="supplier" ng-model="vm.newSupply.supplier"\n                                required>\n                            <option ng-repeat="s in vm.suppliers" value="{{s.idSupplier}}">{{s.name}}</option>\n                        </select>\n                        <span ng-show="form.supplier.$dirty && form.supplier.$error.required"\n                              class="help-block">Поставщик - обязательное поле</span>\n                    </div>\n                    <div class="form-group"\n                         ng-class="{ \'has-error\': form.address.$dirty && form.address.$error.required }">\n                        <label for="supplier">Склад</label>\n                        <br/>\n                        <label ng-repeat="a in vm.addresses" class="radio-inline">\n                            <input value="{{a.idAddress}}" name="address" type="radio" ng-model="vm.newSupply.address">\n                            {{a.country}}, {{a.city}}, {{a.street}} {{a.number}}\n                        </label>\n                        <span ng-show="form.address.$dirty && form.address.$error.required"\n                              class="help-block">Поставщик - обязательное поле</span>\n                    </div>\n                    <div class="form-group"\n                         ng-class="{ \'has-error\': form.quantity.$dirty && form.quantity.$error.required }">\n                        <label for="quantity">Количество</label>\n                        <input type="number" min="0" name="quantity" id="quantity" class="form-control"\n                               ng-model="vm.newSupply.quantity" required/>\n                        <span ng-show="form.quantity.$dirty && form.quantity.$error.required" class="help-block">Количество - обязательное поле</span>\n                    </div>\n                    <div class="modal-footer">\n                        <button ng-click="vm.formAction()" type="submit" class="btn btn-default" data-dismiss="modal">\n                            Принять\n                        </button>\n                    </div>\n                </form>\n\n            </div>\n\n        </div>\n    </div>\n    <div class="modal fade" id="myModal" role="dialog">\n        <div class="modal-dialog">\n\n            <!-- Modal content-->\n            <div class="modal-content">\n                <div class="modal-header">\n                    <button type="button" class="close" data-dismiss="modal">&times;</button>\n                    <h4 class="modal-title">{{vm.creationForm ? "Добавление" : "Редактирование"}}</h4>\n                </div>\n                <form name="form" ng-submit="vm.formAction()" role="form"\n                      style="padding-left: 10px; padding-right: 10px">\n                    <div class="form-group" ng-class="{ \'has-error\': form.goods.$dirty && form.goods.$error.required }">\n                        <label for="goods">Товар</label>\n                        <select class="form-control" id="goods" name="goods" ng-model="vm.newPurchase.goods"\n                                required>\n                            <option ng-repeat="g in vm.goods" value="{{g.idGoods}}">{{g.name}}</option>\n                        </select>\n                        <span ng-show="form.goods.$dirty && form.goods.$error.required" class="help-block">Товара - обязательное поле</span>\n                    </div>\n                    <div class="form-group"\n                         ng-class="{ \'has-error\': form.frequency.$dirty && form.frequency.$error.required }">\n                        <label for="frequency">Частота</label>\n                        <input type="number" name="frequency" id="frequency" class="form-control"\n                               ng-model="vm.newPurchase.frequency"\n                               required/>\n                        <span ng-show="form.frequency.$dirty && form.frequency.$error.required"\n                              class="help-block">Периодичность - обязательное поле</span>\n                    </div>\n                    <div class="form-group"\n                         ng-class="{ \'has-error\': form.quantity.$dirty && form.quantity.$error.required }">\n                        <label for="quantityPur">Размер заказов</label>\n                        <input type="text" name="quantity" id="quantityPur" class="form-control"\n                               ng-model="vm.newPurchase.quantity"\n                               required/>\n                        <span ng-show="form.quantity.$dirty && form.quantity.$error.required"\n                              class="help-block">Количество - обязательное поле</span>\n                    </div>\n                    <div class="modal-footer">\n                        <button ng-click="vm.formAction()" type="submit" class="btn btn-default" data-dismiss="modal">\n                            Принять\n                        </button>\n                    </div>\n                </form>\n\n            </div>\n\n        </div>\n    </div>\n</div>\n';
},{}],62:[function(require,module,exports){
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


},{"./template.html":65}],63:[function(require,module,exports){
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


},{}],64:[function(require,module,exports){
(function (global){
'use strict';

var angular = (typeof window !== "undefined" ? window.angular : typeof global !== "undefined" ? global.angular : null);

angular
    .module('Registration', [])
    .config(require('./config'))
    .run(require('../run'))
    .controller('RegistrationController', require('./controller'));

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"../run":66,"./config":62,"./controller":63}],65:[function(require,module,exports){
module.exports = '<div class="col-md-6 col-md-offset-3">\n    <div ng-class="{ \'alert\': flash, \'alert-success\': flash.type === \'success\', \'alert-danger\': flash.type === \'error\' }"\n         ng-if="flash" ng-bind="flash.message"></div>\n    <h2>Регистрация</h2>\n    <form name="form" ng-submit="vm.register()" role="form">\n        <div class="form-group" ng-class="{ \'has-error\': form.name.$dirty && form.name.$error.required }">\n            <label for="username">Название компании</label>\n            <input type="text" name="name" id="name" class="form-control" ng-model="vm.user.name" required/>\n            <span ng-show="form.name.$dirty && form.name.$error.required" class="help-block">Название компании - обязательное поле</span>\n        </div>\n        <div class="form-group" ng-class="{ \'has-error\': form.email.$dirty && form.email.$error.required }">\n            <label for="username">Email</label>\n            <input type="text" name="email" id="email" class="form-control" ng-model="vm.user.email" required/>\n            <span ng-show="form.email.$dirty && form.email.$error.required"\n                  class="help-block">Email - обязательное поле</span>\n        </div>\n        <div class="form-group" ng-class="{ \'has-error\': form.phone.$dirty && form.phone.$error.required }">\n            <label for="username">Контактный номер</label>\n            <input type="text" name="phone" id="phone" class="form-control" ng-model="vm.user.phone" required/>\n            <span ng-show="form.phone.$dirty && form.phone.$error.required" class="help-block">Контактный номер - обязательное поле</span>\n        </div>\n        <div class="form-group" ng-class="{ \'has-error\': form.about.$dirty && form.about.$error.required }">\n            <label for="username">Кратко о вас:</label>\n            <input type="text" name="about" id="about" class="form-control" ng-model="vm.user.about" required/>\n            <span ng-show="form.about.$dirty && form.about.$error.required"\n                  class="help-block">О вас - обязательное поле</span>\n        </div>\n        <div class="form-group" ng-class="{ \'has-error\': form.username.$dirty && form.username.$error.required }">\n            <label for="username">Username</label>\n            <input type="text" name="username" id="username" class="form-control" ng-model="vm.user.username" required/>\n            <span ng-show="form.username.$dirty && form.username.$error.required" class="help-block">Username - обязательное поле</span>\n        </div>\n        <div class="form-group" ng-class="{ \'has-error\': form.password.$dirty && form.password.$error.required }">\n            <label for="password">Password</label>\n            <input type="password" name="password" id="password" class="form-control" ng-model="vm.user.password"\n                   required/>\n            <span ng-show="form.password.$dirty && form.password.$error.required" class="help-block">Password - обязательное поле</span>\n        </div>\n        <div class="form-actions">\n            <button type="submit" ng-disabled="form.$invalid || vm.dataLoading" class="btn btn-primary">\n                Зарегистрироваться\n            </button>\n            <img ng-if="vm.dataLoading"\n                 src="data:image/gif;base64,R0lGODlhEAAQAPIAAP///wAAAMLCwkJCQgAAAGJiYoKCgpKSkiH/C05FVFNDQVBFMi4wAwEAAAAh/hpDcmVhdGVkIHdpdGggYWpheGxvYWQuaW5mbwAh+QQJCgAAACwAAAAAEAAQAAADMwi63P4wyklrE2MIOggZnAdOmGYJRbExwroUmcG2LmDEwnHQLVsYOd2mBzkYDAdKa+dIAAAh+QQJCgAAACwAAAAAEAAQAAADNAi63P5OjCEgG4QMu7DmikRxQlFUYDEZIGBMRVsaqHwctXXf7WEYB4Ag1xjihkMZsiUkKhIAIfkECQoAAAAsAAAAABAAEAAAAzYIujIjK8pByJDMlFYvBoVjHA70GU7xSUJhmKtwHPAKzLO9HMaoKwJZ7Rf8AYPDDzKpZBqfvwQAIfkECQoAAAAsAAAAABAAEAAAAzMIumIlK8oyhpHsnFZfhYumCYUhDAQxRIdhHBGqRoKw0R8DYlJd8z0fMDgsGo/IpHI5TAAAIfkECQoAAAAsAAAAABAAEAAAAzIIunInK0rnZBTwGPNMgQwmdsNgXGJUlIWEuR5oWUIpz8pAEAMe6TwfwyYsGo/IpFKSAAAh+QQJCgAAACwAAAAAEAAQAAADMwi6IMKQORfjdOe82p4wGccc4CEuQradylesojEMBgsUc2G7sDX3lQGBMLAJibufbSlKAAAh+QQJCgAAACwAAAAAEAAQAAADMgi63P7wCRHZnFVdmgHu2nFwlWCI3WGc3TSWhUFGxTAUkGCbtgENBMJAEJsxgMLWzpEAACH5BAkKAAAALAAAAAAQABAAAAMyCLrc/jDKSatlQtScKdceCAjDII7HcQ4EMTCpyrCuUBjCYRgHVtqlAiB1YhiCnlsRkAAAOwAAAAAAAAAAAA=="/>\n            <a href="#/login" class="btn btn-link">Отмена</a>\n        </div>\n    </form>\n</div>\n';
},{}],66:[function(require,module,exports){
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
},{}],67:[function(require,module,exports){
'use strict';

module.exports = [
    '$http',
    'localStorageService',
    function ($http, localStorageService) {
        var service = {};

        var REST_SERVICE_URI = 'http://localhost:8080/';

        var authData = localStorageService.get('globals') ? localStorageService.get('globals').currentUser.authdata : "";

        $http.defaults.headers.common['Authorization'] = 'Basic ' + authData;

        service.getUsersStat = getUsersStat;
        service.getCurrentUserStat = getCurrentUserStat;
        service.getGoodsStat = getGoodsStat;
        service.getGoodsStatForCurrentUser = getGoodsStatForCurrentUser;
        service.getSuppliesStat = getSuppliesStat;
        service.getBuysStat = getBuysStat;

        return service;

        function getUsersStat() {
            return $http.get(REST_SERVICE_URI + 'rest/get/users/stat').then(handleSuccess,
                handleError('Ошибка при получении всех пользователей'));
        }

        function getCurrentUserStat() {
            return $http.get(REST_SERVICE_URI + 'rest/get/user/stat').then(handleSuccess,
                handleError('Ошибка при получении текущего пользователя'));
        }

        function getGoodsStat() {
            return $http.get(REST_SERVICE_URI + 'rest/get/goods/stat').then(handleSuccess,
                handleError('Ошибка при получении всех пользователей'));
        }

        function getGoodsStatForCurrentUser() {
            return $http.get(REST_SERVICE_URI + 'rest/get/goods/user/stat').then(handleSuccess,
                handleError('Ошибка при получении текущего пользователя'));
        }

        function getSuppliesStat() {
            return $http.get(REST_SERVICE_URI + 'rest/get/supply/stat').then(handleSuccess,
                handleError('Ошибка при получении всех пользователей'));
        }

        function getBuysStat() {
            return $http.get(REST_SERVICE_URI + 'rest/get/buy/stat').then(handleSuccess,
                handleError('Ошибка при получении текущего пользователя'));
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
},{}],68:[function(require,module,exports){
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

},{"./template.html":71}],69:[function(require,module,exports){
'use strict';

module.exports = [
    '$scope',
    'userService',
    'flashService',

    function ($scope, userService, flashService) {
        var vm = this;

        vm.user = null;
        vm.dataLoading = true;
        vm.allUsers = [];
        vm.remove = remove;

        initController();

        function initController() {
            loadAllUsers();
            vm.dataLoading = false;
        }

        function remove(idUser) {
            vm.dataLoading = true;
            userService.Delete(idUser)
                .then(function (response) {
                    if (response.success) {
                        loadAllUsers();
                        flashService.Success(response.message);
                        vm.dataLoading = false;
                    } else {
                        flashService.Error(response.message);
                        vm.dataLoading = false;
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

},{}],70:[function(require,module,exports){
(function (global){
'use strict';

var angular = (typeof window !== "undefined" ? window.angular : typeof global !== "undefined" ? global.angular : null);
require('./user-profile');
require('./user-stat');

angular
    .module('User',
        [
            'User.Profile',
            'User.Statistics'
        ])
    .config(require('./config'))
    .controller('UserController', require('./controller'))
    .service('userService', require('./user-service'));

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./config":68,"./controller":69,"./user-profile":74,"./user-service":76,"./user-stat":79}],71:[function(require,module,exports){
module.exports = '<div class="container" style="margin-top:70px">\n    <div class="row">\n        <div class="col-sm-2">\n            <ul id="sidebar" class="nav nav-stacked affix">\n                <li><a href="#/user-stat"><span class="fa fa-bar-chart"></span>Статистика</a></li>\n            </ul>\n        </div>\n        <div class="col-sm-10">\n            <ul class="breadcrumb">\n                <li class="active">Пользователи</li>\n            </ul>\n            <div ng-class="{ \'alert\': flash, \'alert-success\': flash.type === \'success\', \'alert-danger\': flash.type === \'error\' }"\n                 ng-if="flash" ng-bind="flash.message"></div>\n            <div class="panel panel-default">\n                <!-- Default panel contents -->\n                <div class="panel-heading">Зарегистрированные пользователи:</div>\n                <div class="custom-search">\n                    <label for="nameSearch">Поиск по имени:</label>\n                    <div class="input-group">\n                        <input type="text" placeholder="Поиск" class="form-control" id="nameSearch" ng-model="search.name">\n                        <div class="input-group-btn">\n                            <button class="btn btn-default">\n                                <i class="glyphicon glyphicon-search"></i>\n                            </button>\n                        </div>\n                    </div>\n                    <label for="emailSearch">Поиск по email:</label>\n                    <div class="input-group">\n                        <input type="text" placeholder="Поиск" class="form-control" id="emailSearch" ng-model="search.email">\n                        <div class="input-group-btn">\n                            <button class="btn btn-default">\n                                <i class="glyphicon glyphicon-search"></i>\n                            </button>\n                        </div>\n                    </div>\n                    <label for="phoneSearch">Поиск по номеру телефона: </label>\n                    <div class="input-group">\n                        <input type="text" placeholder="Поиск" class="form-control" id="phoneSearch" ng-model="search.phone">\n                        <div class="input-group-btn">\n                            <button class="btn btn-default">\n                                <i class="glyphicon glyphicon-search"></i>\n                            </button>\n                        </div>\n                    </div>\n                    <label for="userSearch">Поиск по Username: </label>\n                    <div class="input-group">\n                        <input type="text" placeholder="Поиск" class="form-control" id="userSearch" ng-model="search.username">\n                        <div class="input-group-btn">\n                            <button class="btn btn-default">\n                                <i class="glyphicon glyphicon-search"></i>\n                            </button>\n                        </div>\n                    </div>\n                </div>\n                <br>\n                <!-- Table -->\n                <table class="table table-hover">\n                    <thead>\n                    <tr>\n                        <th>Название</th>\n                        <th>Контактный email</th>\n                        <th>Контактный телефон</th>\n                        <th>Username</th>\n                        <th>О клиенте</th>\n                        <th></th>\n                    </tr>\n                    </thead>\n                    <tbody>\n                    <tr ng-repeat="u in vm.allUsers | filter:search:strict">\n                        <td>{{u.name}}</td>\n                        <td>{{u.email}}</td>\n                        <td>{{u.phone}}</td>\n                        <td>{{u.username}}</td>\n                        <td>{{u.about}}</td>\n                        <td>\n                            <button ng-click="vm.remove(u.idUser)" type="button" class="btn btn-default btn-sm">\n                                <span class="glyphicon glyphicon-remove"></span> Удалить\n                            </button>\n                        </td>\n                    </tr>\n                    </tbody>\n                </table>\n            </div>\n            <img ng-if="vm.dataLoading"\n                 src="data:image/gif;base64,R0lGODlhEAAQAPIAAP///wAAAMLCwkJCQgAAAGJiYoKCgpKSkiH/C05FVFNDQVBFMi4wAwEAAAAh/hpDcmVhdGVkIHdpdGggYWpheGxvYWQuaW5mbwAh+QQJCgAAACwAAAAAEAAQAAADMwi63P4wyklrE2MIOggZnAdOmGYJRbExwroUmcG2LmDEwnHQLVsYOd2mBzkYDAdKa+dIAAAh+QQJCgAAACwAAAAAEAAQAAADNAi63P5OjCEgG4QMu7DmikRxQlFUYDEZIGBMRVsaqHwctXXf7WEYB4Ag1xjihkMZsiUkKhIAIfkECQoAAAAsAAAAABAAEAAAAzYIujIjK8pByJDMlFYvBoVjHA70GU7xSUJhmKtwHPAKzLO9HMaoKwJZ7Rf8AYPDDzKpZBqfvwQAIfkECQoAAAAsAAAAABAAEAAAAzMIumIlK8oyhpHsnFZfhYumCYUhDAQxRIdhHBGqRoKw0R8DYlJd8z0fMDgsGo/IpHI5TAAAIfkECQoAAAAsAAAAABAAEAAAAzIIunInK0rnZBTwGPNMgQwmdsNgXGJUlIWEuR5oWUIpz8pAEAMe6TwfwyYsGo/IpFKSAAAh+QQJCgAAACwAAAAAEAAQAAADMwi6IMKQORfjdOe82p4wGccc4CEuQradylesojEMBgsUc2G7sDX3lQGBMLAJibufbSlKAAAh+QQJCgAAACwAAAAAEAAQAAADMgi63P7wCRHZnFVdmgHu2nFwlWCI3WGc3TSWhUFGxTAUkGCbtgENBMJAEJsxgMLWzpEAACH5BAkKAAAALAAAAAAQABAAAAMyCLrc/jDKSatlQtScKdceCAjDII7HcQ4EMTCpyrCuUBjCYRgHVtqlAiB1YhiCnlsRkAAAOwAAAAAAAAAAAA=="/>\n        </div>\n    </div>\n</div>\n';
},{}],72:[function(require,module,exports){
'use strict';

module.exports = [
    '$stateProvider',
    function ($stateProvider) {
        $stateProvider
            .state('user-profile', {
                url: '/user-profile',
                controller: 'ProfileController',
                controllerAs: 'vm',
                template: require('./template.html'),
                data: {
                    authorizedRoles: ['USER']
                }
            });
    }
];

},{"./template.html":75}],73:[function(require,module,exports){
'use strict';

module.exports = [
    '$location',
    'userService',
    'flashService',
    'authService',
    function ($location, userService, flashService, authService) {
        var vm = this;

        vm.user = {};
        vm.dataLoading = false;
        vm.password = {};
        vm.changePassword = changePassword;

        vm.edit = edit;

        initController();

        function initController() {
            vm.dataLoading = true;
            loadUser();
        }

        function loadUser() {
            userService.getCurrentUser()
                .then(function (users) {
                    vm.user = users.data;
                    vm.dataLoading = false;
                });
        }

        function edit() {
            vm.dataLoading = true;
            userService.update(vm.user)
                .then(function (response) {
                    if (response.success) {
                        loadUser();
                        vm.dataLoading = false;
                    } else {
                        flashService.Error(response.message);
                        vm.dataLoading = false;
                        console.log("Что-то пошло не так")
                    }
                });
        }

        function changePassword() {
            vm.dataLoading = true;
            userService.changePassword(vm.user, vm.password)
                .then(function (response) {
                    if (response.success) {
                        authService.ClearCredentials();
                        vm.dataLoading = false;
                        $location.path('/login');
                    } else {
                        flashService.Error(response.message);
                        vm.dataLoading = false;
                        console.log("Что-то пошло не так")
                    }
                });
        }
    }
];

},{}],74:[function(require,module,exports){
(function (global){
'use strict';

var angular = (typeof window !== "undefined" ? window.angular : typeof global !== "undefined" ? global.angular : null);

angular
    .module('User.Profile', [])
    .config(require('./config'))
    .controller('ProfileController', require('./controller'));
}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./config":72,"./controller":73}],75:[function(require,module,exports){
module.exports = '<nav class="navbar navbar-inverse sidebar" role="navigation" style="margin-top:50px">\n    <div class="container-fluid">\n        <!-- Brand and toggle get grouped for better mobile display -->\n        <div class="navbar-header">\n            <button type="button" class="navbar-toggle" data-toggle="collapse"\n                    data-target="#bs-sidebar-navbar-collapse-1">\n                <span class="sr-only">Toggle navigation</span>\n                <span class="icon-bar"></span>\n                <span class="icon-bar"></span>\n                <span class="icon-bar"></span>\n            </button>\n            <a class="navbar-brand" href="#">Личный кабинет</a>\n        </div>\n        <!-- Collect the nav links, forms, and other content for toggling -->\n        <div class="collapse navbar-collapse" id="bs-sidebar-navbar-collapse-1">\n            <ul class="nav navbar-nav">\n                <li>\n                    <a data-toggle="modal"\n                       data-target="#myModal">\n                        Редактировать\n                        <span style="font-size:16px;"\n                              class="pull-right hidden-xs showopacity glyphicon glyphicon-pencil">\n                        </span>\n                    </a>\n                </li>\n                <li>\n                    <a data-toggle="modal"\n                       data-target="#passwordModal">\n                        Сменить пароль\n                        <span style="font-size:16px;"\n                              class="pull-right hidden-xs showopacity glyphicon glyphicon-lock">\n                        </span>\n                    </a>\n                </li>\n                <li><a href="#/user-stat">Статистика<span style="font-size:16px;"\n                                                          class="pull-right hidden-xs showopacity fa fa-bar-chart"></span></a>\n                </li>\n            </ul>\n        </div>\n    </div>\n</nav>\n<div class="main">\n    <div class="container" align="center" style="margin-top:70px">\n        <div id="wrapper" class="toggled">\n            <div id="page-content-wrapper">\n                <div class="container-fluid">\n                    <div ng-class="{ \'alert\': flash, \'alert-success\': flash.type === \'success\', \'alert-danger\': flash.type === \'error\' }"\n                         ng-if="flash" ng-bind="flash.message"></div>\n                    <div class="row">\n                        <div class="col-lg-12">\n                            <h1>Ваш профиль:</h1>\n                            <table class="table">\n                                <input type="hidden" name="idUser" value="${user.idUser}"/>\n                                <tr>\n                                    <td>Название компании:</td>\n                                    <td>{{vm.user.name}}</td>\n                                </tr>\n                                <tr>\n                                    <td>Контактный email:</td>\n                                    <td>{{vm.user.email}}</td>\n                                </tr>\n                                <tr>\n                                    <td>Контактный телефон:</td>\n                                    <td>{{vm.user.phone}}</td>\n                                </tr>\n                                <tr>\n                                    <td>Username:</td>\n                                    <td>{{vm.user.username}}</td>\n                                </tr>\n                                <tr>\n                                    <td>О вас:</td>\n                                    <td>{{vm.user.about}}</td>\n                                </tr>\n                            </table>\n                            <img ng-if="vm.dataLoading"\n                                 src="data:image/gif;base64,R0lGODlhEAAQAPIAAP///wAAAMLCwkJCQgAAAGJiYoKCgpKSkiH/C05FVFNDQVBFMi4wAwEAAAAh/hpDcmVhdGVkIHdpdGggYWpheGxvYWQuaW5mbwAh+QQJCgAAACwAAAAAEAAQAAADMwi63P4wyklrE2MIOggZnAdOmGYJRbExwroUmcG2LmDEwnHQLVsYOd2mBzkYDAdKa+dIAAAh+QQJCgAAACwAAAAAEAAQAAADNAi63P5OjCEgG4QMu7DmikRxQlFUYDEZIGBMRVsaqHwctXXf7WEYB4Ag1xjihkMZsiUkKhIAIfkECQoAAAAsAAAAABAAEAAAAzYIujIjK8pByJDMlFYvBoVjHA70GU7xSUJhmKtwHPAKzLO9HMaoKwJZ7Rf8AYPDDzKpZBqfvwQAIfkECQoAAAAsAAAAABAAEAAAAzMIumIlK8oyhpHsnFZfhYumCYUhDAQxRIdhHBGqRoKw0R8DYlJd8z0fMDgsGo/IpHI5TAAAIfkECQoAAAAsAAAAABAAEAAAAzIIunInK0rnZBTwGPNMgQwmdsNgXGJUlIWEuR5oWUIpz8pAEAMe6TwfwyYsGo/IpFKSAAAh+QQJCgAAACwAAAAAEAAQAAADMwi6IMKQORfjdOe82p4wGccc4CEuQradylesojEMBgsUc2G7sDX3lQGBMLAJibufbSlKAAAh+QQJCgAAACwAAAAAEAAQAAADMgi63P7wCRHZnFVdmgHu2nFwlWCI3WGc3TSWhUFGxTAUkGCbtgENBMJAEJsxgMLWzpEAACH5BAkKAAAALAAAAAAQABAAAAMyCLrc/jDKSatlQtScKdceCAjDII7HcQ4EMTCpyrCuUBjCYRgHVtqlAiB1YhiCnlsRkAAAOwAAAAAAAAAAAA=="/>\n                        </div>\n                    </div>\n                </div>\n            </div>\n        </div>\n    </div>\n    <div class="modal fade" id="myModal" role="dialog">\n        <div class="modal-dialog">\n\n            <!-- Modal content-->\n            <div class="modal-content">\n                <div class="modal-header">\n                    <button type="button" class="close" data-dismiss="modal">&times;</button>\n                    <h4 class="modal-title">Редактирование</h4>\n                </div>\n                <form name="form" ng-submit="vm.edit()" role="form"\n                      style="padding-left: 10px; padding-right: 10px">\n                    <div class="form-group" ng-class="{ \'has-error\': form.name.$dirty && form.name.$error.required }">\n                        <label for="name">Имя</label>\n                        <input type="text" name="name" id="name" class="form-control" ng-model="vm.user.name"\n                               required/>\n                        <span ng-show="form.name.$dirty && form.name.$error.required" class="help-block">Имя - обязательное поле</span>\n                    </div>\n                    <div class="form-group" ng-class="{ \'has-error\': form.email.$dirty && form.email.$error.required }">\n                        <label for="email">Email</label>\n                        <input type="text" name="email" id="email" class="form-control" ng-model="vm.user.email"\n                               required/>\n                        <span ng-show="form.email.$dirty && form.email.$error.required"\n                              class="help-block">Email - обязательное поле</span>\n                    </div>\n                    <div class="form-group"\n                         ng-class="{ \'has-error\': form.phone.$dirty && form.phone.$error.required }">\n                        <label for="phone">Телефона</label>\n                        <input type="text" name="phone" id="phone" class="form-control"\n                               ng-model="vm.user.phone" required/>\n                        <span ng-show="form.phone.$dirty && form.phone.$error.required" class="help-block">Телефон - обязательное поле</span>\n                    </div>\n                    <div class="form-group" ng-class="{ \'has-error\': form.about.$dirty && form.about.$error.required }">\n                        <label for="about">О вас</label>\n                        <input type="text" name="about" id="about" class="form-control" ng-model="vm.user.about"\n                               required/>\n                        <span ng-show="form.about.$dirty && form.about.$error.required"\n                              class="help-block">О вас - обязательное поле</span>\n                    </div>\n                    <div class="modal-footer">\n                        <button ng-click="vm.edit()" type="submit" class="btn btn-default" data-dismiss="modal">\n                            Принять\n                        </button>\n                    </div>\n                </form>\n\n            </div>\n\n        </div>\n    </div>\n    <div class="modal fade" id="passwordModal" role="dialog">\n        <div class="modal-dialog">\n\n            <!-- Modal content-->\n            <div class="modal-content">\n                <div class="modal-header">\n                    <button type="button" class="close" data-dismiss="modal">&times;</button>\n                    <h4 class="modal-title">Смена пароля</h4>\n                </div>\n                <form name="form" ng-submit="vm.changePassword()" role="form"\n                      style="padding-left: 10px; padding-right: 10px">\n                    <div class="form-group" ng-class="{ \'has-error\': form.newPass.$dirty && form.newPass.$error.required }">\n                        <label for="newPass">Новый пароль</label>\n                        <input type="password" name="newPass" id="newPass" class="form-control" ng-model="vm.password.password"\n                               required/>\n                        <span ng-show="form.newPass.$dirty && form.newPass.$error.required" class="help-block">Обязательное поле</span>\n                    </div>\n                    <div class="modal-footer">\n                        <button ng-click="vm.changePassword()" type="submit" class="btn btn-default" data-dismiss="modal">\n                            Принять\n                        </button>\n                    </div>\n                </form>\n\n            </div>\n\n        </div>\n    </div>\n</div>\n\n';
},{}],76:[function(require,module,exports){
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
        service.changePassword = changePassword;

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
            return $http.put(REST_SERVICE_URI + 'rest/update/user/' + user.idUser, user).then(handleSuccess, handleError('Error updating user'));
        }

        function changePassword(user, password) {
            return $http.put(REST_SERVICE_URI + 'rest/update/user/password/' + user.idUser, password).then(handleSuccess, handleError('Error updating user'));
        }

        function Delete(id) {
            return $http.delete(REST_SERVICE_URI + 'rest/delete/user/' + id).then(handleSuccess, handleError('Error deleting user'));
        }

        function handleSuccess(res) {
            return {
                success: true,
                data: res.data,
                message: "Операция выполнена успешно!"
            };
        }

        function handleError(error) {
            return function () {
                return {success: false, message: error};
            };
        }

    }
];
},{}],77:[function(require,module,exports){
'use strict';

module.exports = [
    '$stateProvider',
    function ($stateProvider) {
        $stateProvider
            .state('user-stat', {
                url: '/user-stat',
                controller: 'UserStatController',
                controllerAs: 'vm',
                template: require('./template.html'),
                data: {
                    authorizedRoles: ['USER', 'ADMIN']
                }
            });
    }
];

},{"./template.html":80}],78:[function(require,module,exports){
'use strict';

module.exports = [
    'statService',
    'authService',
    function (statService, authService) {
        var vm = this;

        vm.data = [];
        vm.userData = {};
        vm.dataLoading = false;
        vm.isAdmin = isAdmin;
        initController();

        function initController() {
            vm.dataLoading = true;
            loadData();
        }

        vm.amountOfPaymentsChart = {};
        vm.amountOfPaymentsChart.type = "BarChart";

        vm.countOfPaymentsChart = {};
        vm.countOfPaymentsChart.type = "BarChart";

        vm.amountOfPayments = [];
        vm.countOfPayments = [];

        function loadData() {
            statService.getUsersStat()
                .then(function (stats) {
                    vm.data = stats.data;
                    loadCharts();
                    vm.dataLoading = false;
                });
            statService.getCurrentUserStat()
                .then(function (stats) {
                    vm.userData = stats.data;
                    vm.dataLoading = false;
                });
        }

        function loadCharts() {
            for (var i = 0; i < vm.data.length; i++) {
                var userDataAmount = {};
                var userDataCounts = {};
                userDataCounts.c = [
                    {v: vm.data[i].user.name},
                    {v: Number(vm.data[i].countOfPayments)}
                ];
                userDataAmount.c = [
                    {v: vm.data[i].user.name},
                    {v: Number(vm.data[i].amountOfPayments)}
                ];
                vm.countOfPayments.push(userDataCounts);
                vm.amountOfPayments.push(userDataAmount);
            }

            vm.countOfPaymentsChart.data = {
                "cols": [
                    {id: "t", label: "Topping", type: "string"},
                    {id: "s", label: "", type: "number"}
                ],
                "rows": vm.countOfPayments
            };

            vm.countOfPaymentsChart.options = {
                'title': 'Стастика по частоте покупок пользователями'
            };

            vm.amountOfPaymentsChart.data = {
                "cols": [
                    {id: "t", label: "Topping", type: "string"},
                    {id: "s", label: "$", type: "number"}
                ],
                "rows": vm.amountOfPayments
            };

            vm.amountOfPaymentsChart.options = {
                'title': 'Стастика по приносимой пользователями прибыли'
            };
        }

        function isAdmin() {
            return authService.checkRole(['ADMIN']);
        }
    }
];

},{}],79:[function(require,module,exports){
(function (global){
'use strict';

var angular = (typeof window !== "undefined" ? window.angular : typeof global !== "undefined" ? global.angular : null);

angular
    .module('User.Statistics', ['googlechart'])
    .config(require('./config'))
    .controller('UserStatController', require('./controller'));
}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./config":77,"./controller":78}],80:[function(require,module,exports){
module.exports = '<div class="container" ng-if="vm.isAdmin()" style="margin-top:70px">\n    <div id="wrapper" class="toggled">\n        <div id="page-content-wrapper">\n            <ul class="breadcrumb">\n                <li><a href="#/users">Пользователи</a></li>\n                <li class="active">Статистика</li>\n            </ul>\n            <div class="container-fluid" align="center">\n                <div ng-if="!vm.dataLoading" class="row">\n                    <div class="col-lg-5">\n                        <div google-chart chart="vm.amountOfPaymentsChart" style="height:600px; width:100%;"></div>\n                    </div>\n                    <div class="col-lg-5">\n                        <div google-chart chart="vm.countOfPaymentsChart" style="height:600px; width:100%;"></div>\n                    </div>\n                </div>\n                <div ng-if="vm.dataLoading" class="row vertical-center-row">\n                    <div class="text-center col-md-4 col-md-offset-4">\n                        <i class="fa fa-spinner fa-pulse fa-5x fa-fw"></i>\n                        <span class="sr-only">Loading...</span>\n                    </div>\n                </div>\n            </div>\n        </div>\n    </div>\n</div>\n<div class="container" ng-if="!vm.isAdmin()">\n    <div class="jumbotron">\n        <ul class="breadcrumb">\n            <li><a href="#/user-profile">Личный кабинет</a></li>\n            <li class="active">Статистика</li>\n        </ul>\n        <h1>Ваша статистика:</h1>\n        <h3>Потраченнные деньги: {{vm.userData.amountOfPayments}}$</h3>\n        <h3>Количество совершенных покупок: {{vm.userData.countOfPayments}}</h3>\n    </div>\n</div>\n\n';
},{}]},{},[2]);
