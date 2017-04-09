'use strict';

module.exports = [
    '$scope',
    '$location',
    'userService',
    'flashService',
    function ($scope, $location, userService, flashService) {
        var vm = this;

        vm.register = register;

        function register() {
            vm.dataLoading = true;
            vm.user.role = {
                idRole: 2,
                nameRole: 'USER'
            };
            userService.create(vm.user)
                .then(function (response) {
                    if (response.success) {
                        flashService.success('Регистрация прошла успешно!', true);
                        $location.path('/login');
                    } else {
                        flashService.error(response.message);
                        vm.dataLoading = false;
                    }
                });
        }
    }
];

