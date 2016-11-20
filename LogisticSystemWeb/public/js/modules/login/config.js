'use strict';

module.exports = [
    '$stateProvider',
    function ($stateProvider) {
        $stateProvider
            .state('login', {
                url: '/login',
                template: require('./template.html'),
                controller: 'LoginController'
            });
    }
];

