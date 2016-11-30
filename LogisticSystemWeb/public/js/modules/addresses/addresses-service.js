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
        service.getAllStores = getAllStores;
        service.getStoresForCurrentGoods = getStoresForCurrentGoods;
        service.create = create;
        service.update = update;
        service.remove = remove;

        return service;

        function getAll() {
            return $http.get(REST_SERVICE_URI + 'rest/get/addresses').then(handleSuccess,
                handleError('Ошибка при получении всех адресов'));
        }

        function getAllStores() {
            return $http.get(REST_SERVICE_URI + 'rest/get/stores').then(handleSuccess,
                handleError('Ошибка при получении всех складов'));
        }

        function getStoresForCurrentGoods(id) {
            return $http.get(REST_SERVICE_URI + 'rest/get/addresses/cur/goods/' + id).then(handleSuccess,
                handleError('Ошибка при получении всех адресов для опредленного товара'));
        }

        function create(newAddress, idUser) {
            return $http.post(REST_SERVICE_URI + 'address/' + idUser, newAddress).then(handleSuccess,
                handleError('Ошибка при добавлении нового адреса'));
        }

        function update(curAddress) {
            return $http.put(REST_SERVICE_URI + 'rest/update/address/' + curAddress.idAddress, curAddress)
                .then(handleSuccess, handleError('Ошибка обновления товара'));
        }

        function remove(id) {
            return $http.delete(REST_SERVICE_URI + 'rest/delete/address/' + id).then(handleSuccess,
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