'use strict';

module.exports = [
    '$http',
    'localStorageService',
    function ($http, localStorageService) {
        var service = {};

        var REST_SERVICE_URI = 'http://localhost:8080/';

        var authData = localStorageService.get('globals') ? localStorageService.get('globals').currentUser.authdata : "";

        $http.defaults.headers.common['Authorization'] = 'Basic ' + authData;

        service.getAll = getAll;
        service.getCurrentUser = getCurrentUser;
        service.create = create;
        service.update = update;
        service.Delete = Delete;

        return service;

        function getAll() {
            return $http.get(REST_SERVICE_URI + 'rest/get/role/users').then(handleSuccess,
                handleError('Ошибка при получении всех пользователей'));
        }

        function getCurrentUser() {
            return $http.get(REST_SERVICE_URI + 'rest/get/currentUser').then(handleSuccess,
                handleError('Ошибка при получении текущего пользователя'));
        }

        function create(user) {
            return $http.post(REST_SERVICE_URI + 'user', user).then(handleSuccess,
                handleError('Ошибка регистрации пользователя'));
        }

        function update(user) {
            return $http.put('/api/users/' + user.id, user).then(handleSuccess, handleError('Error updating user'));
        }

        function Delete(id) {
            return $http.delete(REST_SERVICE_URI + 'rest/delete/user/' + id).then(handleSuccess, handleError('Error deleting user'));
        }

        function handleSuccess(res) {
            return {
                success: true,
                data: res.data
            };
        }

        function handleError(error) {
            return function () {
                return {success: false, message: error};
            };
        }

    }
];