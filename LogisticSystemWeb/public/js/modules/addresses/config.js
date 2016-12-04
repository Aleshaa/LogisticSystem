'use strict';

module.exports = [
    '$stateProvider',
    function ($stateProvider) {
        $stateProvider
            .state('addresses', {
                url: '/addresses',
                controller: 'AddressController',
                controllerAs: 'vm',
                template: require('./template.html'),
                data: {
                    authorizedRoles: ['ADMIN', 'USER']
                }
            });
    }
];
