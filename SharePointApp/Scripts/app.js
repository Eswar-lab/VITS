



(function () {
    'use strict';
    
    //var d = new Date();
    //var n = d.getTime();
    //$('<link />', {
    //    rel: 'stylesheet',
    //    type: 'text/css',
    //    href: 'https://ajax.googleapis.com/ajax/libs/angular_material/1.1.0/angular-material.min.css' + n
    //}).prependTo('head');

    //$('<script />', {

    //    type: 'text/javascript',
    //    src: 'https://ajax.googleapis.com/ajax/libs/angular_material/1.1.0/angular-material.min.js' + n
    //}).prependTo('head');

    var app = angular.module('SharePointOnlineApp', [
        // Angular modules 
        'ngRoute', 'ngStorage', 'ui.bootstrap',
        'SharePointOnlineServices',
        'SharePointOnlineControllers',
        'SharePointOnlineDirectives',
        'formly',
        'formlyBootstrap',
        'smart-table'
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


