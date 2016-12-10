'use strict';

module.exports = [
    'statService',
    'authService',
    function (statService, authService) {
        var vm = this;

        vm.data = [];
        vm.dataLoading = true;
        vm.isAdmin = isAdmin;
        initController();

        function initController() {
            loadData();
        }

        vm.BuyChart = {};
        vm.BuyChart.type = "LineChart";

        function loadData() {
            statService.getBuysStat()
                .then(function (stats) {
                    getDataForCharts(stats.data);
                    loadCharts();
                    vm.dataLoading = false;
                });
        }

        function loadCharts() {

            vm.BuyChart.data = {
                "cols": [
                    {id: "t", label: "Дата", type: "date"},
                    {id: "s", label: "Количество", type: "number"}
                ],
                "rows": vm.data
            };

            vm.BuyChart.options = {
                title: 'График выполненых заказов',
                width: 900,
                height: 500,
                hAxis: {
                    format: 'MMM yyyy',
                    gridlines: {count: 15}
                },
                vAxis: {
                    gridlines: {color: 'none'},
                    minValue: 0
                }
            };
        }

        function isAdmin() {
            return authService.checkRole(['ADMIN']);
        }

        function getDataForCharts(stats) {
            for(var index in stats) {
                var buyDate = new Date(stats[index].date);
                var flag = true;
                for(var curIndex in vm.data) {
                    if (buyDate.getMonth() === vm.data[curIndex].c[0].v.getMonth() &&
                        buyDate.getYear() === vm.data[curIndex].c[0].v.getYear()) {
                        vm.data[curIndex].c[1].v++;
                        flag = false;
                    }
                }
                if (flag === true) {
                    vm.data.push(
                        {
                            c: [
                                {v: buyDate},
                                {v: 1}
                            ]
                        }
                    )
                }
            }
        }

    }
];
