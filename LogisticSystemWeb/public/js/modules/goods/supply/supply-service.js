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
            return $http.get(REST_SERVICE_URI + 'rest/get/supplies')
                .then(handleSuccess, handleError('Ошибка при получении всех поставок'));
        }

        function create(newSupply, idSupplier, idGoods, idAddress) {
            return $http.post(REST_SERVICE_URI + 'rest/create/supply/' + idSupplier + '/' + idGoods + '/' + idAddress,
                newSupply).then(handleSuccess, handleError('Ошибка при добавлении новой поставки'));
        }

        function update(curSupply) {
            return $http.put(REST_SERVICE_URI + 'rest/update/supply/' + curSupply.idSupply, curSupply)
                .then(handleSuccess, handleError('Ошибка обновлении поставки'));
        }

        function remove(id) {
            return $http.delete(REST_SERVICE_URI + 'rest/delete/supply/' + id).then(handleSuccess,
                handleError('Ошибка удаления поставки'));
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
                return {
                    success: false,
                    message: error
                };
            };
        }

    }
];