'use strict';

module.exports = [
    '$http',
    'localStorageService',
    'flashService',
    function ($http, localStorageService, flashService) {
        var service = {};

        var REST_SERVICE_URI = 'http://localhost:8080/';

        var authData = localStorageService.get('globals') ? localStorageService.get('globals').currentUser.authdata : "";

        $http.defaults.headers.common['Authorization'] = 'Basic ' + authData;

        service.getAll = getAll;
        service.create = create;
        service.update = update;
        service.remove = remove;

        return service;

        function getAll() {
            flashService.showLoading();
            return $http.get(REST_SERVICE_URI + 'rest/get/suppliers')
                .then(handleSuccess, handleError('Ошибка при получении всех поставщиков'));
        }

        function create(newSupplier) {
            return $http.post(REST_SERVICE_URI + 'rest/create/supplier', newSupplier).then(handleSuccess,
                handleError('Ошибка при добавлении нового поставщика'));
        }

        function update(curSupplier) {
            return $http.put(REST_SERVICE_URI + 'rest/update/supplier/' + curSupplier.idSupplier, curSupplier)
                .then(handleSuccess, handleError('Ошибка обновления поставщика'));
        }

        function remove(id) {
            return $http.delete(REST_SERVICE_URI + 'rest/delete/supplier/' + id).then(handleSuccess,
                handleError('Ошибка удаления поставщика'));
        }

        function handleSuccess(res) {
            return {
                success: true,
                data: res.data,
                message: "Операция выполнена успешно!"
            };
        }

        function handleError(error) {
            return function () {
                return {success: false, message: error};
            };
        }

    }
];