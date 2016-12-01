'use strict';

var angular = require('angular');

angular
    .module('Goods.Supply', [])
    .config(require('./config'))
    .controller('SupplyController', require('./controller'))
    .service('supplyService', require('./supply-service'));
