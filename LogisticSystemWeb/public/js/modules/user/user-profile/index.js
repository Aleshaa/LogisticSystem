'use strict';

var angular = require('angular');

angular
    .module('User.Profile', [])
    .config(require('./config'))
    .controller('ProfileController', require('./controller'));