'use strict';

module.exports = [
    '$scope',
    'goodsService',
    'addressService',
    function ($scope, goodsService, addressService) {
        var vm = this;

        vm.goods = [];
        vm.newGoods = {};
        /*vm.addresses = [];*/
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
            loadAllGoods();
            vm.dataLoading = false;
            vm.newGoods = {};
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

        /*function loadAllAddresses() {
         addressService.getAll()
         .then(function (addresses) {
         vm.addresses = addresses.data;
         })
         }*/
    }
];
