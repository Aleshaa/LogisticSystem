'use strict';

module.exports = [function () {
    return {
        restrict: 'E',
        replace: true,
        scope: true,
        controller: require('./controller'),
        controllerAs: 'vm',
        template: require('./template.html')
    };
}
];
