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
        service.getCountOfNonComplete = getCountOfNonComplete;
        service.confirm = confirm;
        service.update = update;
        service.remove = remove;

        return service;

        function getAll() {
            return $http.get(REST_SERVICE_URI + 'rest/get/buys/user').then(handleSuccess,
                handleError('Ошибка при получении всех поставок'));
        }

        function getCountOfNonComplete() {
            return $http.get(REST_SERVICE_URI + 'rest/get/buys/nocompleted/size')
                .then(handleSuccess, handleError('Ошибка при получении количества не подтвержденных поставок'));
        }

        function create(idClient, idGoods, buy) {
            return $http.post(REST_SERVICE_URI + 'rest/create/buy/' + idClient + '/' + idGoods, buy)
                .then(handleSuccess, handleError('Ошибка при фиксировании новой поставки клиенту'));
        }

        function confirm(id) {
            return $http.post(REST_SERVICE_URI + 'rest/update/buy/' + id + '/confirm')
                .then(handleSuccess, handleError('Ошибка при подтверждении выполнения заказа'));
        }

        function update(curBuy) {
            return $http.put(REST_SERVICE_URI + 'rest/update/buy/' + curBuy.idBuy)
                .then(handleSuccess, handleError('Ошибка обновления поставки'));
        }

        function remove(id) {
            return $http.delete(REST_SERVICE_URI + 'rest/delete/buy/' + id).then(handleSuccess, handleError('Ошибка удаления поставки клиенту'));
        }

        function handleSuccess(res) {
            return {
                success: true,
                data: res.data
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