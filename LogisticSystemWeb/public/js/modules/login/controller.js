'use strict';

module.exports = [
    '$scope',
    '$location',
    'authService',
    'flashService',
    function ($scope, $location, authenticationService, flashService) {
        var vm = this;

        vm.login = login;

        (function initController() {
            authenticationService.clearCredentials();
        })();

        function login() {
            vm.dataLoading = true;
            //authenticationService.setCredentials(vm.username, vm.password);
            authenticationService.login(vm.username, vm.password, function (response) {
                if (response.success) {
                    authenticationService.setCredentials(vm.username, vm.password);
                    $location.path('/');
                } else {
                    authenticationService.clearCredentials();
                    flashService.error(response.message);
                    vm.dataLoading = false;
                }
            });
        }
    }
];

