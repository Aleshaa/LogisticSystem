'use strict';

var angular = require('angular');

angular
    .module('Login', [])
    .config(require('./config'))
    .controller('LoginController', require('./controller'));
