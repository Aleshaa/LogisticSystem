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
        service.getCountOfNonConfirm = getCountOfNonConfirm;
        service.create = create;
        service.confirm = confirm;
        service.update = update;
        service.remove = remove;

        return service;

        function getAll() {
            flashService.showLoading();
            return $http.get(REST_SERVICE_URI + 'rest/get/purchases/user')
                .then(handleSuccess, handleError('Ошибка при получении всех заказов на поставку'));
        }

        function getCountOfNonConfirm() {
            return $http.get(REST_SERVICE_URI + 'rest/get/purchases/noconfirm/size').then(handleSuccess,
                handleError('Ошибка при получении количества неподтвержденных заявок'));
        }

        function create(idClient, idGoods, purchase) {
            return $http.post(REST_SERVICE_URI + 'rest/create/purchase/' + idClient + '/' + idGoods, purchase)
                .then(handleSuccess, handleError('Ошибка при создание новой заявки на поставку клиенту'));
        }

        function confirm(id) {
            return $http.put(REST_SERVICE_URI + 'rest/update/purchase/' + id + '/confirm')
                .then(handleSuccess, handleError('Ошибка при подтверждении поставки'));
        }

        function update(curPurchase, newGoods) {
            return $http.put(REST_SERVICE_URI + 'rest/update/purchase/' + curPurchase.idPurchase + '/' + newGoods, curPurchase)
                .then(handleSuccess, handleError('Ошибка обновления поставки'));
        }

        function remove(id) {
            return $http.delete(REST_SERVICE_URI + 'rest/delete/purchase/' + id).then(handleSuccess,
                handleError('Ошибка удаления поставки клиенту'));
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