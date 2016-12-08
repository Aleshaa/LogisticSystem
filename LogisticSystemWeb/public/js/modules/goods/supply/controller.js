'use strict';

module.exports = [
    '$scope',
    'supplyService',
    'goodsService',
    'supplierService',
    'addressService',
    function ($scope, supplyService, goodsService, supplierService, addressService) {
        var vm = this;

        vm.supplies = [];
        vm.newSupply = {};
        vm.goods = [];
        vm.suppliers = [];
        vm.addresses = [];
        vm.creationForm = false;
        vm.editionForm = false;
        vm.dataLoading = true;
        vm.showEditForm = showEditForm;
        vm.showCreationForm = showCreationForm;
        vm.remove = remove;
        vm.formAction = formAction;

        initController();

        function formAction() {
            vm.dataLoading = true;
            if (vm.editionForm) {
                edit();
            }
            else if (vm.creationForm) {
                create();
            }
        }

        function initController() {
            loadAllSupplies();
            loadAllGoods();
            loadAllSuppliers();
            loadAllAddresses();
            vm.dataLoading = false;
            vm.newSupply = {};
        }

        function showCreationForm() {
            vm.newSupply = {};
            vm.creationForm = true;
            vm.editionForm = false;
        }

        function showEditForm(supply) {
            vm.newSupply = supply;
            vm.editionForm = true;
            vm.creationForm = false;
        }


        function remove(idSupply) {
            vm.dataLoading = true;
            supplyService.remove(idSupply)
                .then(function (response) {
                    if (response.success) {
                        loadAllSupplies();
                        vm.dataLoading = false;
                    } else {
                        console.log(response.message)
                    }
                });
        }

        function create() {
            var idGoods = vm.newSupply.goods;
            var idSupplier = vm.newSupply.supplier;
            var idAddress = vm.newSupply.address;
            delete vm.newSupply.goods;
            delete vm.newSupply.supplier;
            delete vm.newSupply.address;
            var date = new Date();
            vm.newSupply.date = date.getFullYear() + "-" +
                ((date.getMonth() + 1) < 10 ? ("0" + (date.getMonth() + 1)) : (date.getMonth() + 1)) + "-" +
                (date.getDate() < 10 ? ("0" + date.getDate()) : date.getDate());
            supplyService.create(vm.newSupply, idSupplier, idGoods, idAddress)
                .then(function (response) {
                    if (response.success) {
                        loadAllSupplies();
                        vm.creationForm = false;
                        vm.newSupply = {};
                        vm.dataLoading = false;
                    } else {
                        console.log(response.message)
                    }
                });
        }

        function edit() {
            supplyService.update(vm.newSupply)
                .then(function (response) {
                    if (response.success) {
                        loadAllSupplies();
                        vm.editionForm = false;
                        vm.newSupply = {};
                        vm.dataLoading = false;
                    } else {
                        console.log(response.message)
                    }
                });
        }

        function loadAllSupplies() {
            supplyService.getAll()
                .then(function (supplies) {
                    vm.supplies = supplies.data;
                });
        }

        function loadAllGoods() {
            goodsService.getAll()
                .then(function (goods) {
                    vm.goods = goods.data;
                });
        }

        function loadAllSuppliers() {
            supplierService.getAll()
                .then(function (suppliers) {
                    vm.suppliers = suppliers.data;
                });
        }

        function loadAllAddresses() {
            addressService.getAllStores()
                .then(function (addresses) {
                    vm.addresses = addresses.data;
                })
        }
    }
];
