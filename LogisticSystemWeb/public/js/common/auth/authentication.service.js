'use strict';

var angular = require('angular');

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
        service.login = login;
        service.setCredentials = setCredentials;
        service.clearCredentials = clearCredentials;
        service.isAuth = isAuth;
        service.getAuthUser = getAuthUser;
        service.getCurrentUser = getCurrentUser;
        service.checkRole = checkRole;

        return service;

        function login(username, password, callback) {
            authStatus = false;
            setCredentials(username, password);
            $http.get(REST_SERVICE_URI + '/rest/authenticate', {})
                .success(function (response) {
                    userRole = response.role.nameRole;
                    response = {success: true};
                    authStatus = true;
                    clearCredentials();
                    console.info('success', response);
                    callback(response);
                })
                .error(function (response, status) {
                    response = {success: false, message: 'Имя пользователя или пароль неверны'};
                    clearCredentials();
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
                        console.log("Error on getting current user");
                        return {};
                    }
                });
        }

        function setCredentials(username, password) {
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
            if (localStorageService.get('globals')) {
                currentUser = localStorageService.get('globals').currentUser;
            }
            return authRoles.indexOf(currentUser.role) != -1 || authRoles == [];
        }

        function clearCredentials() {
            $rootScope.globals = {};
            localStorageService.remove('globals');
            $http.defaults.headers.common.Authorization = 'Basic';
        }
    }
];