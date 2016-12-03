'use strict';

module.exports = [
    'buyService',
    'authService',
    function (buyService, authService) {
        var vm = this;

        vm.buys = [];
        vm.dataLoading = true;
        vm.isAdmin = isAdmin;
        vm.confirm = confirm;
        vm.remove = remove;

        initController();

        function initController() {
            loadAllBuys();
            vm.dataLoading = false;
        }

        function isAdmin() {
            return authService.checkRole(['ADMIN']);
        }

        function confirm(idBuy) {
            vm.dataLoading = true;
            buyService.confirm(idBuy)
                .then(function (response) {
                    if (response.success) {
                        loadAllBuys();
                        vm.dataLoading = false;
                    } else {
                        console.log(response.message)
                    }
                });
        }

        function remove(idPurchase) {
            vm.dataLoading = true;
            buyService.remove(idPurchase)
                .then(function (response) {
                    if (response.success) {
                        loadAllBuys();
                        vm.dataLoading = false;
                    } else {
                        console.log("Что-то пошло не так")
                    }
                });
        }

        function loadAllBuys() {
            buyService.getAll()
                .then(function (buys) {
                    vm.buys = buys.data;
                });
        }
    }
];
