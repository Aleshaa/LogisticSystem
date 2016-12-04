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
        var flag = false;
        $scope.countNonConfirmPurchases = 0;
        $scope.user = {};

        setTimeout(initController(), 1000);

        function initController() {
            getCurrentUser();
            getCountOfNonConfirm();
        }

        function getCurrentUser() {
            userService.getCurrentUser()
                .then(function (user) {
                    $scope.user = user.data;
                });
        }

        function getCountOfNonConfirm() {
            purchaseService.getCountOfNonConfirm()
                .then(function (count) {
                    if (count.success) {
                        $scope.countNonConfirmPurchases = count.data;
                    } else {
                        console.log(count.message);
                    }
                });
        }

        $scope.refresh = function () {
            getCurrentUser();
            getCountOfNonConfirm();
        };

        $scope.isAuth = function () {
            if (!$scope.authStatus) {
                $scope.authStatus = authService.isAuth();
            }
            if ($scope.authStatus && !flag) {
                getCurrentUser();
                getCountOfNonConfirm();
                flag = true;
            }
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
            flag = false;
            getCurrentUser();
            getCountOfNonConfirm();
            return authService.ClearCredentials();
        };

    }
];
