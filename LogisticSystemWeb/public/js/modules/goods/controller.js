'use strict';

module.exports = [
    '$scope',
    'goodsService',
    function ($scope, goodsService) {
        var vm = this;

        vm.goods = [];
        vm.newGoods = {};
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
                });
        }
    }
];
