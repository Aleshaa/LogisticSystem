'use strict';

var angular = require('angular');

angular
    .module('Home', [])
    .config(require('./config'))
    .controller('HomeController', require('./controller'));
