﻿(function () {
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
        $scope.selectedLeaveApplication = {};
        $scope.LeaveApplicationData = {};
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
        $scope.ActualLeaveToggle = function (event) {
            document.getElementById("inpActualLeave").readOnly = !event.target.checked;
            document.getElementById("inpActualLeave").focus(); 
        }

        $scope.newLeaveApplication_Click = function() {
            $scope.selectedLeaveApplication = SharePointOnlineService.LeaveApplication_CreateNewLeaveData();
            $('#modalLeaveApplication').modal('show');
        }

        $scope.ClearFile = function () {
            document.getElementById("inpFile").value = "";
        }

        $scope.SaveLeaveApplication = function (event) {
            console.log("Saving leave application");
            SharePointOnlineService.LeaveApplication_SaveOrCreateData($scope.selectedLeaveApplication);
            //files = $scope.selectedLeaveApplication.SupportingFiles;
            //$('#modalLeaveApplication').modal('hide');
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
       

        $scope.GetUserProfile = function () {
           
        
            var hostwebUrl = SharePointOnlineService.GetHostWebUrl();
            //var UPN = "i:0#.f|membership|" + _spPageContextInfo.userLoginName;

            SharePointOnlineService.LoadUserProfile().then(function (data) {
                //success
                if (data) {
                    $scope.ProfileData = data.userProfileProperties;
                   // alert($scope.ProfileData.FirstName);
                }

            }, function (data) {
                //error
                console.log(data);

                });

            SharePointOnlineService.LoadUserProfile_API().then(function (data) {
                console.log(data);
            });
              //AppServiceFactory.LeaveApplication_getUserProperties();
           // SP.SOD.executeOrDelayUntilScriptLoaded($scope.getUserProperties(), 'SP.UserProfiles.js');  
            
        }
        $scope.GetUserProfile();//
       /// call the service menhod/ alert("Host URL: " + SharePointOnlineService.GetHostWebUrl());
       // alert("App URL: " + SharePointOnlineService.GetAppWebUrl());
    }

})();