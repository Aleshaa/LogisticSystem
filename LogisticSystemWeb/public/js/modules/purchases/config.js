'use strict';

module.exports = [
    '$stateProvider',
    function ($stateProvider) {
        $stateProvider
            .state('purchases', {
                url: '/purchases',
                controller: 'PurchaseController',
                controllerAs: 'vm',
                template: require('./template.html'),
                data: {
                    authorizedRoles: ['ADMIN']
                }
            });
    }
];
