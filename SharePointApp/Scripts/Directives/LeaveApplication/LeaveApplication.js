
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
            //templateUrl: 'https://localhost:44326/scripts/Directives/LeaveApplication/LeaveApplication.html',
            templateUrl: 'https://sharepointapps.blob.core.windows.net/scripts/directives/leaveapplication/LeaveApplication.html',
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
            var promise1 = ListService.GetListByTitle(manageUrl);
            var promise2 = ListService.GetListByTitle(main_manageUrl);
            var promise3 = SharePointOnlineService.LoadUserProfile();

            $q.all([promise1, promise2, promise3])
                .then(function (data) {
                    console.log(data[0], data[1], data[2]);

                    $scope.managers = data[0];//line managers
                    main_managers = data[1];//main managers
                    userProfile = data[2].userProfileProperties //current user profile
                    //load user leave applications
                    $scope.refreshLeaveApplication_Click();

                    //check if current user in line manager group
                    $scope.managers.forEach(function (item) {
                        if (item.Email == userProfile.WorkEmail) {
                            $scope.managers = main_managers;
                            is_line_manager = true;
                            return;
                        }

                    });

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
                        $scope.refreshLeaveApplication_Click();

                    });
            });


        }
        $scope.editLeaveApplication_Click = function (data) {
            LEAVE_APPLICATION_FIELDS.forEach(function (item) {
                if (item.required == true) {
                        jQuery("#" + item.id).removeClass("has-error");
                        jQuery("#" + item.id + " input").removeClass("has-error");
                }
            });
            $scope.selectedLeaveApplication = data;
            $scope.leave_type.forEach(function (item) {
                if (data.PayrollCode == item.leave_type_code) {
                    $scope.selectedLeaveApplication.LeaveType = item.leave_type_code;
                    $scope.selectedLeaveApplication.PayrollCode = item.leave_type_code;
                    $scope.selectedLeaveApplication.enable_leave_category = item.enable_leave_category;
                    return;
                }
                if (data.LeaveType == item.leave_type_text) {
                    $scope.selectedLeaveApplication.LeaveType = item.leave_type_code;
                    $scope.selectedLeaveApplication.PayrollCode = item.leave_type_code;
                    $scope.selectedLeaveApplication.enable_leave_category = item.enable_leave_category;
                    return;
                }
            });


            $('#modalLeaveApplication').modal('show');
        }

        $scope.CancelLeaveApplication_Click = function (data) {
           

            //$scope.selectedLeaveApplication = data;
            var modalOptions = {
                closeButtonText: 'Back',
                actionButtonText: 'Cancel selected Leave Application ',
                headerText: 'Cancel ' + " the selected application " + '?',
                bodyText: 'Are you sure you want to Cancel this application?'
            };

            modalService.showModal({}, modalOptions).then(function (result) {
                if (result == 'ok'){
                    data.Status = "Cancel";
                    LeaveApplicationService.LeaveApplication_UpdateLeaveData(data).then(function (success) {
                        var inputEmail = null;
                        //load application data
                        $scope.refreshLeaveApplication_Click();
                    }, function (err) {
                       console.log(err);
                    });
                }
             });

             

        }

        $scope.WithdrawLeaveApplication_Click = function (data) {

            //$scope.selectedLeaveApplication = data;
            var modalOptions = {
                closeButtonText: 'Back',
                actionButtonText: 'Withdraw selected Leave Application ',
                headerText: 'Withdraw ' + " the selected application " + '?',
                bodyText: 'Are you sure you want to Withdraw this application?'
            };

            modalService.showModal({}, modalOptions).then(function (result) {
                if (result == 'ok'){
                    data.Status = "Withdraw";
                    LeaveApplicationService.LeaveApplication_UpdateLeaveData(data).then(function (success) {
                        var inputEmail = null;
                        //load application data
                        $scope.refreshLeaveApplication_Click();
                    }, function (err) {
                        console.log(err);
                    });
                }
            });


        }
        $scope.refreshLeaveApplication_Click = function () {
            loadLeaveApplication();
            $("#userTabs li").each(function(){$(this).removeClass("active")}); $("#userTabs li").first().addClass("active");
            $("#managerTabs li").each(function(){$(this).removeClass("active")}); $("#managerTabs li").first().addClass("active");

        }
        $scope.newLeaveApplication_Click = function () {
            // hide error message 
            $("#error-message").hide();

            //$scope.selectedLeaveApplication.ID = undefined;
            if (userProfile == null || userProfile == undefined) {
                $('#modalLeaveApplication').modal('show');
                return;
            }
            $scope.selectedLeaveApplication.ID = undefined;
            $scope.selectedLeaveApplication.EmployeeEmail = userProfile.UserName;
            $scope.selectedLeaveApplication.EmployeeSurname = userProfile.LastName;
            $scope.selectedLeaveApplication.EmployeeFirstname = userProfile.FirstName;
            $scope.selectedLeaveApplication.EmployeeID = userProfile.EmployeeId;
            $scope.selectedLeaveApplication.Department = userProfile.Department;
            $scope.selectedLeaveApplication.Designation = userProfile.Title;

            LEAVE_APPLICATION_FIELDS.forEach(function (item) {
                if (item.required == true) {
                        jQuery("#" + item.id).removeClass("has-error");
                        jQuery("#" + item.id + " input").removeClass("has-error");
                }
            });
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
                //attach document
                attachDocument();
                //end
                //If leaveApplication is  exist, update selected leave application
                LeaveApplicationService.LeaveApplication_UpdateLeaveData($scope.selectedLeaveApplication).then(function (success) {
                  
                    //load application data
                    $scope.refreshLeaveApplication_Click();


                }, function (err) {
                    $scope.selectedLeaveApplication.Status = "Draft";
                    console.log(err);
                   
                });
            } else {
                //If leaveApplication is not exist, create a new leave application
                LeaveApplicationService.LeaveApplication_SaveOrCreateData($scope.selectedLeaveApplication).then(function (success) {

                    console.log(success);
                    $scope.selectedLeaveApplication.ID = success.$2_0.get_properties().Id;
                    //attach document
                    attachDocument();
                    //end
                    $scope.refreshLeaveApplication_Click();

                }, function (err) {
                    $scope.selectedLeaveApplication.Status = "Draft";
                    console.log(err);
                
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
                    if (errs.length > 0) {
                        $('#modalLeaveApplication').modal('show');
                        return;
                    }
                    
                    if ($scope.selectedLeaveApplication.ID !== null && $scope.selectedLeaveApplication.ID !== undefined) {
                        //attach document
                        attachDocument();
                        //end
                        LeaveApplicationService.LeaveApplication_UpdateLeaveData($scope.selectedLeaveApplication).then(function (success) {
                           
                            
                            $scope.refreshLeaveApplication_Click();

                        }, function (err) {
                            console.log(err);
                        });
                    }
                    else {
                        var errs = validateLeaveApplication($scope.selectedLeaveApplication);
                        if (errs.length > 0) {
                            $('#modalLeaveApplication').modal('show');
                            return;
                        }

                        LeaveApplicationService.LeaveApplication_SaveOrCreateData($scope.selectedLeaveApplication).then(function (success) {
                             
                            //load application data
                            $scope.refreshLeaveApplication_Click();
                            //attach document
                            $scope.selectedLeaveApplication.ID = success.$2_0.get_properties().Id;
                            attachDocument();
                            //end

                        }, function (err) {
                            $scope.selectedLeaveApplication.Status = "Draft";
                            console.log(err);

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
                $scope.refreshLeaveApplication_Click();
                modalOptions.bodyText = "Application has been  rejected successfully";
                modalService.showModal({}, modalOptions);
            }, function (err) {

                modalOptions.bodyText = "Application has been not rejected successfully";
                modalService.showModal({}, modalOptions);
            });
        }
        $scope.MainManagerApproveLeaveApplication = function (data) {

            var modalOptions = {
                closeButtonText: 'Cancel',
                actionButtonText: 'Approve selected Leave Application ',
                headerText: 'Approve ' + " the selected application " + '?',
                bodyText: 'Are you sure you want to approve this application?'
            };

            modalService.showModal({}, modalOptions).then(function (result) {
                data.Status = "Approved";
                if (result == 'ok'){
                    LeaveApplicationService.LeaveApplication_UpdateLeaveData(data).then(function (success) {
                        var inputEmail = null;
                        //load application data
                        $scope.refreshLeaveApplication_Click();

                    }, function (err) {
                        console.log(err);
                    });
                }
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
                        $scope.refreshLeaveApplication_Click();

                     
                    }, function (err) {
                        console.log(err);
                    });
            });

        }



        function loadLeaveApplication() {
            var inputEmail = null;
            inputEmail = userProfile.WorkEmail;
            if ($scope.stage.view == 'UserView') {
                inputEmail = userProfile.WorkEmail;
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

        function loadLeaveApplicationByUserType(inputEmail, userType) {

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

            return days;
        }

        //JQuery code for Leave Application


        //Attachment start
        function attachDocument() {
         
            var process = false;
            var fileInput = $("#inpFile");
            if (fileInput.length < 0 || fileInput[0] == undefined ||typeof(fileInput[0].files) == 'undefined')
                return;
            if ($scope.selectedLeaveApplication.ID == null || fileInput[0].files.length == 0)
                return;


            LeaveApplicationService.LeaveApplication_AddAttachedData(fileInput, $scope.selectedLeaveApplication.ID);

        }

        //Attachment end

        $scope.$watch('selectedLeaveApplication.LeaveCategory', function () {
            if ($scope.selectedLeaveApplication.LeaveCategory  == 2) {
                // $scope.selectedLeaveApplication.enable_leave_category = false;
                jQuery("#enable_leave_category").hide();
            }else{
                jQuery("#enable_leave_category").show();
            }

        });
         //Actual leave 
         $scope.$watch('selectedLeaveApplication.ActualLeave', function () {
            if ($scope.selectedLeaveApplication.TotalDays * 8 < $scope.selectedLeaveApplication.ActualLeave) {
                /// alert("incorrect");
                $("#error-message").show();
                $("#error-message").html("Invalid hours");

            } else {
                $("#error-message").hide();
            }

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
        //vailidate errors on form
        function validateLeaveApplication(leaveApplication) {
            var errs = [];
            //validate for actual leave and leave
            if ($scope.selectedLeaveApplication.TotalDays * 8 < $scope.selectedLeaveApplication.ActualLeave)
                errs.push("actual leave is greater than total days * 8");
            LEAVE_APPLICATION_FIELDS.forEach(function (item) {
                if (item.required == true) {
                    if (leaveApplication[item.name] == null || leaveApplication[item.name] == undefined) {
                        errs.push(item.error_mess);
                        jQuery("#" + item.id).addClass("has-error");
                        jQuery("#" + item.id + " input").addClass("has-error");
                    }
                    
                }
            });
            return errs;

        }

        //caluculate start day and last day and set restricted return date
        $scope.$watch('[selectedLeaveApplication.StartDate ,selectedLeaveApplication.ReturnDate]', function () {
            $scope.selectedLeaveApplication.TotalDays = dateDifference($scope.selectedLeaveApplication.StartDate, $scope.selectedLeaveApplication.ReturnDate);
            
        });

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
      
        //datetimepicker for start and end date
        $scope.$watch('[selectedLeaveApplication.StartDate]', function () {
            $scope.selectedLeaveApplication.TotalDays = dateDifference($scope.selectedLeaveApplication.StartDate, $scope.selectedLeaveApplication.ReturnDate);
            jQuery("#inpReturnDate").val("");
            if($scope.selectedLeaveApplication.StartDate !== null || $scope.selectedLeaveApplication.StartDate !== undefined)
                jQuery("#inpReturnDate").datepicker('setStartDate', $scope.selectedLeaveApplication.StartDate);
                
        });
        jQuery("#inpStartDate").datepicker({ format: 'dd/mm/yyyy', startDate: new Date() });
        jQuery("#inpReturnDate").datepicker({ format: 'dd/mm/yyyy', startDate: new Date() });
        jQuery("#inpStartDate").prop("readonly", true);
        jQuery("#inpReturnDate").prop("readonly", true);

    }
})();