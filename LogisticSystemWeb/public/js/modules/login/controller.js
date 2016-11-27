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
            authenticationService.ClearCredentials();
        })();

        function login() {
            vm.dataLoading = true;
            authenticationService.SetCredentials(vm.username, vm.password);
            authenticationService.Login(vm.username, vm.password, function (response) {
                if (response.success) {
                    authenticationService.SetCredentials(vm.username, vm.password);
                    $location.path('/');
                } else {
                    authenticationService.ClearCredentials();
                    flashService.Error(response.message);
                    vm.dataLoading = false;
                }
            });
        }
    }
];

