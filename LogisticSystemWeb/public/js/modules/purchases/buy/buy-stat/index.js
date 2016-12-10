'use strict';

var angular = require('angular');

angular
    .module('Buys.Stat', ['googlechart'])
    .config(require('./config'))
    .controller('BuyStatController', require('./controller'));