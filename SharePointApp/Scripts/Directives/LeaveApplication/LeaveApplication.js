(function () {
    'use strict';

    var app = angular.module('SharePointOnlineDirectives');
    app.directive('spoLeaveapplication', function ($compile) {
        var scripts = document.getElementsByTagName("script")
        var currentScriptPath = scripts[scripts.length - 1].src;

        return {
            restrict: 'EA', //element
            scope: {
                tenant: '='
            },
            templateUrl: 'https://localhost:44326/scripts/Directives/LeaveApplication/LeaveApplication.html',
            replace: true,
            //require: 'ngModel',
            link: function ($scope, elem, attr, ctrl) {
                console.debug($scope);
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
        var cacheKey = 'VIT_LeaveApplication_' + wpId

        $scope.GetLeaveApplications = function () {
            // the start date will be passed in the querystring, ex? startDate = ''
            $scope.LeaveApplicationData = SharePointOnlineService.LeaveApplication_Get_UserData($scope.username, 'Pending');
        }

        $scope.ClearCacheAndSearch = function (event) {
            if (event != null) {
                event.preventDefault();
            }
            ClearCache();
        }

        $scope.filterData = function ($event, filter) {
            $event.preventDefault();
            $scope.LeaveApplicationData = SharePointOnlineService.LeaveApplication_Get_UserData($scope.username, filter);        

        }
        $scope.View = SharePointOnlineService.GetURLParameters("View");
        $scope.GetLeaveApplications();
        $("#ppReportsTo").typeahead({source:[{ id: "someId1", name: "Display name 1" },
        { id: "someId2", name: "Display name 2" }],
            autoSelect: true});
        $('#userTabs a').click(function (e) {
            e.preventDefault()
            $(this).tab('show');
        })
    }
})();