'use strict';

module.exports = [
    'purchaseService',
    'authService',
    'supplierService',
    'supplyService',
    'goodsService',
    'addressService',
    'buyService',
    function (purchaseService, authService, supplierService, supplyService, goodsService, addressService, buyService) {
        var vm = this;

        vm.suppliers = [];
        vm.addresses = [];
        vm.purchases = [];
        vm.newSupply = {};
        vm.currentGoods = {};
        vm.countOfNonComplete = 0;
        vm.orderForm = false;
        vm.dataLoading = true;
        vm.formAction = formAction;
        vm.getCountOfNonComplete = getCountOfNonComplete;
        vm.isAdmin = isAdmin;
        vm.showOrderForm = showOrderForm;
        vm.confirm = confirm;
        vm.remove = remove;

        initController();

        function initController() {
            getCountOfNonComplete();
            loadAllPurchases();
            loadAllSuppliers();
            loadAllAddresses();
            vm.dataLoading = false;
        }

        function formAction() {
            vm.dataLoading = true;
            if (vm.orderForm) {
                createSupply();
            }
        }

        function isAdmin() {
            return authService.checkRole(['ADMIN']);
        }

        function showOrderForm(goods) {
            vm.currentGoods = goods;
            vm.orderForm = true;
        }

        function confirm(idPurchase) {
            vm.dataLoading = true;
            purchaseService.confirm(idPurchase)
                .then(function (response) {
                    if (response.success) {
                        loadAllPurchases();
                        vm.dataLoading = false;
                    } else {
                        console.log(response.message)
                    }
                });
        }

        function remove(idPurchase) {
            vm.dataLoading = true;
            purchaseService.remove(idPurchase)
                .then(function (response) {
                    if (response.success) {
                        loadAllPurchases();
                        vm.dataLoading = false;
                    } else {
                        console.log("Что-то пошло не так")
                    }
                });
        }

        function loadAllPurchases() {
            purchaseService.getAll()
                .then(function (purchases) {
                    vm.purchases = purchases.data;
                });
        }

        function loadAllSuppliers() {
            supplierService.getAll()
                .then(function (suppliers) {
                    vm.suppliers = suppliers.data;
                });
        }

        function createSupply() {
            var idGoods = vm.currentGoods.idGoods;
            var idSupplier = vm.newSupply.supplier;
            var idAddress = vm.newSupply.address;
            delete vm.newSupply.supplier;
            delete vm.newSupply.address;
            var date = new Date();
            vm.newSupply.date = date.getFullYear() + "-" +
                ((date.getMonth() + 1) < 10 ? ("0" + (date.getMonth() + 1)) : (date.getMonth() + 1)) + "-" +
                (date.getDate() < 10 ? ("0" + date.getDate()) : date.getDate());
            supplyService.create(vm.newSupply, idSupplier, idGoods, idAddress)
                .then(function (response) {
                    if (response.success) {
                        loadAllPurchases();
                        vm.orderForm = false;
                        vm.currentGoods = {};
                        vm.newSupply = {};
                        vm.dataLoading = false;
                    } else {
                        console.log(response.message)
                    }
                });
        }

        function loadAllAddresses() {
            addressService.getAllStores()
                .then(function (addresses) {
                    vm.addresses = addresses.data;
                })
        }

        function getCountOfNonComplete() {
            buyService.getCountOfNonComplete()
                .then(function (count) {
                    if (count.success) {
                        vm.countOfNonComplete = count.data;
                    } else {
                        console.log(count.message);
                    }
                })
        }
    }
];
