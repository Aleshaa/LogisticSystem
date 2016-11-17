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

//require project modules
            require('./modules/home');
            require('./modules/user');

            domready(function () {
                angular
                    .module('App', [
                        'ui.router',
                        'ui.bootstrap',
                        'LocalStorageModule',

                        'Request',
                        'Message',

                        'Home',
                        'User'
                    ]);
                angular.bootstrap(document, ['App']);
            });

        }).call(this, typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
    }, {"./common/message": 3, "./common/request": 6, "./modules/home": 10, "./modules/user": 14, "domready": 1}],
    3: [function (require, module, exports) {
        (function (global) {
            'use strict';

            var angular = (typeof window !== "undefined" ? window.angular : typeof global !== "undefined" ? global.angular : null);

            angular.module('Message', [])
                .service('messageService', require('./message-service'));

        }).call(this, typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
    }, {"./message-service": 4}],
    4: [function (require, module, exports) {
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
    5: [function (require, module, exports) {
        'use strict';

        module.exports = ['$httpProvider', function ($httpProvider) {
            $httpProvider.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';
            $httpProvider.defaults.headers.common['Content-Type'] = 'application/json';
        }];
    }, {}],
    6: [function (require, module, exports) {
        (function (global) {
            'use strict';

            var angular = (typeof window !== "undefined" ? window.angular : typeof global !== "undefined" ? global.angular : null);

            angular.module('Request', [])
                .provider('requestService', require('./provider'))
                .config(require('./config'));

        }).call(this, typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
    }, {"./config": 5, "./provider": 7}],
    7: [function (require, module, exports) {
        (function (global) {
            'use strict';

            var angular = (typeof window !== "undefined" ? window.angular : typeof global !== "undefined" ? global.angular : null);

            module.exports = function () {
                var apiUrl = 'http://api.testapi.com/v1/',
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
    8: [function (require, module, exports) {
        'use strict';

        module.exports = [
            '$stateProvider',
            function ($stateProvider) {
                $stateProvider
                    .state('home', {
                        url: '/',
                        template: require('./template.html'),
                        controller: 'HomeController'
                    });
            }
        ];


    }, {"./template.html": 11}],
    9: [function (require, module, exports) {
        'use strict';

        module.exports = [
            '$scope',
            function ($scope) {

            }
        ];

    }, {}],
    10: [function (require, module, exports) {
        (function (global) {
            'use strict';

            var angular = (typeof window !== "undefined" ? window.angular : typeof global !== "undefined" ? global.angular : null);

            angular
                .module('Home', [])
                .config(require('./config'))
                .controller('HomeController', require('./controller'));

        }).call(this, typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
    }, {"./config": 8, "./controller": 9}],
    11: [function (require, module, exports) {
        module.exports = '<div class="container-fluid">\n    Home!\n</div>\n';
    }, {}],
    12: [function (require, module, exports) {
        'use strict';

        module.exports = [
            '$stateProvider',
            function ($stateProvider) {
                $stateProvider
                    .state('users', {
                        url: '/users',
                        controller: 'UserController',
                        template: require('./template.html')
                    });
            }
        ];

    }, {"./template.html": 15}],
    13: [function (require, module, exports) {
        arguments[4][9][0].apply(exports, arguments)
    }, {"dup": 9}],
    14: [function (require, module, exports) {
        (function (global) {
            'use strict';

            var angular = (typeof window !== "undefined" ? window.angular : typeof global !== "undefined" ? global.angular : null);

            angular
                .module('User', [])
                .config(require('./config'))
                .controller('UserController', require('./controller'))
                .service('userService', require('./user-service'));

        }).call(this, typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
    }, {"./config": 12, "./controller": 13, "./user-service": 16}],
    15: [function (require, module, exports) {
        module.exports = '<div class="main-block max-block-width\n            col-lg-7 col-lg-offset-3\n            col-md-8 col-md-offset-2\n            col-sm-offset-10 col-sm-offset-1\n            col-xs-12">\n    <div class="jumbotron jumbotron-panel setting-block no-padding">\n        User Module\n    </div>\n\n</div>\n';
    }, {}],
    16: [function (require, module, exports) {
        'use strict';

        module.exports = [
            'requestService',
            function (requestService) {

                this.getUsers = function () {
                    return requestService
                        .get('users')
                        .then(function (response) {
                                return response;
                            }
                        );
                };

            }
        ];
    }, {}]
}, {}, [2]);
