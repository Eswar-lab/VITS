(function () {
    'use strict';

    var app = angular.module('SharePointOnlineDirectives');
    app.directive('spoTimesheet', function ($compile) {
        var scripts = document.getElementsByTagName("script")
        var currentScriptPath = scripts[scripts.length - 1].src;

        return {
            restrict: 'EA', //element
            scope: {
                tenant: '='
            },
            //templateUrl: currentScriptPath.replace('InlineSearch.js', 'InlineSearch.html'),
            templateUrl: 'https://localhost:44326/scripts/Directives/Timesheet/Timesheet.html',
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
        $scope.username = _spPageContextInfo.userDisplayName;

        $scope.SearchText = "*sharepoint*";
        $scope.ShowSpinner = false;

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

        function ClearCache() {
            $scope.SearchResults = [];
            SharePointOnlineService.forceCacheDeletion();
        }

        // Set the cache key
        var wpId = SharePointOnlineService.GetURLParameters("wpId");
        var cacheKey = 'VIT_Timesheet_' + wpId

        $scope.GetTimesheet = function () {
            // the start date will be passed in the querystring, ex? startDate = ''
            $scope.TimesheetData = SharePointOnlineService.Timesheet_Get_TimesheetData_ForPeriod($scope.username, '13-Nov-2017', '26-Nov-2017');
        }

        $scope.ClearCacheAndSearch = function (event) {
            if (event != null) {
                event.preventDefault();
            }
            ClearCache();
            $scope.Search();
        }
    }
})();