'use strict';

module.exports = [
    'statService',
    'authService',
    function (statService, authService) {
        var vm = this;

        vm.data = [];
        vm.userData = {};
        vm.isAdmin = isAdmin;
        initController();

        function initController() {
            loadData();
        }

        vm.amountOfPaymentsChart = {};
        vm.amountOfPaymentsChart.type = "BarChart";

        vm.countOfPaymentsChart = {};
        vm.countOfPaymentsChart.type = "BarChart";

        vm.amountOfPayments = [];
        vm.countOfPayments = [];

        function loadData() {
            statService.getUsersStat()
                .then(function (stats) {
                    vm.data = stats.data;
                    loadCharts();
                });
            statService.getCurrentUserStat()
                .then(function (stats) {
                    vm.userData = stats.data;
                })
        }

        function loadCharts() {
            for (var i = 0; i < vm.data.length; i++) {
                var userDataAmount = {};
                var userDataCounts = {};
                userDataCounts.c = [
                    {v: vm.data[i].user.name},
                    {v: Number(vm.data[i].countOfPayments)}
                ];
                userDataAmount.c = [
                    {v: vm.data[i].user.name},
                    {v: Number(vm.data[i].amountOfPayments)}
                ];
                vm.countOfPayments.push(userDataCounts);
                vm.amountOfPayments.push(userDataAmount);
            }

            vm.countOfPaymentsChart.data = {
                "cols": [
                    {id: "t", label: "Topping", type: "string"},
                    {id: "s", label: "", type: "number"}
                ],
                "rows": vm.countOfPayments
            };

            vm.countOfPaymentsChart.options = {
                'title': 'Стастика по частоте покупок пользователями'
            };

            vm.amountOfPaymentsChart.data = {
                "cols": [
                    {id: "t", label: "Topping", type: "string"},
                    {id: "s", label: "$", type: "number"}
                ],
                "rows": vm.amountOfPayments
            };

            vm.amountOfPaymentsChart.options = {
                'title': 'Стастика по приносимой пользователями прибыли'
            };
        }

        function isAdmin() {
            return authService.checkRole(['ADMIN']);
        }
    }
];
