'use strict';

var angular = require('angular');

angular
    .module('Registration', [])
    .config(require('./config'))
    .run(require('../run'))
    .controller('RegistrationController', require('./controller'));
