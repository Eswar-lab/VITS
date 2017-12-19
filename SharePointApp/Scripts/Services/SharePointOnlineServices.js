(function () {
    'use strict';

    angular
        .module('SharePointOnlineServices', ['ngRoute', 'ngStorage'])
        .factory('SharePointOnlineService', SharePointOnlineService);

    SharePointOnlineService.$inject = ['$http', '$rootScope', '$timeout', '$q', '$localStorage', '$location', 'modalService'];

    function SharePointOnlineService($http, $rootScope, $timeout, $q, $localStorage, $location, modalService) {
        var AppServiceFactory = {};
        function getQueryStringParameter(paramToRetrieve) {
            var params =
                document.URL.split("?")[1].split("&");
            for (var i = 0; i < params.length; i = i + 1) {
                var singleParam = params[i].split("=");
                if (singleParam[0] == paramToRetrieve)
                    return singleParam[1];
            }
            return "";
        }

        AppServiceFactory.GetDocumentSets = function (libraryUrl) {
            // TODO: Add JSOM code to load all documentSet properties from given library
        }
        // Read a page's GET URL variables and return them as an associative array.
        AppServiceFactory.GetURLParameters = function (paramName) {
            var sURL = window.document.URL.toString();
            if (sURL.indexOf("?") > 0) {
                var arrParams = sURL.split("?");
                var arrURLParams = arrParams[1].split("&");
                var arrParamNames = new Array(arrURLParams.length);
                var arrParamValues = new Array(arrURLParams.length);

                var i = 0;
                for (i = 0; i < arrURLParams.length; i++) {
                    var sParam = arrURLParams[i].split("=");
                    arrParamNames[i] = sParam[0];
                    if (sParam[1] != "")
                        arrParamValues[i] = unescape(sParam[1]);
                    else
                        arrParamValues[i] = "No Value";
                }

                for (i = 0; i < arrURLParams.length; i++) {
                    if (arrParamNames[i] == paramName) {
                        //alert("Parameter:" + arrParamValues[i]);
                        return arrParamValues[i];
                    }
                }
                // Parameter not found
                return null;
            }
        }

        AppServiceFactory.GetAppWebUrl = function () {
            var appweburl = decodeURIComponent(AppServiceFactory.getQueryStringParameter("SPAppWebUrl"));
            appweburl = appweburl.replace('#/', '');
            return appweburl;
        }
        AppServiceFactory.GetHostWebUrl = function () {
            return decodeURIComponent(getQueryStringParameter("SPHostUrl"));
        }

        AppServiceFactory.setHtmlStorage = function (name, value) {
            //var name = name + '_' + AppServiceFactory.GetURLParameters("wpId");

            var cacheInterval = AppServiceFactory.GetURLParameters("CacheInterval");
            var cacheExpires = cacheInterval * 3600;
            var expires = cacheExpires;
            if (cacheExpires == undefined || cacheExpires == 'null') {
                expires = 3600; // set to 1 hr;
            }

            var date = new Date();
            var schedule = Math.round((date.setSeconds(date.getSeconds() + expires)) / 1000);

            $localStorage.name = value;
            name = name + '_time';
            $localStorage.name = schedule;// set(name + '_time', schedule);
        }

        AppServiceFactory.statusHtmlStorage = function (name) {

            var date = new Date();
            var current = Math.round(+date / 1000);

            var name_time = name + '_time';

            // Get Schedule
            var stored_time = $localStorage.name_time;
            if (stored_time == undefined || stored_time == null) { var stored_time = 0; }

            // Expired
            if (stored_time < current) {
                removeHtmlStorage(name);                // Remove
                return 0;
            } else {
                return 1;
            }
        }

        AppServiceFactory.forceCacheDeletion = function (name) {
            removeHtmlStorage(name);
        }

        /*
        * Consolidated method for waiting for dependent SharePoint
        *     JavaScript libraries to load
        * sodScripts - array of string keys for SharePoint libraries
        * onLoadAction - callback function once all scripts are loaded
       */
        AppServiceFactory.SPSODAction = function (sodScripts, onLoadAction) {
            if (SP.SOD.loadMultiple) {
                for (var x = 0; x < sodScripts.length; x++) {
                    //register any unregistered scripts
                    if (!_v_dictSod[sodScripts[x]]) {
                        //  if (sodScripts[x] == "SP.RequestExecutor.js") {
                        //     SP.SOD.registerSod(sodScripts[x], hostweburl + '/_layouts/15/' + sodScripts[x]);
                        // } else {                        
                        SP.SOD.registerSod(sodScripts[x], '/_layouts/15/' + sodScripts[x]);

                        // }
                    }
                }
                SP.SOD.loadMultiple(sodScripts, onLoadAction);
            } else
                ExecuteOrDelayUntilScriptLoaded(onLoadAction, sodScripts[0]);
        }


        AppServiceFactory.getQueryStringParameter = function (paramToRetrieve) {
            var params =
                document.URL.split("?")[1].split("&");
            for (var i = 0; i < params.length; i = i + 1) {
                var singleParam = params[i].split("=");
                if (singleParam[0] == paramToRetrieve)
                    return singleParam[1];
            }
        }

        AppServiceFactory.getCacheValue = function (name) {
            return $localStorage.name;
        }

        AppServiceFactory.Timesheet_Get_TimesheetData_ForPeriod = function (useremail, startDate, endDate) {
            return
            new [
                new {
                    'Employee': 'khang@vit.edu.au', 'Manager': 'Aaron',
                    'Department': 'Moodle', 'Period': 'Fortnightly', 'TimesheetType': 'General',
                    'TaskCodes': [], 'StartDate': '13-Nov-2017', 'StartTimes': ['8:00 AM'],
                    'EndTimes': ['10:00 AM'], 'BreakTime': '30', 'Total': '6', 'Absent': false,
                    'AbsentReason': '', 'ApprovalStatus': 'Not Started'
                },
                new {
                    'Employee': 'khang@vit.edu.au', 'Manager': 'Aaron',
                    'Department': 'Moodle', 'Period': 'Fortnightly', 'TimesheetType': 'Academic',
                    'TaskCodes': ['LEC', 'RLEC'], 'StartDate': '14-Nov-2017', 'StartTimes': ['8:00 AM', '1:00 PM'],
                    'EndTimes': ['10:00 AM', '3:00 PM'], 'BreakTime': '30', 'Total': '6', 'Absent': false,
                    'AbsentReason': '', 'ApprovalStatus': 'Not Started'
                }
            ];
        }

        

        AppServiceFactory.LeaveApplication_Get_Approvers = function () {
            return [{ id: "someId1", name: "Display name 1" },
            { id: "someId2", name: "Display name 2" }];
        }

          AppServiceFactory.LeaveApplication_SaveOrCreateData = function (data) {
            //... Nidhi's code will go here > JSOM
            var listTitle = "Staff Leave Application";
            
            ///This function will save data in Staff Leave Application list
            var hostUrl = AppServiceFactory.GetHostWebUrl();
            var appUrl = AppServiceFactory.GetAppWebUrl();
            var appcontext = new SP.ClientContext(appUrl);
            var hostcontext = new SP.AppContextSite(appcontext, hostUrl);
            var hostweb = hostcontext.get_web();
            var list = hostweb.get_lists().getByTitle(listTitle);
            var itemCreateInfo = new SP.ListItemCreationInformation();
            var oListItem = list.addItem(itemCreateInfo);
           // var leaveType = $(data.LeaveType).text();
            oListItem.set_item('EmployeeSurname', data.EmployeeSurname);
            oListItem.set_item('FirstName', data.EmployeeFirstname);
            oListItem.set_item('EmployeeID', data.EmployeeID);
            oListItem.set_item('DepartmentName', data.Department);
            oListItem.set_item('Designation', data.Designation);
            oListItem.set_item('ReportTo', data.ReportsTo);
            oListItem.set_item('PRCODE', JSON.parse(data.LeaveType).leave_type_text);
            oListItem.set_item('LeaveType', data.pallroll_code);
            //oListItem.set_item('PayrollCode', data.pallroll_code);

            oListItem.set_item('Firstdayofleave', data.StartDate);
            oListItem.set_item('Lastdayofleave', data.ReturnDate);
            oListItem.set_item('Totalnumberofdays', data.TotalDays);
            oListItem.set_item('Status', data.Status);
            oListItem.set_item('Remarks', data.Remarks);
          //  oListItem.set_item('ActualLeave', data.ActualLeave);
            oListItem.update();
            appcontext.load(oListItem);
            appcontext.executeQueryAsync(
                LeaveApplication_SaveOrCreateData_onQueryItemSucceeded,
                LeaveApplication_SaveOrCreateData_onQueryItemFailed);
        }

          function LeaveApplication_SaveOrCreateData_onQueryItemSucceeded(sender, args) {
            alert('Item created: ');
        }

        function LeaveApplication_SaveOrCreateData_onQueryItemFailed(sender, args) {
            alert('Request failed. ' + args.get_message() + '\n' + args.get_stackTrace());
        }



        AppServiceFactory.LeaveApplication_SubmitLeaveApplication = function (data) {
            //... Nidhi's code will go here > JSOM
            var listTitle = "Staff Leave Application";

            ///This function will save data in Staff Leave Application list
            var hostUrl = AppServiceFactory.GetHostWebUrl();
            var appUrl = AppServiceFactory.GetAppWebUrl();
            var appcontext = new SP.ClientContext(appUrl);
            var hostcontext = new SP.AppContextSite(appcontext, hostUrl);
            var hostweb = hostcontext.get_web();
            var list = hostweb.get_lists().getByTitle(listTitle);
            var itemCreateInfo = new SP.ListItemCreationInformation();
            var oListItem = list.addItem(itemCreateInfo);
            oListItem.set_item('EmployeeSurname', data.EmployeeSurname);
            oListItem.set_item('FirstName', data.EmployeeFirstname);
            oListItem.set_item('EmployeeID', data.EmployeeID);
            oListItem.set_item('DepartmentName', data.Department);
            oListItem.set_item('Designation', data.Designation);
            oListItem.set_item('ReportTo', data.ReportsTo);
            oListItem.set_item('PRCODE', data.LeaveType);
            oListItem.set_item('LeaveType', data.pallroll_code);
            //oListItem.set_item('PayrollCode', data.pallroll_code);

            oListItem.set_item('Firstdayofleave', data.StartDate);
            oListItem.set_item('Lastdayofleave', data.ReturnDate);
            oListItem.set_item('Totalnumberofdays', data.TotalDays);
            oListItem.set_item('Status', data.Status);
            oListItem.set_item('Remarks', data.Remarks);
            //  oListItem.set_item('ActualLeave', data.ActualLeave);
            oListItem.update();
            appcontext.load(oListItem);
            appcontext.executeQueryAsync(
                LeaveApplication_SubmitLeaveApplication_onQueryItemSucceeded,
                LeaveApplication_SubmitLeaveApplication_onQueryItemFailed);
        }

        function LeaveApplication_SubmitLeaveApplication_onQueryItemSucceeded(sender, args) {
            alert('Item  Submitted');
        }

        function LeaveApplication_SubmitLeaveApplication_onQueryItemFailed(sender, args) {
            alert('Request failed. ' + args.get_message() + '\n' + args.get_stackTrace());
        }


        AppServiceFactory.LeaveApplication_LoadUserData = function () {
            
            var deffer = $q.defer();
            var listTitle = "Staff Leave Application";

            ///This function will filter data in Staff Leave Application list with status column
            var hostUrl = AppServiceFactory.GetHostWebUrl();
            var appUrl = AppServiceFactory.GetAppWebUrl();
            var appcontext = new SP.ClientContext(appUrl);
            var hostcontext = new SP.AppContextSite(appcontext, hostUrl);
            var hostweb = hostcontext.get_web();
            var list = hostweb.get_lists().getByTitle(listTitle);
            var oList = hostweb.get_lists().getByTitle(listTitle);
            var camlQuery = new SP.CamlQuery();

            var camlQ = '<View><Query><Where></Where></Query></View>';
            camlQuery.set_viewXml(camlQ);
            var collListItem = oList.getItems(camlQuery);
            appcontext.load(collListItem);
            appcontext.executeQueryAsync(function () {
                try {
                    var data = [];

                    var listItemInfo = '';
                    var listItemEnumerator = collListItem.getEnumerator();
                    while (listItemEnumerator.moveNext()) {
                        var oListItem = listItemEnumerator.get_current();
                        listItemInfo = oListItem.get_id();
                        //var remark = oListItem.get_fieldValues().Remarks;
                        //alert(remark);

                        //data[0].get_fieldValues().Status
                        var remarkStr = undefined;
                        var PRcodeObj = {
                          leave_type_text : undefined,
                          leave_type_code : undefined
                        } 
                    
                        
                     
                        try {
                            remarkStr   = $(oListItem.get_fieldValues().Remarks).text();
                            PRcodeObj = JSON.parse(oListItem.get_fieldValues().PRCODE);
                        } catch (ex) {
                            console.log(ex);
                        }
                            var obj = {
                                'EmployeeEmail': oListItem.get_fieldValues().Author['$6_2'],
                                'EmployeeID': oListItem.get_fieldValues().EmployeeID,
                                'EmployeeSurname': oListItem.get_fieldValues().EmployeeSurname,
                                'EmployeeFirstname': oListItem.get_fieldValues().FirstName,
                                'Department': oListItem.get_fieldValues().DepartmentName,
                                'Designation': oListItem.get_fieldValues().Designation,
                                'ReportsTo': oListItem.get_fieldValues().ReportTo,
                                'LeaveType': oListItem.get_fieldValues().PRCODE,
                                'pallroll_code': oListItem.get_fieldValues().LeaveType,
                                // 'LeaveCategory': oListItem.get_fieldValues().PayrollCode,
                                'StartDate': oListItem.get_fieldValues().Firstdayofleave,
                                'ReturnDate': oListItem.get_fieldValues().Lastdayofleave,
                                'TotalDays': undefined,
                                'ActualLeaveChecked': 'false',
                                'ActualLeave': '0',
                                'Status': oListItem.get_fieldValues().Status,
                                'RejectionReason': remarkStr,
                                'PRcode': PRcodeObj
                        };
                            if (PRcodeObj != null) {
                                obj.LeaveType = PRcodeObj.leave_type_text;
                              //  obj.PayrollCode = PRcodeObj.leave_type_code;
                            }
                            data.push(obj);
                       
                    }
                    console.log(collListItem);
                    console.log(data);
                    deffer.resolve(data);
                } catch (err) {
                    deffer.reject(err);
                }
                },
               function (sender, args) {
                    alert('Request failed. ' + args.get_message() +
                        '\n' + args.get_stackTrace());
                    deffer.reject(sender);
                }
            );
            return deffer.promise;
        
        }

        function LeaveApplication_LoadUserData_onQueryItemSucceeded() {

            var listItemInfo = '';
            var listItemEnumerator = collListItem.getEnumerator();
            while (listItemEnumerator.moveNext()) {
                var oListItem = listItemEnumerator.get_current();
                listItemInfo = oListItem.get_id();
                var FirstName = oListItem.get_item('FirstName');
               // var MiddleName = oListItem.get_item('MiddleName'); //Column Names
              //  var LastName = oListItem.get_item('LastName'); //Column Names
               // var EmployeeID = oListItem.get_item('EmployeeID'); //Column Names
                //In above code get the column values and create html table by filling above column values
            }
        }

        function LeaveApplication_LoadUserData_onQueryItemFailed(sender, args) {
            alert('Request failed. ' + args.get_message() +
                '\n' + args.get_stackTrace());
        }



        function getQueryStringParameter(paramToRetrieve) {
            var params =
                document.URL.split("?")[1].split("&");
            var strParams = "";
            for (var i = 0; i < params.length; i = i + 1) {
                var singleParam = params[i].split("=");
                if (singleParam[0] == paramToRetrieve)
                    return singleParam[1];
            }
        }

        /* LoadUserProfile */
        AppServiceFactory.LoadUserProfile = function () {
            var deferred = $q.defer();

            var profileData = null;

            try {
                // Data not cached
                AppServiceFactory.SPSODAction(["sp.js", "SP.UserProfiles.js"],
                    function () {
                        // Get the current client context and PeopleManager instance.
                        var clientContext = new SP.ClientContext.get_current();
                        var peopleManager = new SP.UserProfiles.PeopleManager(clientContext);

                        var personProperties = peopleManager.getMyProperties();
                        // Load the PersonProperties object and send the request.
                        clientContext.load(personProperties);
                        clientContext.executeQueryAsync(
                            Function.createDelegate(this, function () {
                                try {
                                    profileData = {
                                        userProfileProperties: personProperties.get_userProfileProperties(),
                                        userUrl: personProperties.get_userUrl()
                                    };

                                    console.log("userUrl: " + profileData.userUrl);
                                   
                                }
                                catch (err) {
                                    deferred.resolve(null);
                                }
                                deferred.resolve(profileData);
                            }),
                            Function.createDelegate(this, function (err, message) { deferred.reject(err, message); }));
                    });
            }
            catch (err) {
                deferred.resolve(null);
            }
            return deferred.promise;
        }


        AppServiceFactory.LeaveApplication_CreateNewLeaveData = function () {
            var deferred = $q.defer();
            AppServiceFactory.LoadUserProfile().then(function (data) {
                console.log(data);
                
                var userPro = data.userProfileProperties;
                
                var userObj =  {

                    'EmployeeEmail': userPro.UserName,
                    'EmployeeSurname': userPro.LastName,
                    'EmployeeFirstname': userPro.FirstName,
                    'EmployeeID': userPro.EmployeeId,
                    'Department': userPro.Department,

                    'Designation': userPro.Title,
                    'ReportTo': undefined,
                    'LeaveType': undefined,
                    'PayrollCode': undefined,
                    'LeaveCategory': undefined,
                    'StartDate': undefined,
                    'ReturnDate': undefined,
                    'SupportingFiles': {},
                    'TotalDays': undefined,
                    'ActualLeaveChecked': false,
                    'ActualLeave': undefined,
                    'Remarks': 'My remarks are remarkable',
                    'Status': 'Draft',
                    'RejectionReason': undefined
                };
                 deferred.resolve(userObj);
            }, function (err) {
                console.log(err);
                deferred.resolve(null);
            });
            return deferred.promise;
           
        }
        AppServiceFactory.LeaveApplication_DeleteLeaveData = function (data) {
            var modalOptions = {
                closeButtonText: 'Cancel',
                actionButtonText: 'Delete selected Leave Application form',
                headerText: 'Delete ' + " the selected application " + '?',
                bodyText: 'Are you sure you want to delete this application?'
            };

            modalService.showModal({}, modalOptions).then(function (result) {
                //Nidhi implement delete on click action here
                var listTitle = "Staff Leave Application";

                ///This function will save data in Staff Leave Application list
                var hostUrl = AppServiceFactory.GetHostWebUrl();
                var appUrl = AppServiceFactory.GetAppWebUrl();
                var appcontext = new SP.ClientContext(appUrl);
                var hostcontext = new SP.AppContextSite(appcontext, hostUrl);
                var hostweb = hostcontext.get_web();
                var list = hostweb.get_lists().getByTitle(listTitle);
                var olistitem = list.getItemById(171);
                olistitem.deleteObject();
                alert("Nidhi implement delete on click action here - result: " + result);
            });
        }


        AppServiceFactory.LeaveApplication_Get_UserData = function (useremail, filter) {
            var obj = new Object();
            obj = [];
            //obj.push(CreateFakeLeaveData(filter));

            return obj;

        }
        // Local Storage Helper Functions
        // From http://brynner.net/html5-localstorage-with-expiration/
        function removeHtmlStorage(name) {
            var name_time = name + '_time';

            delete $localStorage.name;
            delete $localStorage.name_time;
            //localStorageService.remove(name);
            //localStorageService.remove(name + '_time');
        }

        return AppServiceFactory;
    }
})();

(function () {
    angular.module('SharePointOnlineServices').service('modalService', ['$modal',
        function ($modal) {

            var modalDefaults = {
                backdrop: true,
                keyboard: true,
                modalFade: true,
                templateUrl: 'https://localhost:44326/scripts/services/modalTemplate.html'
            };

            var modalOptions = {
                closeButtonText: 'Close',
                actionButtonText: 'OK',
                headerText: 'Proceed?',
                bodyText: 'Perform this action?'
            };

            this.showModal = function (customModalDefaults, customModalOptions) {
                if (!customModalDefaults) customModalDefaults = {};
                customModalDefaults.backdrop = 'static';
                return this.show(customModalDefaults, customModalOptions);
            };

            this.show = function (customModalDefaults, customModalOptions) {
                //Create temp objects to work with since we're in a singleton service
                var tempModalDefaults = {};
                var tempModalOptions = {};

                //Map angular-ui modal custom defaults to modal defaults defined in service
                angular.extend(tempModalDefaults, modalDefaults, customModalDefaults);

                //Map modal.html $scope custom properties to defaults defined in service
                angular.extend(tempModalOptions, modalOptions, customModalOptions);

                if (!tempModalDefaults.controller) {
                    tempModalDefaults.controller = function ($scope, $modalInstance) {
                        $scope.modalOptions = tempModalOptions;
                        $scope.modalOptions.ok = function (result) {
                            result = 'ok';
                            $modalInstance.close(result);
                        };
                        $scope.modalOptions.close = function (result) {
                            $modalInstance.dismiss('cancel');
                        };
                    }
                }

                return $modal.open(tempModalDefaults).result;
            };

        }]);

})();