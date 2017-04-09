'use strict';

module.exports = [
    'authService',
    'userService',
    'purchaseService',
    function (authService, userService, purchaseService) {

        var vm = this;
        var flag = false;

        vm.refresh = refresh;
        vm.isAuth = isAuth;
        vm.isAdmin = isAdmin;
        vm.isUser = isUser;
        vm.logout = logout;

        vm.isCollapsed = true;
        vm.authStatus = false;
        vm.countNonConfirmPurchases = 0;
        vm.user = {};

        setTimeout(initController(), 1000);

        function initController() {
            getCurrentUser();
            getCountOfNonConfirm();
        }

        function getCurrentUser() {
            console.log("Get current user function called");
            userService.getCurrentUser()
                .then(function (user) {
                    if (user.success) {
                        vm.user = user.data;
                        console.log("Current user: " + user.data);
                    }
                    else {
                        vm.authStatus = false;
                        flag = false;
                        console.log(user.message);
                        authService.clearCredentials();
                    }
                });
        }

        function getCountOfNonConfirm() {
            purchaseService.getCountOfNonConfirm()
                .then(function (count) {
                    if (count.success) {
                        vm.countNonConfirmPurchases = count.data;
                    } else {
                        console.log(count.message);
                    }
                });
        }

        function refresh() {
            getCurrentUser();
            getCountOfNonConfirm();
        }

        function isAuth() {
            if (!vm.authStatus) {
                vm.authStatus = authService.isAuth();
            }
            if (vm.authStatus && !flag) {
                getCurrentUser();
                getCountOfNonConfirm();
                flag = true;
            }
            return vm.authStatus;
        }

        function isAdmin() {
            return authService.checkRole(['ADMIN']);
        }

        function isUser() {
            return authService.checkRole(['USER']);
        }

        function logout() {
            vm.authStatus = false;
            flag = false;
            return authService.clearCredentials();
        }

    }
];
