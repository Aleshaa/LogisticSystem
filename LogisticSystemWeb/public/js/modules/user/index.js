'use strict';

var angular = require('angular');
require('./user-profile');

angular
    .module('User',
        [
            'User.Profile'
        ])
    .config(require('./config'))
    .controller('UserController', require('./controller'))
    .service('userService', require('./user-service'));
