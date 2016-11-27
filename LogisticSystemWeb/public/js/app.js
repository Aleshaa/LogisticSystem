'use strict';

var domready = require('domready');
var angular = require('angular');

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
