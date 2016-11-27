'use strict';

var angular = require('angular');

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
