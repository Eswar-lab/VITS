
(function () {

})();
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
            //templateUrl: 'https://sharepointapps.blob.core.windows.net/scripts/directives/leaveapplication/LeaveApplication.html',
            replace: true,
            //require: 'ngModel',
            link: function ($scope, elem, attr, ctrl) {
                console.debug($scope);
            },
            controller: Controller
        };
    });
    Controller.$inject = ['$scope', 'SharePointOnlineService', '$timeout', 'ListService', '$q', 'LeaveApplicationService', 'modalService'];
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
        var main_managers = [];
        var is_line_manager = false;

        $scope.applications = [];
        $scope.selectedLeaveApplication = {};
        $scope.selectedLeaveApplication.selectedManager = undefined;
        $scope.selectedLeaveApplication.LeaveType = undefined;
        $scope.selectedLeaveApplication.PayrollCode = undefined;
        $scope.selectedLeaveApplication.enable_leave_category = false;
        $scope.selectedLeaveApplication.SupportingFiles = undefined;
        $scope.selectedLeaveApplication.RejectionReason = undefined;

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
        //map selected item to selectedApplication
        $scope.mapItemToSelApplication = function (item) {
            $scope.selectedLeaveApplication = item;

        }

        //Actual leave 
        $scope.$watch('selectedLeaveApplication.ActualLeave', function () {
            if ($scope.selectedLeaveApplication.TotalDays * 8 < $scope.selectedLeaveApplication.ActualLeave) {
                /// alert("incorrect");

                $("#error-message").show();
                $("#error-message").html("Invalid hours");

            } else {
                $("#error-message").hide();
            }
            //else ($scope.selectedLeaveApplication.TotalDays * 8 < $scope.selectedLeaveApplication.ActualLeave)
            //{

            //    $("#error-message").html("It should be between 9 to 16 hours");
            //}
            //else($scope.selectedLeaveApplication.TotalDays * 8 < $scope.selectedLeaveApplication.ActualLeave) {

            //    $("#error-message").html("It should be between 17 to 32 hours");
            //}
            //else($scope.selectedLeaveApplication.TotalDays * 8 < $scope.selectedLeaveApplication.ActualLeave) {

            //    $("#error-message").html("It should be between 33 to 40 hours");
            //}
        });
        //Leave Type and PayCode
        $scope.$watch('selectedLeaveApplication.LeaveType', function () {
            try {
                $scope.leave_type.forEach(function (item) {
                    if ($scope.selectedLeaveApplication.LeaveType == item.leave_type_code) {
                        $scope.selectedLeaveApplication.PayrollCode = item.leave_type_code;
                        $scope.selectedLeaveApplication.enable_leave_category = item.enable_leave_category;
                        return;
                    }
                });

            } catch (ex) {
                console.log(ex);
            }
        });

        //caluculate start day and last day
        $scope.$watch('[selectedLeaveApplication.StartDate ,selectedLeaveApplication.ReturnDate]', function () {
            $scope.selectedLeaveApplication.TotalDays = dateDifference($scope.selectedLeaveApplication.StartDate, $scope.selectedLeaveApplication.ReturnDate);


        });

        

        //constructor
        init();
        function init() {
            var hostUrl = SharePointOnlineService.GetHostWebUrl();
            var appUrl = SharePointOnlineService.GetAppWebUrl();
            var manageUrl = appUrl + "/_api/SP.AppContextSite(@target)/web/sitegroups/getbyname('Staff Leave Manager')/users?@target=%27" + hostUrl + "%27";
            var main_manageUrl = appUrl + "/_api/SP.AppContextSite(@target)/web/sitegroups/getbyname('Staff Leave Main Managers')/users?@target=%27" + hostUrl + "%27";
            // hide error message 
            $("#error-message").hide();
            // load line managers
            ListService.GetListByTitle(manageUrl).then(function (data) {
                console.log(data);
                $scope.managers = data;
                //load main mangers
                //main_managers
                ListService.GetListByTitle(main_manageUrl).then(function (data) {
                    console.log(data);
                    main_managers = data;

                    //load current user infor
                    SharePointOnlineService.LoadUserProfile().then(function (data) {
                        userProfile = data.userProfileProperties;

                        //load application data
                        loadLeaveApplication();

                        var full_name = userProfile.FirstName + " " + userProfile.LastName;
                        $scope.managers.forEach(function (item) {
                            if (item.Email == userProfile.WorkEmail) {
                                $scope.managers = main_managers;
                                is_line_manager = true;
                                return;
                            }

                        });

                    });
                }, function (err) {
                    console.log(err);

                });

            }, function (err) {
                console.log(err);


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
                if (filter == 'Cancel' && item.Status == 'Withdraw') {
                    $scope.FilterLeaveApplicationData.push(item);

                }
                if (filter == 'Pending') {
                    if (item.Status.includes('Pending')) {
                        $scope.FilterLeaveApplicationData.push(item);

                    }
                    //}
                    //if (filter == 'Approved') {
                    //    if (item.Status.includes('Pending')) {
                    //        $scope.FilterLeaveApplicationData.push(item);

                    //    }
                }

               
            });
            console.log($scope.FilterLeaveApplicationData);

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
                if (result == 'ok')
                    LeaveApplicationService.LeaveApplication_DeleteLeaveData(data).then(function (data) {
                        //load application data
                        loadLeaveApplication();

                    });
            });


        }
        $scope.editLeaveApplication_Click = function (data) {
            $scope.selectedLeaveApplication = data;
            $scope.leave_type.forEach(function (item) {
                if (data.PayrollCode == item.leave_type_code) {
                    $scope.selectedLeaveApplication.PayrollCode = item.leave_type_code;
                    $scope.selectedLeaveApplication.enable_leave_category = item.enable_leave_category;
                    return;
                }
            });


            $('#modalLeaveApplication').modal('show');
        }

        $scope.CancelLeaveApplication_Click = function (data) {
            data.Status = "Cancel";

            //$scope.selectedLeaveApplication = data;
            var modalOptions = {
                closeButtonText: 'Back',
                actionButtonText: 'Cancel selected Leave Application ',
                headerText: 'Cancel ' + " the selected application " + '?',
                bodyText: 'Are you sure you want to Cancel this application?'
            };

            modalService.showModal({}, modalOptions).then(function (result) {
                if (result == 'ok')
                    LeaveApplicationService.LeaveApplication_UpdateLeaveData(data).then(function (success) {
                        var inputEmail = null;
                        //load application data
                        loadLeaveApplication();

                        modalOptions.bodyText = "Application has been  Cancel successfully";
                        modalService.showModal({}, modalOptions);
                    }, function (err) {

                        modalOptions.bodyText = "Application has been not Cancel successfully";
                        modalService.showModal({}, modalOptions);
                    });
            });


        }

        $scope.WithdrawLeaveApplication_Click = function (data) {
            data.Status = "Withdraw";

            //$scope.selectedLeaveApplication = data;
            var modalOptions = {
                closeButtonText: 'Back',
                actionButtonText: 'Withdraw selected Leave Application ',
                headerText: 'Withdraw ' + " the selected application " + '?',
                bodyText: 'Are you sure you want to Withdraw this application?'
            };

            modalService.showModal({}, modalOptions).then(function (result) {
                if (result == 'ok')
                    LeaveApplicationService.LeaveApplication_UpdateLeaveData(data).then(function (success) {
                        var inputEmail = null;
                        //load application data
                        loadLeaveApplication();

                        modalOptions.bodyText = "Application has been  Withdraw successfully";
                        modalService.showModal({}, modalOptions);
                    }, function (err) {

                        modalOptions.bodyText = "Application has been not Withdraw successfully";
                        modalService.showModal({}, modalOptions);
                    });
            });


        }
        $scope.refreshLeaveApplication_Click = function () {
            init();
        }
        $scope.newLeaveApplication_Click = function () {
            // hide error message 
            $("#error-message").hide();

            $scope.selectedLeaveApplication.ID = undefined;
            if (userProfile == null || userProfile == undefined) {
                $('#modalLeaveApplication').modal('show');
                return;
            }

            $scope.selectedLeaveApplication.EmployeeEmail = userPro.UserName;
            $scope.selectedLeaveApplication.EmployeeSurname = userPro.LastName;
            $scope.selectedLeaveApplication.EmployeeFirstname = userPro.FirstName;
            $scope.selectedLeaveApplication.EmployeeID = userPro.EmployeeId;
            $scope.selectedLeaveApplication.Department = userPro.Department;
            $scope.selectedLeaveApplication.Designation = userPro.Title;
            $scope.selectedLeaveApplication.Remarks = '';
            $('#modalLeaveApplication').modal('show');

        }

        $scope.ClearFile = function () {
            document.getElementById("inpFile").value = "";
        }

        $scope.SaveLeaveApplication = function () {
            $scope.selectedLeaveApplication.Status = "Draft";
            var modalOptions = {
                closeButtonText: 'Cancel',
                actionButtonText: 'OK',
                headerText: 'Save ' + " the selected application " + '',
                bodyText: undefined
            };


            if ($scope.selectedLeaveApplication.ID !== undefined) {
                try {
                    var parts = document.getElementById("inpFile").value.split("\\");
                    var filename = parts[parts.length - 1];
                    var file = document.getElementById("inpFile").files[0];
                    //LeaveApplicationService.LeaveApplication_AddAttachedData($scope.selectedLeaveApplication.ID, filename, file);
                } catch (ex) {
                    console.log(ex);
                }

                //reformat startdate and enddate
                $scope.selectedLeaveApplication.StartDate = moment($scope.selectedLeaveApplication.StartDate).format('DD-MM-YYYY');
                $scope.selectedLeaveApplication.ReturnDate = startDate = moment($scope.selectedLeaveApplication.ReturnDate).format('DD-MM-YYYY');



                LeaveApplicationService.LeaveApplication_UpdateLeaveData($scope.selectedLeaveApplication).then(function (success) {
                    modalOptions.bodyText = "successfully create a new item!";
                    modalService.showModal({}, modalOptions).then(function (result) { });
                    //load application data
                    loadLeaveApplication();

                }, function (err) {
                    $scope.selectedLeaveApplication.Status = "Draft";
                    console.log(err);
                    modalOptions.bodyText = "Not successfully update a new item!";
                    modalService.showModal({}, modalOptions).then(function (result) { });
                });
            } else {

                LeaveApplicationService.LeaveApplication_SaveOrCreateData($scope.selectedLeaveApplication).then(function (success) {
                    try {
                        var parts = document.getElementById("inpFile").value.split("\\");
                        var filename = parts[parts.length - 1];
                        var file = document.getElementById("inpFile").files[0];
                        //LeaveApplicationService.LeaveApplication_AddAttachedData(success.ID, $scope.selectedLeaveApplication.SupportingFiles, $scope.selectedLeaveApplication.SupportingFile);
                    } catch (ex) {
                        console.log(ex);
                    }

                    modalOptions.bodyText = "successfully create a new item!";
                    modalService.showModal({}, modalOptions).then(function (result) { });
                    loadLeaveApplication();

                }, function (err) {
                    $scope.selectedLeaveApplication.Status = "Draft";
                    console.log(err);
                    modalOptions.bodyText = "Not successfully update a new item!";
                    modalService.showModal({}, modalOptions).then(function (result) { });
                });
            }
            //files = $scope.selectedLeaveApplication.SupportingFiles;
            $('#modalLeaveApplication').modal('hide');
        }
        $scope.SubmitLeaveApplication = function () {

            if (is_line_manager == true)
                $scope.selectedLeaveApplication.Status = "Pending Final Approval";
            else
               
            $scope.selectedLeaveApplication.Status = "Pending Line Manager";

            var modalOptions = {
                closeButtonText: 'Cancel',
                actionButtonText: 'OK',
                headerText: 'Submit ' + " the selected application " + '',
                bodyText: undefined
            };
            modalOptions.bodyText = "Do you want to submit this application? ";
            modalService.showModal({}, modalOptions).then(function (result) {
                if (result == 'ok') {
                    var errs = validateLeaveApplication($scope.selectedLeaveApplication);
                    modalOptions.headerText = "Error ";
                    modalOptions.bodyText = "Error:  " + errs.join(',');
                    if (errs.length > 0) {
                        modalService.showModal({}, modalOptions);
                        $('#modalLeaveApplication').modal('show');
                        return;
                    }

                    if ($scope.selectedLeaveApplication.ID !== null && $scope.selectedLeaveApplication.ID !== undefined) {

                        LeaveApplicationService.LeaveApplication_UpdateLeaveData($scope.selectedLeaveApplication).then(function (success) {
                            modalOptions.bodyText = "successfully submit the application!";
                            modalService.showModal({}, modalOptions);
                            loadLeaveApplication();

                        }, function (err) {
                            modalOptions.bodyText = "Not successfully submit the application!";
                            modalService.showModal({}, modalOptions);
                        });
                    }
                    else {
                        var errs = validateLeaveApplication($scope.selectedLeaveApplication);
                        modalOptions.headerText = "Error  ";
                        modalOptions.bodyText = "Error:  " + errs.join(',');
                        if (errs.length > 0) {
                            modalService.showModal({}, modalOptions);
                            $('#modalLeaveApplication').modal('show');
                            return;
                        }

                        LeaveApplicationService.LeaveApplication_SaveOrCreateData($scope.selectedLeaveApplication).then(function (success) {
                            alert("successfully create a new item!");
                            //load application data
                            loadLeaveApplication();

                        }, function (err) {
                            $scope.selectedLeaveApplication.Status = "Draft";
                            console.log(err);
                            modalOptions.bodyText = "Not successfully create a new item!";
                            modalService.showModal({}, modalOptions);


                        });
                    }
                }
            });

            // files = $scope.selectedLeaveApplication.SupportingFiles;

        }



        $scope.RejectLeaveApplication = function () {

            $scope.selectedLeaveApplication.Status = "Rejected";
            LeaveApplicationService.LeaveApplication_UpdateLeaveData($scope.selectedLeaveApplication).then(function (success) {
                var inputEmail = null;
                //load application data
                loadLeaveApplication();
                modalOptions.bodyText = "Application has been  rejected successfully";
                modalService.showModal({}, modalOptions);
            }, function (err) {

                modalOptions.bodyText = "Application has been not rejected successfully";
                modalService.showModal({}, modalOptions);
            });
        }


        $scope.MainManagerApproveLeaveApplication = function (data) {
            data.Status = "Approved";

            var modalOptions = {
                closeButtonText: 'Cancel',
                actionButtonText: 'Approve selected Leave Application ',
                headerText: 'Approve ' + " the selected application " + '?',
                bodyText: 'Are you sure you want to approve this application?'
            };

            modalService.showModal({}, modalOptions).then(function (result) {
                if (result == 'ok')
                    LeaveApplicationService.LeaveApplication_UpdateLeaveData(data).then(function (success) {
                        var inputEmail = null;
                        //load application data
                        loadLeaveApplication();

                        modalOptions.bodyText = "Application has been  approved successfully";
                        modalService.showModal({}, modalOptions);
                    }, function (err) {

                        modalOptions.bodyText = "Application has been not approved successfully";
                        modalService.showModal({}, modalOptions);
                    });
            });

        }

        $scope.ApproveLeaveApplication = function (data) {


            var modalOptions = {
                closeButtonText: 'Cancel',
                actionButtonText: 'Approve selected Leave Application ',
                headerText: 'Approve ' + " the selected application " + '?',
                bodyText: 'Are you sure you want to approve this application?'
            };

            modalService.showModal({}, modalOptions).then(function (result) {
                data.Status = "Pending Final Approval";
                if (result == 'ok')
                    LeaveApplicationService.LeaveApplication_UpdateLeaveData(data).then(function (success) {
                        var inputEmail = null;
                        //load application data
                        loadLeaveApplication();

                        modalOptions.bodyText = "Application has been  approved successfully";
                        modalService.showModal({}, modalOptions);
                    }, function (err) {

                        modalOptions.bodyText = "Application has been not approved successfully";
                        modalService.showModal({}, modalOptions);
                    });
            });

        }



        function loadLeaveApplication() {
            var inputEmail = null;
            inputEmail = userProfile.WorkEmail;
            if ($scope.stage.view == 'UserView') {
                loadLeaveApplicationByUserType(inputEmail, USER_TYPE.user);
            }
            else if ($scope.stage.view == 'ManagerView') {
                loadLeaveApplicationByUserType(inputEmail, USER_TYPE.lineManager);
            }
            else if ($scope.stage.view == 'MainManagerView') {
                loadLeaveApplicationByUserType(inputEmail, USER_TYPE.mainManager);
            }
        }

        //Load Leave Application
        // 1 : user
        // 2 : lineManager
        // 3 : mainManager

        function loadLeaveApplicationByUserType(userType) {
            var inputEmail = userProfile.WorkEmail;
            LeaveApplicationService.LeaveApplication_LoadUserData(inputEmail, userType).then(function (data) {

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
                        if (item.Status == 'Pending Line Manager') {
                            $scope.FilterLeaveApplicationData.push(item);
                        }
                        $scope.stage.tab = 'Pending Line Manager';
                    }

                    if ($scope.stage.view == 'MainManagerView') {
                        if (item.Status == 'Pending Final Approval') {
                            $scope.FilterLeaveApplicationData.push(item);
                        }
                        $scope.stage.tab = 'Pending Final Approval';
                    }

                });

            })
        }



        function validateLeaveApplication(leaveApplication) {
            var errs = [];
            //validate for actual leave and leave
            if ($scope.selectedLeaveApplication.TotalDays * 8 < $scope.selectedLeaveApplication.ActualLeave)
                errs.push("actual leave is greater than total days * 8");
            LEAVE_APPLICATION_FIELDS.forEach(function (item) {
                if (item.required == true) {
                    if (leaveApplication[item.name] == null || leaveApplication[item.name] == undefined) {
                        errs.push(item.name);
                    }
                }
            });
            return errs;

        }

        //https://stackoverflow.com/questions/28949911/what-does-this-format-means-t000000-000z
        function dateDifference(start, end) {

            // Copy date objects so don't modify originals
            var s = new moment(start, "DD/MM/YYYY");
            var e = new moment(end, "DD/MM/YYYY");

            // Get the difference in whole days
            var totalDays = e.diff(s, 'days');

            // Get the difference in whole weeks
            var wholeWeeks = totalDays / 7 | 0;

            // Estimate business days as number of whole weeks * 5
            var days = totalDays - wholeWeeks * 2;

            if (s.isoWeekday() > e.isoWeekday()) {
                days = totalDays - 2;
            }
            if (days < 0)
                return 0;
            // If not even number of weeks, calc remaining weekend days
            //if (totalDays % 7) {
            //    s.setDate(s.getDate() + wholeWeeks * 7);

            //    while (s < e) {
            //        s.setDate(s.getDate() + 1);

            //        // If day isn't a Sunday or Saturday, add to business days
            //        if (s.getDay() != 0 && s.getDay() != 6) {
            //            ++days;
            //        }
            //    }
            //}
            return days;
        }

        //JQuery code for Leave Application


        $("#ppReportsTo").typeahead({
            source: LeaveApplicationService.LeaveApplication_Get_Approvers(),
            //autoSelect: trueFFF
        });

        $('#userTabs a').click(function (e) {
            e.preventDefault()
            $(this).tab('show');
        });
        $('#managerTabs a').click(function (e) {
            e.preventDefault()
            $(this).tab('show');
        });
        //date formate
        //date formate



        //datetimepicker for start and end date

        jQuery("#inpStartDate").datepicker({ format: 'dd/mm/yyyy', min: 0});
       
        jQuery("#inpReturnDate").datepicker({ format: 'dd/mm/yyyy' });




    }
})();