'use strict';

var angular = require('angular');

angular.module('Request', [])
    .provider('requestService', require('./provider'))
    .config(require('./config'));
