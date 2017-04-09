'use strict';

module.exports = [
    '$scope',
    'userService',
    'flashService',
    function ($scope, UserService, flashService) {
        var vm = this;

        vm.user = null;

        initController();

        function initController() {
            loadCurrentUser();
        }

        function loadCurrentUser() {
            UserService.getCurrentUser()
                .then(function (user) {
                    vm.user = user.data;
                    flashService.hideLoading();
                });
        }
    }
];