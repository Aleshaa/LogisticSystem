'use strict';

var angular = require('angular');

module.exports = [
    '$rootScope',
    function ($rootScope) {
        var service = {};

        service.success = success;
        service.error = error;
        service.showLoading = showLoading;
        service.hideLoading = hideLoading;

        initService();

        return service;

        function initService() {
            $rootScope.$on('$locationChangeStart', function () {
                clearFlashMessage();
            });

            function clearFlashMessage() {
                var flash = $rootScope.flash;
                if (flash) {
                    if (!flash.keepAfterLocationChange) {
                        delete $rootScope.flash;
                    } else {
                        flash.keepAfterLocationChange = false;
                    }
                }
            }
        }

        function success(message, keepAfterLocationChange) {
            $rootScope.flash = {
                message: message,
                type: 'success',
                keepAfterLocationChange: keepAfterLocationChange
            };
        }

        function error(message, keepAfterLocationChange) {
            $rootScope.flash = {
                message: message,
                type: 'error',
                keepAfterLocationChange: keepAfterLocationChange
            };
        }

        function showLoading() {
            $("#container").hide();
            $("#loading").show();
        }

        function hideLoading() {
            $("#container").show();
            $("#loading").hide();
        }
    }
];