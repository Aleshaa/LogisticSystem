'use strict';

var angular = require('angular');

angular
    .module('Goods.Supplier', [])
    .config(require('./config'))
    .controller('SupplierController', require('./controller'))
    .service('supplierService', require('./supplier-service'));
