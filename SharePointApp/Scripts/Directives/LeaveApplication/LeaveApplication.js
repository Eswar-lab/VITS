
(function () {
    'use strict';

    var app = angular.module('SharePointOnlineDirectives', ['ngMaterial'] );
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
    Controller.$inject = ['$scope', 'SharePointOnlineService', '$timeout', 'ListService', '$q'];
    function Controller($scope, SharePointOnlineService, $timeout, ListService, $q) {

        var vm = this;
        var searchData = [];
        $scope.selectedLeaveApplication = {};
        $scope.selectedLeaveApplication.selectedManager = undefined;
        $scope.selectedLeaveApplication.LeaveType = undefined;

        $scope.leave_type = LEAVE_TYPE_PAYROLL_CODE;
        $scope.payroll_code = [];

        $scope.LeaveApplicationData = {};
        $scope.title = 'Base Controller';
        $scope.username = _spPageContextInfo.userDisplayName;

        $scope.managers = [];
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
        //Leave Type and PayCode
        $scope.$watch('selectedLeaveApplication.LeaveType', function () {
            $scope.leave_type.forEach(function (item) {
                if (item.leave_type_code == $scope.selectedLeaveApplication.LeaveType) {
                    $scope.payroll_code = item.paycodes;
                    return;
                }
            });
        });

        //constructor
        init();
        function init(){
            var hostUrl = SharePointOnlineService.GetHostWebUrl();
            var appUrl = SharePointOnlineService.GetAppWebUrl();
            var manageUrl = appUrl + "/_api/SP.AppContextSite(@target)/web/sitegroups/getbyname('Staff Leave Manager')/users?@target=%27" + hostUrl + "%27";

            ListService.GetListByTitle(manageUrl).then(function (data) {
                console.log(data);
                $scope.managers = data;
            }, function (err) {
                console.log(err);

            });
        }
        //auto complete
        //https://material.angularjs.org/latest/demo/autocomplete
        $scope.getMatches = function (searchText) {
            var deferred = $q.defer();
            if ($scope.managers.length == 0) {
                var hostUrl = SharePointOnlineService.GetHostWebUrl();
                var appUrl = SharePointOnlineService.GetAppWebUrl();
                var manageUrl = appUrl + "/_api/SP.AppContextSite(@target)/web/sitegroups/getbyname('Staff Leave Manager')/users?@target=%27" + hostUrl + "%27";

                ListService.GetListByTitle(manageUrl).then(function (data) {
                    console.log(data);
                    searchData = [];
                    data.forEach(function (item) {
                        if (item.Email.includes(searchText)) {
                            searchData.push(item);
                        }
                    });
                    $scope.managers = data;
                    deferred.resolve(searchData);

                }, function (err) {
                    console.log(err);
                    return [];

                });
            } else {
                searchData = [];
                $scope.managers.forEach(function (item) {
                    if (item.Email.includes(searchText)) {
                        searchData.push(item);
                    }
                });
                deferred.resolve(searchData);
                
            }
            return deferred.promise;
        };


      
        

        //end

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
        $scope.ActualLeaveToggle = function (event) {
            document.getElementById("inpActualLeave").readOnly = !event.target.checked;
            document.getElementById("inpActualLeave").focus(); 
        }

        $scope.newLeaveApplication_Click = function () {
            //ListService.GetListByTitle("");

            $scope.selectedLeaveApplication = SharePointOnlineService.LeaveApplication_CreateNewLeaveData().then(function (data) {
                $scope.selectedLeaveApplication = data;
            });
            $('#modalLeaveApplication').modal('show');
        }

        $scope.ClearFile = function () {
            document.getElementById("inpFile").value = "";
        }

        $scope.SaveLeaveApplication = function () {
            console.log("Saving leave application");
            console.log($scope.selectedLeaveApplication.ReportsTo);
            //SharePointOnlineService.LeaveApplication_SaveOrCreateData($scope.selectedLeaveApplication);
            //files = $scope.selectedLeaveApplication.SupportingFiles;
            $('#modalLeaveApplication').modal('hide');
        }
        $scope.View = SharePointOnlineService.GetURLParameters("View");
        $scope.GetLeaveApplications();
        $("#ppReportsTo").typeahead({
            source: SharePointOnlineService.LeaveApplication_Get_Approvers(),
            autoSelect: true});
        $('#userTabs a').click(function (e) {
            e.preventDefault()
            $(this).tab('show');
        });

       // alert("Host URL: " + SharePointOnlineService.GetHostWebUrl());
       // alert("App URL: " + SharePointOnlineService.GetAppWebUrl());
    }
})();