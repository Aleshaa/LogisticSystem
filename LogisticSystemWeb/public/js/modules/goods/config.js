'use strict';

module.exports = [
    '$stateProvider',
    function ($stateProvider) {
        $stateProvider
            .state('goods', {
                url: '/goods',
                controller: 'GoodsController',
                controllerAs: 'vm',
                template: require('./template.html'),
                data: {
                    authorizedRoles: ['ADMIN', 'USER']
                }
            });
    }
];
