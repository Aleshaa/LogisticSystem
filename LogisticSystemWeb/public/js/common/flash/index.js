'use strict';

var angular = require('angular');

angular.module('Flash', [])
    .service('flashService', require('./flash.service'));
