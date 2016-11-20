'use strict';

var angular = require('angular');

module.exports = [
    '$http',
    '$cookieStore',
    '$rootScope',
    '$timeout',
    'userService',
    function ($http, $cookieStore, $rootScope, $timeout, userService) {
        var service = {};

        var REST_SERVICE_URI = 'http://localhost:8080';

        var userRole = "";
        service.Login = Login;
        service.SetCredentials = SetCredentials;
        service.ClearCredentials = ClearCredentials;

        return service;

        function Login(username, password, callback) {

            $http.get(REST_SERVICE_URI + '/rest/authenticate', {})
                .success(function (response) {
                    userRole = response.role.idRole;
                    response = {success: true};
                    callback(response);
                })
                .error(function (response, status) {
                    response = {success: false, message: 'Username or password is incorrect'};
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
            $cookieStore.put('globals', $rootScope.globals);
        }

        function ClearCredentials() {
            $rootScope.globals = {};
            $cookieStore.remove('globals');
            $http.defaults.headers.common.Authorization = 'Basic';
        }
    }
];