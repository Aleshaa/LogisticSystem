'use strict';

module.exports = [
    '$scope',
    '$state',
    'authService',
    'userService',
    'purchaseService',
    function ($scope, $state, authService, userService, purchaseService) {

        $scope.isCollapsed = true;
        $scope.authStatus = false;
        $scope.user = {};
        $scope.countNonConfirmPurchases = 0;

        setTimeout(initController(), 1000);

        function initController() {
            userService.getCurrentUser()
                .then(function (user) {
                    $scope.user = user.data;
                });
            purchaseService.getCountOfNonConfirm()
                .then(function (count) {
                    if (count.success) {
                        $scope.countNonConfirmPurchases = count.data;
                    } else {
                        console.log(count.message);
                    }
                });
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
