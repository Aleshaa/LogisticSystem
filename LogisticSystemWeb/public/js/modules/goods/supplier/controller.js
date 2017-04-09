'use strict';

module.exports = [
    '$scope',
    'supplierService',
    'flashService',
    function ($scope, supplierService, flashService) {
        var vm = this;

        vm.suppliers = [];
        vm.newSupplier = {};
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
            loadAllSuppliers();
            vm.dataLoading = false;
            vm.newSupplier = {};
        }

        function showCreationForm() {
            vm.newSupplier = {};
            vm.creationForm = true;
            vm.editionForm = false;
        }

        function showEditForm(supplier) {
            vm.newSupplier = supplier;
            vm.editionForm = true;
            vm.creationForm = false;
        }


        function remove(idSupplier) {
            vm.dataLoading = true;
            supplierService.remove(idSupplier)
                .then(function (response) {
                    if (response.success) {
                        loadAllSuppliers();
                        flashService.success(response.message);
                        vm.dataLoading = false;
                    } else {
                        flashService.error(response.message);
                        vm.dataLoading = false;
                        console.log("Что-то пошло не так")
                    }
                });
        }

        function create() {
            supplierService.create(vm.newSupplier)
                .then(function (response) {
                    if (response.success) {
                        loadAllSuppliers();
                        vm.creationForm = false;
                        vm.newSupplier = {};
                        flashService.success(response.message);
                        vm.dataLoading = false;
                    } else {
                        flashService.error(response.message);
                        vm.dataLoading = false;
                        console.log("Что-то пошло не так")
                    }
                });
        }

        function edit() {
            supplierService.update(vm.newSupplier)
                .then(function (response) {
                    if (response.success) {
                        loadAllSuppliers();
                        vm.editionForm = false;
                        vm.newSupplier = {};
                        flashService.success(response.message);
                        vm.dataLoading = false;
                    } else {
                        flashService.error(response.message);
                        vm.dataLoading = false;
                        console.log("Что-то пошло не так")
                    }
                });
        }

        function loadAllSuppliers() {
            supplierService.getAll()
                .then(function (suppliers) {
                    vm.suppliers = suppliers.data;
                    flashService.hideLoading();
                });
        }
    }
];
