(function () {
    'use strict';

    angular
        .module('app', ['ngRoute', 'ngCookies'])
        .config(config)
        .run(run);

    config.$inject = ['$routeProvider', '$locationProvider'];
    function config($routeProvider, $locationProvider) {
        $routeProvider
            .when('/', {
                controller: 'HomeController',
                templateUrl: 'modules/home/home.view.html',
                controllerAs: 'vm',
                roles: ['ADMIN']
            })

            .when('/login', {
                controller: 'LoginController',
                templateUrl: 'modules/login/login.view.html',
                controllerAs: 'vm'
            })

            .when('/logout', {
                controller: 'LoginController',
                templateUrl: 'modules/login/login.view.html',
                controllerAs: 'vm'
            })

            .when('/register', {
                controller: 'RegisterController',
                templateUrl: 'modules/register/register.view.html',
                controllerAs: 'vm'
            })
            .when('/accessDenied', {
                controller: 'RegisterController',
                templateUrl: 'modules/accessDenied.view.html',
                controllerAs: 'vm'
            })

            .otherwise({redirectTo: '/login'});
    }

    run.$inject = ['$rootScope', '$location', '$cookieStore', '$http', '$route'];
    function run($rootScope, $location, $cookieStore, $http, $route) {
        // keep user logged in after page refresh
        $rootScope.globals = $cookieStore.get('globals') || {};
        if ($rootScope.globals.currentUser) {
            $http.defaults.headers.common['Authorization'] = 'Basic ' + $rootScope.globals.currentUser.authdata; // jshint ignore:line
        }

        $rootScope.$on('$locationChangeStart', function (event, next, current) {
            // redirect to login page if not logged in and trying to access a restricted page
            var nextPath = $location.path();
            var nextRoute = $route.routes[nextPath];

            var requiredRole = nextRoute.roles;
            var restrictedPage = $.inArray($location.path(), ['/login', '/register']) === -1;
            var loggedIn = $rootScope.globals.currentUser;
            if ($location.path() == '/logout') {
                $rootScope.globals = {};
                $cookieStore.remove('globals');
                $http.defaults.headers.common.Authorization = 'Basic';
            }
            if (requiredRole != undefined && loggedIn && $.inArray($rootScope.globals.currentUser.role, requiredRole) === -1) {
                $location.path('/accessDenied');
            }
            if (restrictedPage && !loggedIn) {
                $location.path('/login');
            }
            if (!restrictedPage && loggedIn) {
                $location.path('/');
            }
        });
    }

})();