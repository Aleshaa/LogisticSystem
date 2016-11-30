'use strict';

module.exports = [
    '$scope',
    'userService',
    '$rootScope',
    function ($scope, userService, $rootScope) {
        var vm = this;

        vm.user = null;
        vm.allUsers = [];
        vm.remove = remove;

        initController();

        function initController() {
            loadAllUsers();
        }

        function remove(idUser) {
            userService.Delete(idUser)
                .then(function (response) {
                    if (response.success) {
                        loadAllUsers();
                    } else {
                        console.log("Что-то пошло не так")
                    }
                });
        }

        function loadAllUsers() {
            userService.getAll()
                .then(function (users) {
                    vm.allUsers = users.data;
                });
        }
    }
];
