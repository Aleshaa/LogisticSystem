'use strict';

module.exports = [
    '$scope',
    'goodsService',
    'addressService',
    'authService',
    'supplierService',
    'supplyService',
    function ($scope, goodsService, addressService, authService, supplierService, supplyService) {
        var vm = this;

        vm.goods = [];
        vm.newGoods = {};
        vm.currentGoods = {};
        /*vm.addresses = [];*/
        vm.suppliers = [];
        vm.newSupply = {};
        vm.creationForm = false;
        vm.editionForm = false;
        vm.orderForm = false;
        vm.dataLoading = true;
        vm.showEditForm = showEditForm;
        vm.showCreationForm = showCreationForm;
        vm.remove = remove;
        vm.formAction = formAction;
        vm.isAdmin = isAdmin;
        vm.showOrderForm = showOrderForm;

        initController();

        function formAction() {
            vm.dataLoading = true;
            if (vm.editionForm) {
                edit();
            }
            else if (vm.creationForm) {
                create();
            }
            else if (vm.orderForm) {
                createSupply();
            }
        }

        function initController() {
            loadAllGoods();
            loadAllSuppliers();
            vm.dataLoading = false;
            vm.newGoods = {};
        }

        function isAdmin() {
            return authService.checkRole(['ADMIN']);
        }

        function showCreationForm() {
            vm.newGoods = {};
            vm.creationForm = true;
            vm.editionForm = false;
        }

        function showEditForm(goods) {
            vm.newGoods = goods;
            vm.editionForm = true;
            vm.creationForm = false;
        }

        function showOrderForm(goods) {
            vm.currentGoods = goods;
            vm.orderForm = true;
        }


        function remove(idGoods) {
            vm.dataLoading = true;
            goodsService.Delete(idGoods)
                .then(function (response) {
                    if (response.success) {
                        loadAllGoods();
                        vm.dataLoading = false;
                    } else {
                        console.log("Что-то пошло не так")
                    }
                });
        }

        function create() {
            vm.newGoods.quantity = 0;
            goodsService.create(vm.newGoods)
                .then(function (response) {
                    if (response.success) {
                        loadAllGoods();
                        vm.creationForm = false;
                        vm.newGoods = {};
                        vm.dataLoading = false;
                    } else {
                        console.log("Что-то пошло не так")
                    }
                });
        }

        function edit() {
            vm.newGoods.quantity = 0;
            goodsService.update(vm.newGoods)
                .then(function (response) {
                    if (response.success) {
                        loadAllGoods();
                        vm.editionForm = false;
                        vm.newGoods = {};
                        vm.dataLoading = false;
                    } else {
                        console.log("Что-то пошло не так")
                    }
                });
        }

        function loadAllGoods() {
            goodsService.getAll()
                .then(function (goods) {
                    vm.goods = goods.data;
                    for (var i = 0; i < vm.goods.length; i++) {
                        loadAddresses(i);
                    }
                });
        }

        function loadAddresses(i) {
            addressService.getStoresForCurrentGoods(vm.goods[i].idGoods)
                .then(function (addresses) {
                    vm.goods[i].addresses = [];
                    vm.goods[i].addresses = addresses.data;
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
            delete vm.newSupply.supplier;
            var date = new Date();
            vm.newSupply.date = date.getFullYear() + "-" +
                ((date.getMonth() + 1) < 10 ? ("0" + (date.getMonth() + 1)) : (date.getMonth() + 1)) + "-" +
                (date.getDate() < 10 ? ("0" + date.getDate()) : date.getDate());
            supplyService.create(vm.newSupply, idSupplier, idGoods)
                .then(function (response) {
                    if (response.success) {
                        loadAllGoods();
                        vm.creationForm = false;
                        vm.orderForm = false;
                        vm.currentGoods = {};
                        vm.newSupply = {};
                        vm.dataLoading = false;
                    } else {
                        console.log(response.message)
                    }
                });
        }

        /*function loadAllAddresses() {
         addressService.getAll()
         .then(function (addresses) {
         vm.addresses = addresses.data;
         })
         }*/
    }
];
