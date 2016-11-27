'use strict';

module.exports = [function () {
    return {
        restrict: 'E',
        replace: true,
        scope: true,
        controller: require('./controller'),
        template: require('./template.html')
    };
}
];
