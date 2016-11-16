'use strict';

var domready = require('domready');
var angular = require('angular');

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
