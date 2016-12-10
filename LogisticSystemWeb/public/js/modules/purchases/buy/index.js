'use strict';

var angular = require('angular');
require('./buy-stat');

angular
    .module('Purchases.Buys',
        [
        'Buys.Stat'
        ])
    .config(require('./config'))
    .controller('BuyController', require('./controller'))
    .service('buyService', require('./buy-service'));
