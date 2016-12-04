'use strict';

var angular = require('angular');
require('./buy');

angular
    .module('Purchases',
        [
            'Purchases.Buys'
        ])
    .config(require('./config'))
    .controller('PurchaseController', require('./controller'))
    .service('purchaseService', require('./purchase-service'));
