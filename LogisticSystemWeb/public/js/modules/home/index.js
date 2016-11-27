'use strict';

var angular = require('angular');

angular
    .module('Home', [])
    .config(require('./config'))
    .run(require('../run'))
    .directive('topMenu', require('./top-menu/directive'))
    .controller('HomeController', require('./controller'));
