'use strict';

var angular = require('angular');

angular
    .module('Supplier', [])
    .config(require('./config'))
    .controller('SupplierController', require('./controller'))
    .service('supplierService', require('./supplier-service'));
