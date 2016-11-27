'use strict';

module.exports = [
    '$scope',
    '$state',
    'authService',
    function ($scope, $state, authService) {

        $scope.isCollapsed = true;
        $scope.authStatus = false;
        $scope.isAuth = function () {
            if (!$scope.authStatus)
                $scope.authStatus = authService.isAuth();
            return $scope.authStatus;
        };

        $scope.logout = function () {
            $scope.authStatus = false;
            return authService.ClearCredentials();
        };
    }
];
