'use strict';

module.exports = [
    '$scope',
    'addressService',
    'userService',
    function ($scope, addressService, userService) {
        var vm = this;

        vm.stores = [];
        vm.newStore = {};
        vm.creationForm = false;
        vm.editionForm = false;
        vm.dataLoading = true;
        vm.currentUser = {};
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
            loadAllStores();
            getCurrentUser();
            vm.dataLoading = false;
            vm.newStore = {};
        }

        function showCreationForm() {
            vm.newStore = {};
            vm.creationForm = true;
            vm.editionForm = false;
        }

        function showEditForm(store) {
            vm.newStore = store;
            vm.editionForm = true;
            vm.creationForm = false;
        }


        function remove(idStore) {
            vm.dataLoading = true;
            addressService.Delete(idStore)
                .then(function (response) {
                    if (response.success) {
                        loadAllStores();
                        vm.dataLoading = false;
                    } else {
                        console.log("Что-то пошло не так")
                    }
                });
        }

        function create() {
            addressService.create(vm.newStore, vm.currentUser.idUser)
                .then(function (response) {
                    if (response.success) {
                        loadAllStores();
                        vm.creationForm = false;
                        vm.newStore = {};
                        vm.dataLoading = false;
                    } else {
                        console.log("Что-то пошло не так")
                    }
                });
        }

        function edit() {
            addressService.update(vm.newStore)
                .then(function (response) {
                    if (response.success) {
                        loadAllStores();
                        vm.editionForm = false;
                        vm.newStore = {};
                        vm.dataLoading = false;
                    } else {
                        console.log("Что-то пошло не так")
                    }
                });
        }

        function loadAllStores() {
            addressService.getAllStores()
                .then(function (stores) {
                    vm.stores = stores.data;
                });
        }

        function getCurrentUser() {
            userService.getCurrentUser()
                .then(function (user) {
                    vm.currentUser = user.data;
                });
        }
    }
];
