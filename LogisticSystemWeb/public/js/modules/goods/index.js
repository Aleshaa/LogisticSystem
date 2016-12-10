'use strict';

var angular = require('angular');
require('./supplier');
require('./supply');
require('./goods-stat');

angular
    .module('Goods',
        [
            'Goods.Supplier',
            'Goods.Supply',
            'Goods.Statistics'
        ])
    .config(require('./config'))
    .controller('GoodsController', require('./controller'))
    .service('goodsService', require('./goods-service'));
