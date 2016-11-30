'use strict';

module.exports = [
    '$stateProvider',
    function ($stateProvider) {
        $stateProvider
            .state('login', {
                url: '/login',
                template: require('./template.html'),
                controller: 'LoginController',
                controllerAs: 'vm'
            })
            .state('logout', {
                url: '/logout'
            })
            .state('forbidden', {
                url: '/forbidden',
                template: require('./forbidden-template.html')
            });
    }
];

