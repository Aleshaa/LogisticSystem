'use strict';

module.exports = [
    '$stateProvider',
    function ($stateProvider) {
        $stateProvider
            .state('buy-stat', {
                url: '/buy-stat',
                controller: 'BuyStatController',
                controllerAs: 'vm',
                template: require('./template.html'),
                data: {
                    authorizedRoles: ['USER', 'ADMIN']
                }
            });
    }
];
