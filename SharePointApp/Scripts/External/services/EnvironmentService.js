(function () {
    'use strict';

    angular
        .module('SharePointOnlineServices')
        .factory('EnvironmentService', EnvironmentService);

    EnvironmentService.$inject = ['$http', '$localStorageProvider', '$q', '$timeout'];

    function EnvironmentService($http, $localStorageProvider, $q, $timeout) {
        //var BaseServiceUrl = "http://vit.azurewebsites.net";
        var BaseServiceUrl ="https://vitspoaddins.blob.core.windows.net"
        var config = null;
        var EnvironmentServiceFactory = {}

        EnvironmentServiceFactory.GetConfig = function () {
            return config;
        };


        return EnvironmentServiceFactory;
    }
})();