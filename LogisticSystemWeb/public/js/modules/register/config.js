'use strict';

module.exports = [
    '$stateProvider',
    function ($stateProvider) {
        $stateProvider
            .state('registration', {
                url: '/registration',
                template: require('./template.html'),
                controller: 'RegistrationController',
                controllerAs: 'vm'
            });
    }
];

