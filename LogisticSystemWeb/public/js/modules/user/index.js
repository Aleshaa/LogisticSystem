'use strict';

var angular = require('angular');
require('./user-profile');
require('./user-stat');

angular
    .module('User',
        [
            'User.Profile',
            'User.Statistics'
        ])
    .config(require('./config'))
    .controller('UserController', require('./controller'))
    .service('userService', require('./user-service'));
