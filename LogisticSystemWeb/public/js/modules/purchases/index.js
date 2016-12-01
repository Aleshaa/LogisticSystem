'use strict';

var angular = require('angular');

angular
    .module('Purchases', [])
    .config(require('./config'))
    .controller('PurchaseController', require('./controller'))
    .service('purchaseService', require('./purchase-service'));
