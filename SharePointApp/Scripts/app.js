(function () {
    'use strict';

    var app = angular.module('SharePointOnlineApp', [
        // Angular modules 
        'ngRoute', 'ngStorage', 'ui.bootstrap',
        'SharePointOnlineServices',
        'SharePointOnlineControllers',
        'SharePointOnlineDirectives',
        
    ]);

    
    app.config(config);

    config.$inject = ['$routeProvider', '$locationProvider', '$localStorageProvider','$sceProvider'];

    function config($routeProvider, $locationProvider, $localStorageProvider, $sceProvider) {
        //$localStorageProvider.setKeyPrefix('SharePointOnlineApps');        
        $sceProvider.enabled(false);
        

        $routeProvider
           .when('/', {
               templateUrl: '/views/index.html',
               reloadOnSearch: false,
               controller: "BaseController"
           })           
           .otherwise({ redirectTo: '/' });
        $locationProvider.html5Mode(false);


    }
})();