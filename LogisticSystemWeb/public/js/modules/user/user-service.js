'use strict';

module.exports = [
    'requestService',
    function (requestService) {

        this.getUsers = function () {
            return requestService
                .get('users')
                .then(function (response) {
                        return response;
                    }
                );
        };

    }
];