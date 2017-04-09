'use strict';

module.exports = [
    '$scope',
    'userService',
    'flashService',

    function ($scope, userService, flashService) {
        var vm = this;

        vm.user = null;
        vm.dataLoading = true;
        vm.allUsers = [];
        vm.remove = remove;

        initController();

        function initController() {
            loadAllUsers();
            vm.dataLoading = false;
        }

        function remove(idUser) {
            vm.dataLoading = true;
            userService.Delete(idUser)
                .then(function (response) {
                    if (response.success) {
                        loadAllUsers();
                        flashService.success(response.message);
                        vm.dataLoading = false;
                    } else {
                        flashService.error(response.message);
                        vm.dataLoading = false;
                        console.log("Что-то пошло не так")
                    }
                });
        }

        function loadAllUsers() {
            userService.getAll()
                .then(function (users) {
                    vm.allUsers = users.data;
                    flashService.hideLoading();
                });
        }
    }
];
