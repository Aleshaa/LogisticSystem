'use strict';

module.exports = [
    '$stateProvider',
    function ($stateProvider) {
        $stateProvider
            .state('supplies', {
                url: '/supplies',
                controller: 'SupplyController',
                controllerAs: 'vm',
                template: require('./template.html'),
                data: {
                    authorizedRoles: ['ADMIN']
                }
            });
    }
];
