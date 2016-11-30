'use strict';

module.exports = [
    '$scope',
    '$state',
    'authService',
    'userService',
    function ($scope, $state, authService, userService) {

        $scope.isCollapsed = true;
        $scope.authStatus = false;
        $scope.user = {};

        setTimeout(initController(), 1000);

        function initController() {
            userService.getCurrentUser()
                .then(function (user) {
                    $scope.user = user.data;
                });
            /*$scope.user = authService.getAuthUser();*/
        }

        $scope.isAuth = function () {
            if (!$scope.authStatus)
                $scope.authStatus = authService.isAuth();
            return $scope.authStatus;
        };

        $scope.isAdmin = function () {
            return authService.checkRole(['ADMIN']);
        };

        $scope.isUser = function () {
            return authService.checkRole(['USER']);
        };

        $scope.logout = function () {
            $scope.authStatus = false;
            return authService.ClearCredentials();
        };
    }
];
