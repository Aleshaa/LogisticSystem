'use strict';

module.exports = [
    '$scope',
    'userService',
    '$rootScope',
    function ($scope, UserService, $rootScope) {
        var vm = this;

        vm.user = null;
        vm.allUsers = [];

        initController();

        function initController() {
            loadCurrentUser();
            loadAllUsers();
        }

        function loadCurrentUser() {
            UserService.getCurrentUser()
                .then(function (user) {
                    vm.user = user.data;
                });
        }

        function loadAllUsers() {
            UserService.getAll()
                .then(function (users) {
                    vm.allUsers = users.data;
                });
        }
    }
];