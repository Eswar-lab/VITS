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

    Controller.$inject = ['$scope', '$timeout'];
    function Controller($scope, $timeout) {


        var vm = this;
        $scope.title = 'Base Controller';

        $scope.SearchText = "*sharepoint*";
        $scope.ShowSpinner = false;

        $scope.userFields = [
            {
                key: 'email',
                type: 'input',
                templateOptions: {
                    type: 'email',
                    label: 'Email address',
                    placeholder: 'Enter email'
                }
            },
            {
                key: 'password',
                type: 'input',
                templateOptions: {
                    type: 'password',
                    label: 'Password',
                    placeholder: 'Password'
                }
            },
            {
                key: 'file',
                type: 'file',
                templateOptions: {
                    label: 'File input',
                    description: 'Example block-level help text here',
                    url: 'https://example.com/upload'
                }
            },
            {
                key: 'checked',
                type: 'checkbox',
                templateOptions: {
                    label: 'Check me out'
                }
            }
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