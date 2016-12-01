'use strict';

var angular = require('angular');
require('./supplier');
require('./supply');

angular
    .module('Goods',
        [
            'Goods.Supplier',
            'Goods.Supply'
        ])
    .config(require('./config'))
    .controller('GoodsController', require('./controller'))
    .service('goodsService', require('./goods-service'));
