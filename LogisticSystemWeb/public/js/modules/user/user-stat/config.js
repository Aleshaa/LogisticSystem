'use strict';

module.exports = [
    '$stateProvider',
    function ($stateProvider) {
        $stateProvider
            .state('user-stat', {
                url: '/user-stat',
                controller: 'StatsController',
                controllerAs: 'vm',
                template: require('./template.html'),
                data: {
                    authorizedRoles: ['USER', 'ADMIN']
                }
            });
    }
];
