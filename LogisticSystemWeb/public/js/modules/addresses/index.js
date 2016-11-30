'use strict';

var angular = require('angular');

angular
    .module('Addresses', [])
    .config(require('./config'))
    .controller('AddressController', require('./controller'))
    .service('addressService', require('./addresses-service'));
