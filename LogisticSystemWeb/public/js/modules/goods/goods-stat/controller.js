'use strict';

module.exports = [
    'statService',
    'authService',
    function (statService, authService) {
        var vm = this;

        vm.data = [];
        vm.userData = [];
        vm.dataLoading = false;
        vm.isAdmin = isAdmin;
        initController();

        function initController() {
            vm.dataLoading = true;
            loadData();
        }

        vm.goodsProfitChart = {};
        vm.goodsProfitChart.type = "PieChart";

        vm.goodsCountChart = {};
        vm.goodsCountChart.type = "BarChart";

        vm.goodsProfit = [];
        vm.goodsCount = [];

        function loadData() {
            if (isAdmin()) {
                statService.getGoodsStat()
                    .then(function (stats) {
                        vm.data = stats.data;
                        loadCharts();
                        vm.dataLoading = false;
                    });
            }
            else {
                statService.getGoodsStatForCurrentUser()
                    .then(function (stats) {
                        vm.data = stats.data;
                        loadCharts();
                        vm.dataLoading = false;
                    });
            }
        }

        function loadCharts() {
            for (var i = 0; i < vm.data.length; i++) {
                var goodsDataProfit = {};
                var goodsDataCount = {};
                goodsDataCount.c = [
                    {v: vm.data[i].goods.name},
                    {v: Number(vm.data[i].countOfPurchases)}
                ];
                goodsDataProfit.c = [
                    {v: vm.data[i].goods.name},
                    {v: Number(vm.data[i].broughtProfit)}
                ];
                vm.goodsProfit.push(goodsDataProfit);
                vm.goodsCount.push(goodsDataCount);
            }

            vm.goodsProfitChart.data = {
                "cols": [
                    {id: "t", label: "Topping", type: "string"},
                    {id: "s", label: "$", type: "number"}
                ],
                "rows": vm.goodsProfit
            };

            vm.goodsProfitChart.options = {
                'title': 'Круговая диаграмма распределения прибыли по товарам'
            };

            vm.goodsCountChart.data = {
                "cols": [
                    {id: "t", label: "Topping", type: "string"},
                    {id: "s", label: "количество", type: "number"}
                ],
                "rows": vm.goodsCount
            };

            vm.goodsCountChart.options = {
                'title': 'Столбчатая диаграмма популярности товаров'
            };
        }

        function isAdmin() {
            return authService.checkRole(['ADMIN']);
        }
    }
];
