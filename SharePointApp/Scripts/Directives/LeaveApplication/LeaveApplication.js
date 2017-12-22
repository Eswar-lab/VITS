
(function () {
    'use strict';

    var app = angular.module('SharePointOnlineDirectives', ['ngMaterial']);
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
    Controller.$inject = ['$scope', 'SharePointOnlineService', '$timeout', 'ListService', '$q', 'LeaveApplicationService','modalService'];
    function Controller($scope, SharePointOnlineService, $timeout, ListService, $q, LeaveApplicationService, modalService) {

        var vm = this;
        var searchData = [];
        // Set the cache key
        var wpId = SharePointOnlineService.GetURLParameters("wpId");
        var cacheKey = 'VIT_LeaveApplication_' + wpId
        var userProfile = undefined;
        $scope.stage = {
            view: '',
            tab: ''
        };


        $scope.applications = [];
        $scope.selectedLeaveApplication = {};
        $scope.selectedLeaveApplication.selectedManager = undefined;
        $scope.selectedLeaveApplication.LeaveType = undefined;
        $scope.selectedLeaveApplication.pallroll_code = undefined;
        $scope.selectedLeaveApplication.enable_leave_category = false;

        $scope.leave_type = LEAVE_TYPE_PAYROLL_CODE;
        $scope.payroll_code = [];

        $scope.LeaveApplicationData = [];
        $scope.FilterLeaveApplicationData = [];
        $scope.title = 'Base Controller';
        $scope.username = _spPageContextInfo.userDisplayName;

        $scope.managers = [];
        $scope.SearchText = "*sharepoint*";
        $scope.ShowSpinner = false;

        $scope.stage.view = SharePointOnlineService.GetURLParameters("View");


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
            try {
                $scope.leave_type.forEach(function (item) {
                    if ($scope.selectedLeaveApplication.LeaveType == item.leave_type_code) {
                        $scope.selectedLeaveApplication.pallroll_code = item.leave_type_code;
                        $scope.selectedLeaveApplication.enable_leave_category = item.enable_leave_category;
                        return;
                    }
                });

            } catch (ex) {
                console.log(ex);
            }
        });
        //caluculate start day and last day
        $scope.$watch('[selectedLeaveApplication.StartDate ,selectedLeaveApplication.ReturnDate]' , function () {
            $scope.selectedLeaveApplication.TotalDays = dateDifference($scope.selectedLeaveApplication.StartDate, $scope.selectedLeaveApplication.ReturnDate);


        });

        //constructor
        init();
        function init() {
            var hostUrl = SharePointOnlineService.GetHostWebUrl();
            var appUrl = SharePointOnlineService.GetAppWebUrl();
            var manageUrl = appUrl + "/_api/SP.AppContextSite(@target)/web/sitegroups/getbyname('Staff Leave Manager')/users?@target=%27" + hostUrl + "%27";


            ListService.GetListByTitle(manageUrl).then(function (data) {
                console.log(data);
                $scope.managers = data;
            }, function (err) {
                console.log(err);

            });

            //load current user infor
            SharePointOnlineService.LoadUserProfile().then(function (data) {
                userProfile = data.userProfileProperties;

                //load application data
                var inputEmail = null;
                if ($scope.stage.view == 'UserView') {
                    inputEmail = userProfile.WorkEmail;
                }
                loadLeaveApplication(inputEmail);

            });



        }

        function ClearCache() {
            $scope.SearchResults = [];
            SharePointOnlineService.forceCacheDeletion();
        }

        $scope.ClearCacheAndSearch = function (event) {
            if (event != null) {
                event.preventDefault();
            }
            ClearCache();
        }

        $scope.filterData = function ($event, filter) {
            $event.preventDefault();
            $scope.stage.tab = filter;
            $scope.FilterLeaveApplicationData = [];

            $scope.LeaveApplicationData.forEach(function (item) {
                if (item.Status == filter) {
                    $scope.FilterLeaveApplicationData.push(item);
                }
            });

        }
        $scope.ActualLeaveToggle = function (event) {
            document.getElementById("inpActualLeave").readOnly = !event.target.checked;
            document.getElementById("inpActualLeave").focus();
        }

        $scope.deleteLeaveApplication_Click = function (data) {
            var modalOptions = {
                closeButtonText: 'Cancel',
                actionButtonText: 'Delete selected Leave Application form',
                headerText: 'Delete ' + " the selected application " + '?',
                bodyText: 'Are you sure you want to delete this application?'
            };

            modalService.showModal({}, modalOptions).then(function (result) {
                if(result == 'ok')
                    LeaveApplicationService.LeaveApplication_DeleteLeaveData(data).then(function (data) {
                        //load application data
                        var inputEmail = null;
                        if ($scope.stage.view == 'UserView') {
                            inputEmail = userProfile.WorkEmail;
                        }
                        loadLeaveApplication(inputEmail);
                    });
            });
           

        }
        $scope.editLeaveApplication_Click = function (data) {
            $scope.selectedLeaveApplication = data;
            $scope.leave_type.forEach(function (item) {
                if (data.LeaveType == item.leave_type_code) {
                    $scope.selectedLeaveApplication.pallroll_code = item.leave_type_code;
                    $scope.selectedLeaveApplication.enable_leave_category = item.enable_leave_category;
                    return;
                }
            });


            $('#modalLeaveApplication').modal('show');
        }

        $scope.newLeaveApplication_Click = function () {

            $scope.selectedLeaveApplication.ID = undefined;
            $scope.selectedLeaveApplication = LeaveApplicationService.LeaveApplication_CreateNewLeaveData(userProfile).then(function (data) {
                $scope.selectedLeaveApplication = data;
                $('#modalLeaveApplication').modal('show');
            });

        }

        $scope.ClearFile = function () {
            document.getElementById("inpFile").value = "";
        }

        $scope.SaveLeaveApplication = function () {
            $scope.selectedLeaveApplication.Status = "Draft";
            console.log("Saving leave application");
            console.log($scope.selectedLeaveApplication.ReportsTo);
            if ( $scope.selectedLeaveApplication.ID !== undefined) {
                LeaveApplicationService.LeaveApplication_UpdateLeaveData($scope.selectedLeaveApplication).then(function (success) {
                    alert("successfully create a new item!");
                    //load application data
                    var inputEmail = null;
                    if ($scope.stage.view == 'UserView') {
                        inputEmail = userProfile.WorkEmail;
                    }
                    loadLeaveApplication(inputEmail);
                }, function (err) {
                    alert("Not successfully update a new item!");
                });
            } else {
                LeaveApplicationService.LeaveApplication_SaveOrCreateData($scope.selectedLeaveApplication).then(function (success) {
                    alert("successfully create a new item!");
                    //load application data
                    var inputEmail = null;
                    if ($scope.stage.view == 'UserView') {
                        inputEmail = userProfile.WorkEmail;
                    }
                    loadLeaveApplication(inputEmail);
                }, function (err) {
                    alert("Not successfully create a new item!");
                });
            }
            //files = $scope.selectedLeaveApplication.SupportingFiles;
            $('#modalLeaveApplication').modal('hide');
        }
        $scope.SubmitLeaveApplication = function () {
            $scope.selectedLeaveApplication.Status = "Pending";
            console.log("Saving leave application");
            console.log($scope.selectedLeaveApplication.ReportsTo);
            LeaveApplicationService.LeaveApplication_UpdateLeaveData($scope.selectedLeaveApplication).then(function (success) {
                alert("successfully submit the application!");
                //load application data
                var inputEmail = null;
                if ($scope.stage.view == 'UserView') {
                    inputEmail = userProfile.WorkEmail;
                }
                loadLeaveApplication(inputEmail);
            }, function (err) {
                alert("Not successfully submit the application!");
            });
            files = $scope.selectedLeaveApplication.SupportingFiles;
            $('#modalLeaveApplication').modal('hide');
        }

        $scope.RejectLeaveApplication = function (data) {

            var modalOptions = {
                closeButtonText: 'Cancel',
                actionButtonText: 'Reject selected Leave Application ',
                headerText: 'Reject ' + " the selected application " + '?',
                bodyText: 'Are you sure you want to reject this application?'
            };

            data.Status = "Rejected";

            modalService.showModal({}, modalOptions).then(function (result) {
                if (result == 'ok')
                    LeaveApplicationService.LeaveApplication_UpdateLeaveData(data).then(function (success) {
                        var inputEmail = null;
                        if ($scope.stage.view == 'UserView') {
                            inputEmail = userProfile.WorkEmail;
                        }
                        loadLeaveApplication(inputEmail);
                        alert("Application has been  rejected successfully");
                    }, function (err) {
                        alert("Application has been not rejected successfully");
                    });
            });

           
            
        }
        $scope.ApproveLeaveApplication = function (data) {
            data.Status = "Approved";
         
            var modalOptions = {
                closeButtonText: 'Cancel',
                actionButtonText: 'Reject selected Leave Application ',
                headerText: 'Reject ' + " the selected application " + '?',
                bodyText: 'Are you sure you want to reject this application?'
            };

            modalService.showModal({}, modalOptions).then(function (result) {
                if (result == 'ok')
                    LeaveApplicationService.LeaveApplication_UpdateLeaveData(data).then(function (success) {
                        var inputEmail = null;
                        if ($scope.stage.view == 'UserView') {
                            inputEmail = userProfile.WorkEmail;
                        }
                        loadLeaveApplication(inputEmail);
                        alert("Application has been  approved successfully");
                    }, function (err) {
                        alert("Application has been not approved successfully");
                    });
            });

        }


        $("#ppReportsTo").typeahead({
            source: LeaveApplicationService.LeaveApplication_Get_Approvers(),
            //autoSelect: trueFFF
        });

        $('#userTabs a').click(function (e) {
            e.preventDefault()
            $(this).tab('show');
        });


        function loadLeaveApplication(inputEmail) {
            LeaveApplicationService.LeaveApplication_LoadUserData(inputEmail).then(function (data) {
                $scope.LeaveApplicationData = data;
                $scope.FilterLeaveApplicationData = [];
                //draft status by default
                $scope.LeaveApplicationData.forEach(function (item) {

                    if ($scope.stage.view == 'UserView') {
                        if (item.Status == 'Draft') {
                            $scope.FilterLeaveApplicationData.push(item);
                        }
                        $scope.stage.tab = 'Draft';

                    }
                    if ($scope.stage.view == 'ManagerView') {
                        if (item.Status == 'Pending') {
                            $scope.FilterLeaveApplicationData.push(item);
                        }
                        $scope.stage.tab = 'Pending';
                    }

                });

            })
        }

        //https://stackoverflow.com/questions/28949911/what-does-this-format-means-t000000-000z
        function dateDifference(start, end) {

            // Copy date objects so don't modify originals
            var s = new Date(start);
            var e = new Date(end);

            // Set time to midday to avoid dalight saving and browser quirks
            s.setHours(12, 0, 0, 0);
            e.setHours(12, 0, 0, 0);

            // Get the difference in whole days
            var totalDays = Math.round((e - s) / 8.64e7);

            // Get the difference in whole weeks
            var wholeWeeks = totalDays / 7 | 0;

            // Estimate business days as number of whole weeks * 5
            var days = wholeWeeks * 5;

            // If not even number of weeks, calc remaining weekend days
            if (totalDays % 7) {
                s.setDate(s.getDate() + wholeWeeks * 7);

                while (s < e) {
                    s.setDate(s.getDate() + 1);

                    // If day isn't a Sunday or Saturday, add to business days
                    if (s.getDay() != 0 && s.getDay() != 6) {
                        ++days;
                    }
                }
            }
            return days;
        }
    }
})();