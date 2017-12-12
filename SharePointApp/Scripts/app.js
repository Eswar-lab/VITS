﻿



(function () {
    'use strict';
   

    var app = angular.module('SharePointOnlineApp', [
        // Angular modules 
        'ngRoute', 'ngStorage', 'ui.bootstrap',
        'SharePointOnlineServices',
        'SharePointOnlineControllers',
        'SharePointOnlineDirectives',
        'formly',
        'formlyBootstrap',
        'smart-table','ngMaterial'
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


const LEAVE_TYPE_PAYROLL_CODE = [
    {
        leave_type_code: 'ANN',
        leave_type_text: 'annual leave',
        enable_leave_category: false

    },
    {
        leave_type_code: 'LOP',
        leave_type_text: 'Loss Of Pay',
        enable_leave_category: false

    },
    {
        leave_type_code: 'SIC',
        leave_type_text: 'Sick Leave',
        enable_leave_category: true

    },
    {
        leave_type_code: 'FAM',
        leave_type_text: 'Family leave',
        enable_leave_category: true

    },
    {
        leave_type_code: 'CMP',
        leave_type_text: 'Copassitionate Leave',
        enable_leave_category: false

    },
    {
        leave_type_code: 'STY',
        leave_type_text: 'study leave',
        enable_leave_category: false

    },
    {
        leave_type_code: 'PAT',
        leave_type_text: 'Parental leave',
        enable_leave_category: false

    },
    {
        leave_type_code: 'JURY',
        leave_type_text: 'Jury Service Leave',
        enable_leave_category: false

    },
    {
        leave_type_code: 'LSL',
        leave_type_text: 'Long servide leave',
        enable_leave_category: false

    },

]

