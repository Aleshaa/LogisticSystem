'use strict';

var angular = require('angular');

angular
    .module('User', [])
    .config(require('./config'))
    .controller('UserController', require('./controller'))
    .service('userService', require('./user-service'));
