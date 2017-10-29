(function () {
    'use strict';

    angular
        .module('SharePointOnlineServices')
        .factory('EnvironmentService', EnvironmentService);

    EnvironmentService.$inject = ['$http', '$localStorageProvider', '$q', '$timeout'];

    function EnvironmentService($http, $localStorageProvider, $q, $timeout) {
        var BaseServiceUrl = "http://tippintotsservice.azurewebsites.net";
        var config = null;
        var EnvironmentServiceFactory = {}
        //var _baseServiceUrl = "http://localhost:1960";

        EnvironmentServiceFactory.GetConfig = function () {
            return config;
        };


        return EnvironmentServiceFactory;
    }
})();