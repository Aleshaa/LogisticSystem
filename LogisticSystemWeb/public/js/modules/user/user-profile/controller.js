'use strict';

module.exports = [
    'userService',
    function (userService) {
        var vm = this;

        vm.user = {};
        //vm.edit = edit;

        initController();

        function initController() {
            loadUser();
        }

        function loadUser() {
            userService.getCurrentUser()
                .then(function (users) {
                    vm.user = users.data;
                });
        }
    }
];
