'use strict';

module.exports = [
    '$stateProvider',
    function ($stateProvider) {
        $stateProvider
            .state('home', {
                url: '/',
                template: require('./template.html'),
                controller: 'HomeController'
            });
    }
];

