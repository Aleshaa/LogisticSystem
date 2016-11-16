'use strict';

module.exports = [
    '$stateProvider',
    function ($stateProvider) {
        $stateProvider
            .state('users', {
                url: '/users',
                controller: 'UserController',
                template: require('./template.html')
            });
    }
];
