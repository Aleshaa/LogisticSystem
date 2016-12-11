'use strict';

module.exports = [
    '$location',
    'userService',
    'flashService',
    'authService',
    function ($location, userService, flashService, authService) {
        var vm = this;

        vm.user = {};
        vm.dataLoading = false;
        vm.password = {};
        vm.changePassword = changePassword;

        vm.edit = edit;

        initController();

        function initController() {
            vm.dataLoading = true;
            loadUser();
        }

        function loadUser() {
            userService.getCurrentUser()
                .then(function (users) {
                    vm.user = users.data;
                    vm.dataLoading = false;
                });
        }

        function edit() {
            vm.dataLoading = true;
            userService.update(vm.user)
                .then(function (response) {
                    if (response.success) {
                        loadUser();
                        vm.dataLoading = false;
                    } else {
                        flashService.Error(response.message);
                        vm.dataLoading = false;
                        console.log("Что-то пошло не так")
                    }
                });
        }

        function changePassword() {
            vm.dataLoading = true;
            userService.changePassword(vm.user, vm.password)
                .then(function (response) {
                    if (response.success) {
                        authService.ClearCredentials();
                        vm.dataLoading = false;
                        $location.path('/login');
                    } else {
                        flashService.Error(response.message);
                        vm.dataLoading = false;
                        console.log("Что-то пошло не так")
                    }
                });
        }
    }
];
