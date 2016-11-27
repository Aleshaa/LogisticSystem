'use strict';

var angular = require('angular');

angular
    .module('Login', [])
    .config(require('./config'))
    .run(require('../run'))
    .controller('LoginController', require('./controller'));
