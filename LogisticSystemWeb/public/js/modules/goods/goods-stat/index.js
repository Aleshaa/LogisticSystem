'use strict';

var angular = require('angular');

angular
    .module('Goods.Statistics', ['googlechart'])
    .config(require('./config'))
    .controller('StatsController', require('./controller'));