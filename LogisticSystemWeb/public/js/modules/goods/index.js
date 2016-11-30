'use strict';

var angular = require('angular');

angular
    .module('Goods', [])
    .config(require('./config'))
    .controller('GoodsController', require('./controller'))
    .service('goodsService', require('./goods-service'));
