'use strict';

var angular = require('angular');

angular.module('Message', [])
    .service('messageService', require('./message-service'));
