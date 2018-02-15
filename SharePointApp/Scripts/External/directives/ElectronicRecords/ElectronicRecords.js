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

    Controller.$inject = ['$scope', 'SharePointOnlineService', '$timeout', 'DocumentSetService'];
    function Controller($scope, SharePointOnlineService, $timeout, DocumentSetService) {


        var vm = this;
        $scope.title = 'Base Controller';

        $scope.SearchText = "*sharepoint*";
        $scope.ShowSpinner = false;

        // Fields to retrieve from SharePoint
        $scope.documentSets = [
            { name: "Enuju Ruyu", student_id: "35993", student_type: "International", admissions_record_type: "Admissions and Admin", education_sector: "VET", student_current_status: "Studying" },
            { id: "2157", name: "Ganga Mayer Moyer", student_id: "35078", student_type: "International", admissions_record_type: "Admissions and Admin", education_sector: "VET", student_current_status: "Applicant" },
            { id: "2157", name: "Gurjeet Singh", student_id: "35765", student_type: "International", admissions_record_type: "Admissions and Admin", education_sector: "VET", student_current_status: "Offered" }
        ];
        $scope.documentSetFiles = [
            { id: "1", name: "35993 Eunju Ryu 35993 Orientation Checklist.pdf", student_id: "35993", student_type: "International", admissions_record_type: "Admissions and Admin", education_sector: "VET", course_code: "ICA320299", admissions_document_type: "Orientation Checklist", student_admission_workflow_status: "Scanned", admissions_document_type: "Application Form", url: "https://vit1.sharepoint.com/Electronic-Records/Student Admissions/Eunju Ryu/35993 Eunju Ryu 35993 Orientation Checklist.pdf" },
            { id: "2", name: "35993 - Eunju Ryu-35993 - payment contract.pdf", student_id: "35993", student_type: "International", admissions_record_type: "Admissions and Admin", education_sector: "VET", course_code: "ICA320299", admissions_document_type: "Orientation Checklist", student_admission_workflow_status: "Tagged", admissions_document_type: "Fee Payment", url: "https://vit1.sharepoint.com/Electronic-Records/Student%20Admissions/Eunju%20Ryu/35993%20-%20Eunju%20Ryu-35993%20-%20payment%20contract.pdf" }
        ];

        // Selected documentSet
        $scope.documentSetFields = {};

        $scope.documentFields = {
        };

        // Looks up fields
        $scope.StudentIds = [
            { Id: "35993", Name: "Enuju Ruyu" },
            { Id: "35078", Name: "Ganga Mayer Moya" },
            { Id: "35765", Name: "Gurjeet Singh" }
        ];

        $scope.StudentTypes = [
            { Id: "Domestic", Name: "Domestic" },
            { Id: "International", Name: "International" },
            { Id: "BOTH", Name: "BOTH" }
        ];

        $scope.EducationSectors = [
            { Id: "All Sectors", Name: "All Sectors" },
            { Id: "EAL/ELICOSE", Name: "EAL/ELICOSE" },
            { Id: "Higher Education", Name: "Higher Education" },
            { Id: "VET", Name: "VET" }
        ];

        $scope.AdmissionsRecordTypes = [
            { Id: "Admissions and Admin", Name: "Admissions and Admin" },
            { Id: "Admissions Archive", Name: "Admissions Archive" }
        ];

        $scope.WorkflowStatuses = [
            { Id: "Not Started", Name: "Not Started" },
            { Id: "Scanned", Name: "Scanned" },
            { Id: "Tagged", Name: "Tagged" }
        ];
        $scope.AdmissionsDocumentTypes = [
            { Id: "Application Form", Name: "Application Form" },
            { Id: "Confirmation of Enrollment", Name: "Confirmation of Enrollment" },
            { Id: "EFT", Name: "EFT" },
            { Id: "English Proficiency", Name: "English Proficiency" },
            { Id: "Fee Payment", Name: "Fee Payment" }
        ];

        $scope.StudentCurrentStatuses = [
            { Id: "Applicant", Name: "Applicant" },
            { Id: "Approved", Name: "Approved" },
            { Id: "Archived", Name: "Archived" },
            { Id: "Cancelled", Name: "Cancelled" },
            { Id: "Deferred", Name: "Deferred" },
            { Id: "Enrollment and Agreement Acceptance", Name: "Enrollment and Agreement Acceptance" },
            { Id: "Finished", Name: "Finished" },
            { Id: "Offered", Name: "Offered" },
            { Id: "Studying", Name: "Studying" },
            { Id: "Visa granted", Name: "Visa granted" }
        ];

        $scope.documentSetFormFields = [
            {
                key: 'name',
                type: 'input',
                templateOptions: {
                    label: 'Name',
                    focus: true,
                    placeholder: "Student name",
                }
            },
            {
                key: 'student_id',
                type: 'select',
                templateOptions: {
                    label: 'Student Id',
                    options: $scope.StudentIds,
                    valueProp: 'Id',
                    labelProp: 'Name'
                }
            },
            {
                key: 'student_type',
                type: 'select',
                templateOptions: {
                    label: 'Student Type',


                }
            },
            {
                key: 'admissions_record_type',
                type: 'select',
                templateOptions: {
                    label: 'Admissions Record Type',
                    options: $scope.AdmissionsRecordTypes,
                    valueProp: 'Id',
                    labelProp: 'Name'
                }
            },
            {
                key: 'education_sector',
                type: 'select',
                templateOptions: {
                    label: 'Education Sector',
                    options: $scope.EducationSectors,
                    valueProp: 'Id',
                    labelProp: 'Name'
                }
            },
            {
                key: 'student_current_status',
                type: 'select',
                templateOptions: {
                    label: 'Current Student Status',
                    options: $scope.StudentCurrentStatuses,
                    valueProp: 'Id',
                    labelProp: 'Name'
                }
            }
        ]

        //End Lookup fields

        $scope.documentFormFields = [
            {
                key: 'name',
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
                    disabled: true,
                    options: $scope.StudentIds,
                    valueProp: 'Id',
                    labelProp: 'Name'
                }
            },
            {
                key: 'student_type',
                type: 'input',
                templateOptions: {
                    label: 'Student Type',
                    disabled: true,
                    options: $scope.StudentTypes,
                    valueProp: 'Id',
                    labelProp: 'Name'
                }
            },
            {
                key: 'admissions_record_type',
                type: 'input',
                templateOptions: {
                    label: 'Admissions Record Type',
                    disabled: true,
                    options: $scope.AdmissionsRecordTypes,
                    valueProp: 'Id',
                    labelProp: 'Name'
                }
            },
            {
                key: 'education_sector',
                type: 'input',
                templateOptions: {
                    label: 'Education Sector',
                    disabled: true,
                    options: $scope.EducationSectors,
                    valueProp: 'Id',
                    labelProp: 'Name'
                }
            },
            {
                key: 'admissions_document_type',
                type: 'select',
                templateOptions: {
                    label: 'Admissions Document Type',
                    options: $scope.AdmissionsDocumentTypes,
                    valueProp: 'Id',
                    labelProp: 'Name'
                }
            },
            {
                key: 'student_admission_workflow_status',
                type: 'select',
                templateOptions: {
                    label: 'Workflow Status',
                    options: $scope.WorkflowStatuses,
                    valueProp: 'Id',
                    labelProp: 'Name'
                }
            }
        ];

        function ShowSpinner() { $scope.ShowSpinner = true; }
        function HideSpinner() { $scope.ShowSpinner = false; }

        $scope.documentSet_rowClick = function (data) {
            $scope.documentSetFields = data;
            DocumentSetService.GetTopLevelFolders("Student Admissions");
            //DocumentSetService.GetItemsInFolder("Student Admissions", "Eunju Ryu").then(
            //    function (items) {
            //        var itemEnumerator = items.getEnumerator();
            //        while (itemEnumerator.moveNext()) {
            //            var item = itemEnumerator.get_current();
            //            console.log(item.get_item("VIT_Student_ID"));
            //        }
            //    },
            //    function (err, msg) {
            //        console.log(msg);
            //    }
            //);
            $('#myTab a[href="#docSetView"]').tab('show');
        }

        $scope.documentSetFile_rowClick = function (data) {
            $scope.documentFields = data;
            $('#myTab a[href="#docView"]').tab('show')
        }

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