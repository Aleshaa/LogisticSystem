'use strict';

var alertify = require('alertify');

module.exports = [
    '$timeout',
    function ($timeout) {
        return {
            alert: function (message, callback) {
                alertify.alert(message, function () {
                    $timeout(function () {
                        callback();
                    });
                });
            },
            confirm: function (message, okCallback, cancelCallback) {
                alertify.confirm(
                    message,
                    function (e) {
                        if (e) {
                            if (okCallback) {
                                $timeout(function () {
                                    okCallback();
                                });
                            }
                        } else {
                            if (cancelCallback) {
                                $timeout(function () {
                                    cancelCallback();
                                });
                            }
                        }
                    }
                );
            },
            success: function (message) {
                alertify.success(message);
            },
            error: function (message) {
                if (Array.isArray(message)) {
                    angular.forEach(message, function (value) {
                        alertify.error(value);
                    });
                } else {
                    alertify.error(message);
                }
            },
            log: function (message) {
                alertify.log(message);
            },
            errorResponse: function (response) {
                if (typeof response.message != 'undefined') {
                    return alertify.error(response.message);
                } else {
                    return alertify.error('Unknown Error!');
                }
            },
            messageFromResponse: function (response) {
                if (typeof response.message != 'undefined') {
                    return response.status === 'success'
                        ? alertify.success(response.message)
                        : alertify.error(response.message);
                } else {
                    return response.status === 'success'
                        ? false
                        : alertify.error('Unknown Error!');
                }
            },
            isSuccess: function (response) {
                return response.status === 'success';
            },
            isError: function (response) {
                return response.status === 'error';
            }
        };
    }
];
