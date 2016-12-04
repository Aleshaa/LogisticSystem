'use strict';

module.exports = [
    '$scope',
    'userService',
    function ($scope, UserService) {
        var vm = this;

        vm.user = null;
        vm.allUsers = [];

        initController();

        function initController() {
            loadCurrentUser();
        }

        function loadCurrentUser() {
            UserService.getCurrentUser()
                .then(function (user) {
                    vm.user = user.data;
                });
        }
    }
];