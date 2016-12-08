'use strict';

module.exports = [
    '$http',
    'localStorageService',
    function ($http, localStorageService) {
        var service = {};

        var REST_SERVICE_URI = 'http://localhost:8080/';

        var authData = localStorageService.get('globals') ? localStorageService.get('globals').currentUser.authdata : "";

        $http.defaults.headers.common['Authorization'] = 'Basic ' + authData;

        service.getUsersStat = getUsersStat;
        service.getCurrentUserStat = getCurrentUserStat;
        service.getGoodsStat = getGoodsStat;
        service.getGoodsStatForCurrentUser = getGoodsStatForCurrentUser;
        service.getSuppliesStat = getSuppliesStat;
        service.getBuysStat = getBuysStat;

        return service;

        function getUsersStat() {
            return $http.get(REST_SERVICE_URI + 'rest/get/users/stat').then(handleSuccess,
                handleError('Ошибка при получении всех пользователей'));
        }

        function getCurrentUserStat() {
            return $http.get(REST_SERVICE_URI + 'rest/get/user/stat').then(handleSuccess,
                handleError('Ошибка при получении текущего пользователя'));
        }

        function getGoodsStat() {
            return $http.get(REST_SERVICE_URI + 'rest/get/goods/stat').then(handleSuccess,
                handleError('Ошибка при получении всех пользователей'));
        }

        function getGoodsStatForCurrentUser() {
            return $http.get(REST_SERVICE_URI + 'rest/get/goods/user/stat').then(handleSuccess,
                handleError('Ошибка при получении текущего пользователя'));
        }

        function getSuppliesStat() {
            return $http.get(REST_SERVICE_URI + 'rest/get/supply/stat').then(handleSuccess,
                handleError('Ошибка при получении всех пользователей'));
        }

        function getBuysStat() {
            return $http.get(REST_SERVICE_URI + 'rest/get/buy/stat').then(handleSuccess,
                handleError('Ошибка при получении текущего пользователя'));
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