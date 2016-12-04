'use strict';

var angular = require('angular');

angular
    .module('Purchases.Buys', [])
    .config(require('./config'))
    .controller('BuyController', require('./controller'))
    .service('buyService', require('./buy-service'));
