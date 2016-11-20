'use strict';

var angular = require('angular');

angular.module('Auth', [])
    .service('authService', require('./authentication.service'));
