'use strict';

module.exports = [
    '$stateProvider',
    function ($stateProvider) {
        $stateProvider
            .state('user-stat', {
                url: '/user-stat',
                controller: 'UserStatController',
                controllerAs: 'vm',
                template: require('./template.html'),
                data: {
                    authorizedRoles: ['USER', 'ADMIN']
                }
            });
    }
];
