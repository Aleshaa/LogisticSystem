'use strict';

var angular = require('angular');

angular
    .module('User.Statistics', ['googlechart'])
    .config(require('./config'))
    .controller('UserStatController', require('./controller'));