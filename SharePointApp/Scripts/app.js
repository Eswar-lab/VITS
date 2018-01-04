



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

const LEAVE_APPLICATION_FIELDS = [
    { 'name': 'ID', 'required': false },
    { 'name': 'EmployeeEmail', 'required': false },
    { 'name': 'EmployeeSurname', 'required': false },
    { 'name': 'FirstName', 'required': false },
    { 'name': 'EmployeeID', 'required': false },
    { 'name': 'Designation', 'required': false },
    { 'name': 'Designation', 'required': false },
    { 'name': 'ReportTo', 'required': true },
    { 'name': 'LeaveType', 'required': false },
    { 'name': 'PayrollCode', 'required': false },
    { 'name': 'LeaveCategory', 'required': false },
    { 'name': 'StartDate', 'required': true },
    { 'name': 'ReturnDate', 'required': true },
    { 'name': 'TotalDays', 'required': false },
    { 'name': 'ActualLeaveChecked', 'required': false },
    { 'name': 'ActualLeave', 'required': false },
    { 'name': 'Status', 'required': false },
    { 'name': 'RejectionReason', 'required': false },
    { 'name': 'Remarks', 'required': false },
    { 'name': 'PRCODE', 'required': false },

];
const LEAVE_TYPE_PAYROLL_CODE = [
    {
        leave_type_code: 'ANN',
        leave_type_text: 'Annual Leave',
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
        leave_type_text: 'Family Leave',
        enable_leave_category: true

    },
    {

        leave_type_code: 'CMP',
        leave_type_text: 'Compassionate Leave',
        enable_leave_category: true

    },
    {
        leave_type_code: 'STY',
        leave_type_text: 'Study Leave',
        enable_leave_category: false

    },
    {
        leave_type_code: 'PAT',
        leave_type_text: 'Parental Leave',
        enable_leave_category: false

    },
    {
        leave_type_code: 'JURY',
        leave_type_text: 'Jury Service Leave',
        enable_leave_category: false

    },
    {
        leave_type_code: 'LSL',
        leave_type_text: 'Long Service Leave',
        enable_leave_category: false

    },



]

