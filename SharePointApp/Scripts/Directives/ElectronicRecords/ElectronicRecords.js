(function () {
    'use strict';

    var app = angular.module('SharePointOnlineDirectives');
    app.directive('spoElectronicrecords', function ($compile) {
        var scripts = document.getElementsByTagName("script")
        var currentScriptPath = scripts[scripts.length - 1].src;

        return {
            restrict: 'EA', //element
            scope: {
                tenant: '='
            },
            //templateUrl: currentScriptPath.replace('InlineSearch.js', 'InlineSearch.html'),
            templateUrl: 'https://localhost:44326/scripts/Directives/ElectronicRecords/ElectronicRecords.html',
            //template: 'blah'    ,
            replace: true,
            //require: 'ngModel',
            link: function ($scope, elem, attr, ctrl) {
                console.debug($scope);
                //var textField = $('input', elem).attr('ng-model', 'myDirectiveVar');
                // $compile(textField)($scope.$parent);
            },
            controller: Controller
        };
    });

    Controller.$inject = ['$scope', 'SharePointOnlineService', '$timeout'];
    function Controller($scope, SharePointOnlineService, $timeout) {


        var vm = this;
        $scope.title = 'Base Controller';

        $scope.SearchText = "*sharepoint*";
        $scope.ShowSpinner = false;

        $scope.fields = {
            "document_name": "35993 Eunju Ryu 35993 Orientation Checklist.pdf",
            "student_id": "123",
            "admissions_record_type": "Admissions and Admin",
            "student_type": "International",
            "education_sector": "VET",
            "admissions_document_type": "Orientation Checklist"
        };
        $scope.formFields = [
            {
                key: 'document_name',
                type: 'input',
                templateOptions: {
                    label: 'Document Name',
                    disabled: true
                }
            },
            {
                key: 'student_id',
                type: 'input',
                templateOptions: {
                    label: 'Student Id',
                    disabled: true
                }
            },
            {
                key: 'student_type',
                type: 'input',
                templateOptions: {
                    label: 'Student Type',
                    disabled: true
                }
            },
            {
                key: 'admissions_record_type',
                type: 'input',
                templateOptions: {
                    label: 'Admissions Record Type',
                    disabled: true
                }
            },
            {
                key: 'education_sector',
                type: 'input',
                templateOptions: {
                    label: 'Education Sector',
                    disabled: true
                }
            },
            {
                key: 'admissions_document_type',
                type: 'select',
                templateOptions: {
                    label: 'Admissions Document Type'
                }
            },
        ];

    function ShowSpinner() { $scope.ShowSpinner = true; }
    function HideSpinner() { $scope.ShowSpinner = false; }

    function _ShowValidationErrors(err) {
        if (err) {
            if (err.ExceptionAsString && err.ExceptionAsString != null) {
                $("#validationErrors").text(err.ExceptionAsString);
            }
            if (err.Message && err.Message != null) {
                $("#validationErrors").text(err.Message);
            }
        }
    }


}
})();