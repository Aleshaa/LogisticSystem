'use strict';

module.exports = [
    'requestService',
    function (requestService) {

        this.getAll = function () {
            return requestService
                .get('/rest/get/users')
                .then(function (response) {
                        return response;
                    },
                    handleError('Error getting all users'))
        };

        this.getById = function (id) {
            return requestService
                .get('/rest/get/user/', id)
                .then(function (response) {
                        return response;
                    },
                    handleError('Error getting user by id'))
        };

        this.getCurrentUser = function () {
            return requestService
                .get('/rest/get/currentUser')
                .then(function (response) {
                        return response;
                    },
                    handleError('Error getting user by username'))
        };

        function handleError(error) {
            return function () {
                return {success: false, message: error};
            };
        }

    }
];