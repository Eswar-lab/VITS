



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
const USER_TYPE = {
    'user': 1,
    'lineManager': 2,
    'mainManager': 3
};

const LEAVE_APPLICATION_STATUS = {
    'Draft': 'Draft',
    'PendingFinalApproval': 'Pending Final Approval',
    'Rejected': 'Rejected',
    'Approved': 'Approved',
    'Cancel': 'Cancel',
    'Withdraw': 'Withdraw'
}
const LEAVE_APPLICATION_FIELDS = [
    {"id": 'ID-leave', 'name': 'ID', 'required': false, 'error_mess': '' },
    {"id": 'EmployeeEmail-leave','name': 'EmployeeEmail', 'required': true, 'error_mess': 'email is required' },
    {"id": 'EmployeeSurname-leave','name': 'EmployeeSurname', 'required': true, 'error_mess': 'surname is required' },
    {"id": 'FirstName-leave','name': 'FirstName', 'required': false , 'error_mess': 'first name is required'},
    {"id": 'EmployeeID-leave','name': 'EmployeeID', 'required': false , 'error_mess': ''},
    {"id": 'Designation-leave', 'name': 'Designation', 'required': false , 'error_mess': ''},
    {"id": 'ReportTo-leave', 'name': 'ReportTo', 'required': true, 'error_mess': 'Report to is required' },
    {"id": 'LeaveType-leave', 'name': 'LeaveType', 'required': false , 'error_mess': ''},
    {"id": 'PayrollCode-leave', 'name': 'PayrollCode', 'required': false , 'error_mess': ''},
    {"id": 'LeaveCategory-leave', 'name': 'LeaveCategory', 'required': false , 'error_mess': ''},
    {"id": 'StartDate-leave', 'name': 'StartDate', 'required': true , 'error_mess': 'startdate is required'},
    {"id": 'ReturnDate-leave', 'name': 'ReturnDate', 'required': true , 'error_mess': 'returndate is required'},
    {"id": 'TotalDays-leave', 'name': 'TotalDays', 'required': false , 'error_mess': ''},
    {"id": 'ActualLeaveChecked-leave', 'name': 'ActualLeaveChecked', 'required': false , 'error_mess': ''},
    {"id": 'ActualLeave-leave', 'name': 'ActualLeave', 'required': false , 'error_mess': ''},
    {"id": 'Status-leave', 'name': 'Status', 'required': false, 'error_mess': '' },
    {"id": 'RejectionReason-leave', 'name': 'RejectionReason', 'required': false , 'error_mess': ''},
    {"id": 'Remarks-leave', 'name': 'Remarks', 'required': false , 'error_mess': ''},
    {"id": 'PRCODE-leave', 'name': 'PRCODE', 'required': false , 'error_mess': ''},

];
const LEAVE_TYPE_PAYROLL_CODE = [
    {
        leave_type_code: 'ANN',
        leave_type_text: 'Annual Leave',
        enable_supporting_file: false,
        enable_leave_category: false
        

    },
    {
        leave_type_code: 'LOP',
        leave_type_text: 'Loss Of Pay',
        enable_supporting_file: false,
        enable_leave_category: false

    },
    {
        leave_type_code: 'SIC',
        leave_type_text: 'Sick Leave',
        enable_supporting_file: false,
        enable_leave_category: true

    },
    {
        leave_type_code: 'FAM',
        leave_type_text: 'Family Leave',
        enable_supporting_file: true,
        enable_leave_category: true

    },
    {
        leave_type_code: 'CMP',
        leave_type_text: 'COMPASSIONATE Leave',
        enable_supporting_file: false,
        enable_leave_category: false

    },
    {
        leave_type_code: 'STY',
        leave_type_text: 'Study Leave',
        enable_file_attachment: false,
        enable_leave_category: false

    },
    {
        leave_type_code: 'PAT',
        leave_type_text: 'Parental Leave',
        enable_supporting_file: false,
        enable_leave_category: false

    },
    {
        leave_type_code: 'JURY',
        leave_type_text: 'Jury Service Leave',
        enable_supporting_file: false,
        enable_leave_category: false

    },
    {
        leave_type_code: 'LSL',
        leave_type_text: 'Long Service Leave',
        enable_supporting_file: false,
        enable_leave_category: false

    },

]

