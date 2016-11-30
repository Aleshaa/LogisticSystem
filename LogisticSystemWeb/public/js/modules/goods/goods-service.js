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
        service.create = create;
        service.update = update;
        service.Delete = Delete;

        return service;

        function getAll() {
            return $http.get(REST_SERVICE_URI + 'rest/get/goods').then(handleSuccess,
                handleError('Ошибка при получении всех товаров'));
        }

        function create(newGoods) {
            return $http.post(REST_SERVICE_URI + 'rest/create/goods', newGoods).then(handleSuccess,
                handleError('Ошибка при добавлении нового товара'));
        }

        function update(curGoods) {
            return $http.put(REST_SERVICE_URI + 'rest/update/goods/' + curGoods.idGoods, curGoods).then(handleSuccess,
                handleError('Ошибка обновления товара'));
        }

        function Delete(id) {
            return $http.delete(REST_SERVICE_URI + 'rest/delete/goods/' + id).then(handleSuccess,
                handleError('Ошибка удаления товара'));
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