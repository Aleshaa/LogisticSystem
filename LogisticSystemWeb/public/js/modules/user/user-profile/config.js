'use strict';

module.exports = [
    '$stateProvider',
    function ($stateProvider) {
        $stateProvider
            .state('user-profile', {
                url: '/user-profile',
                controller: 'ProfileController',
                controllerAs: 'vm',
                template: require('./template.html'),
                data: {
                    authorizedRoles: ['USER']
                }
            });
    }
];
