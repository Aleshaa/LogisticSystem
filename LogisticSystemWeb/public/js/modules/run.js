'use strict';

module.exports = [
    '$rootScope',
    'authService',
    '$state',
    function ($rootScope, authService, $state) {

        var statesWithoutAuth = [
            'login',
            'registration'
        ];

        var defaultAuthState = 'home';
        var defaultNonAuthState = 'login';
        var accessDenyState = 'forbidden';

        $rootScope.$on('$stateChangeStart', function (event, toState) {

            var redirect = function (state) {
                event.preventDefault();
                return $state.go(state);
            };

            var checkAuth = function () {

                if (toState.name === 'logout') {
                    authService.clearCredentials();
                    return redirect('login');
                } else {
                    if (statesWithoutAuth.indexOf(toState.name) != -1) {
                        if (authService.isAuth()) {
                            return redirect(defaultAuthState);
                        }
                    } else {
                        var authorizedRoles = (!toState.data || !toState.data.authorizedRoles)
                            ? []
                            : toState.data.authorizedRoles;
                        if (!authService.isAuth()) {
                            return redirect(defaultNonAuthState);
                        } else if (!authService.checkRole(authorizedRoles)) {
                            return redirect(accessDenyState);
                        }
                    }
                }
            };

            checkAuth();
        });
    }
];