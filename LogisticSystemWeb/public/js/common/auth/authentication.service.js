﻿'use strict';

var angular = require('angular');

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