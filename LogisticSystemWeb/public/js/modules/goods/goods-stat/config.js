'use strict';

module.exports = [
    '$stateProvider',
    function ($stateProvider) {
        $stateProvider
            .state('goods-stat', {
                url: '/goods-stat',
                controller: 'StatsController',
                controllerAs: 'vm',
                template: require('./template.html'),
                data: {
                    authorizedRoles: ['USER', 'ADMIN']
                }
            });
    }
];
