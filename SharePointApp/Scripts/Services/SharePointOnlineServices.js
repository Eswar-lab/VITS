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
                if (singleParam[0] === paramToRetrieve)
                    return singleParam[1];
            }
            return "";
        }

        AppServiceFactory.GetDocumentSets = function (libraryUrl) {
            // TODO: Add JSOM code to load all documentSet properties from given library
        };
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
                    if (sParam[1] !== "")
                        arrParamValues[i] = unescape(sParam[1]);
                    else
                        arrParamValues[i] = "No Value";
                }

                for (i = 0; i < arrURLParams.length; i++) {
                    if (arrParamNames[i] === paramName) {
                        //alert("Parameter:" + arrParamValues[i]);
                        return arrParamValues[i];
                    }
                }
                // Parameter not found
                return null;
            }
        };
        AppServiceFactory.GetAppWebUrl = function () {
            var appweburl = decodeURIComponent(AppServiceFactory.getQueryStringParameter("SPAppWebUrl"));
            appweburl = appweburl.replace('#/', '');
            return appweburl;
        };
        AppServiceFactory.GetHostWebUrl = function () {
            return decodeURIComponent(getQueryStringParameter("SPHostUrl"));
        };
        AppServiceFactory.setHtmlStorage = function (name, value) {
            //var name = name + '_' + AppServiceFactory.GetURLParameters("wpId");

            var cacheInterval = AppServiceFactory.GetURLParameters("CacheInterval");
            var cacheExpires = cacheInterval * 3600;
            var expires = cacheExpires;
            if (cacheExpires === undefined || cacheExpires === 'null') {
                expires = 3600; // set to 1 hr;
            }

            var date = new Date();
            var schedule = Math.round(date.setSeconds(date.getSeconds() + expires) / 1000);

            $localStorage.name = value;
            name = name + '_time';
            $localStorage.name = schedule;// set(name + '_time', schedule);
        };

        AppServiceFactory.statusHtmlStorage = function (name) {

            var date = new Date();
            var current = Math.round(+date / 1000);

            var name_time = name + '_time';

            // Get Schedule
            var stored_time = $localStorage.name_time;
            if (stored_time === undefined || stored_time === null) { stored_time = 0; }

            // Expired
            if (stored_time < current) {
                removeHtmlStorage(name);                // Remove
                return 0;
            } else {
                return 1;
            }
        };

        AppServiceFactory.forceCacheDeletion = function (name) {
            removeHtmlStorage(name);
        };

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
        };


        AppServiceFactory.getQueryStringParameter = function (paramToRetrieve) {
            var params =
                document.URL.split("?")[1].split("&");
            for (var i = 0; i < params.length; i = i + 1) {
                var singleParam = params[i].split("=");
                if (singleParam[0] === paramToRetrieve)
                    return singleParam[1];
            }
        };

        AppServiceFactory.getCacheValue = function (name) {
            return $localStorage.name;
        };

        AppServiceFactory.Timesheet_Get_TimesheetData_ForPeriod = function (useremail, startDate, endDate) {
            return new [
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
        };

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
        };



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

    angular
        .module('SharePointOnlineServices')
        .factory('LeaveApplicationService', LeaveApplicationService);

    LeaveApplicationService.$inject = ['$http', '$rootScope', '$timeout', '$q', '$localStorage', '$location', 'SharePointOnlineService', 'modalService'];

    function LeaveApplicationService($http, $rootScope, $timeout, $q, $localStorage, $location, SharePointOnlineService, modalService) {
        var listTitle = "Staff Leave Application";
        var AppServiceFactory = {};
        var LeaveApplicationObj = {
            'ID': undefined,
            'EmployeeEmail': undefined,
            'EmployeeSurname': undefined,
            'EmployeeFirstname': undefined,
            'EmployeeID': undefined,
            'Department': undefined,
            'Designation': undefined,
            'ReportTo': undefined,
            'LeaveType': undefined,
            'PayrollCode': undefined,
            'LeaveCategory': undefined,
            'StartDate': undefined,
            'ReturnDate': undefined,
            'TotalDays': undefined,
            'ActualLeaveChecked': undefined,
            'ActualLeave': undefined,
            'Status': undefined,
            'RejectionReason': undefined,
            'Remarks': undefined,
            'Totaldays': undefined,
            'Withdraw': undefined,
            'Cancel': undefined,
        };
        var LeaveApplicationFields = {
            'ID': 'ID',
            'EmployeeEmail': 'EmployeeEmail',
            'EmployeeSurname': 'EmployeeSurname',
            'EmployeeFirstname': 'FirstName',
            'EmployeeID': 'EmployeeID',
            'Department': 'DepartmentName',
            'Designation': 'Designation',
            'ReportTo': 'ReportTo',
            'LeaveType': 'LeaveType',
            'PayrollCode': 'PRCODE',
            'LeaveCategory': 'LeaveCategory',
            'StartDate': 'StartDate',
            'ReturnDate': 'ReturnDate',
            'TotalDays': 'TotalDays',
            'ActualLeaveChecked': 'ActualLeaveChecked',
            'ActualLeave': 'ActualLeave',
            'Status': 'Status',
            'RejectionReason': 'RejectionReason',
            'Remarks': 'Remarks',
            'PRCODE': 'PRCODE',
            'Firstdayofleave': 'Firstdayofleave',
            'Lastdayofleave': 'Lastdayofleave',
            'SupportingFiles': 'Attachments',
            'RejectionReason': 'RejectionReason',
            'Withdraw': 'Withdraw',
            'Cancel': 'Cancel'
        }

        AppServiceFactory.LeaveApplication_Get_Approvers = function () {
            return [{ id: "someId1", name: "Display name 1" },
            { id: "someId2", name: "Display name 2" }];
        };

        AppServiceFactory.LeaveApplication_UpdateLeaveData = function (data) {
            //... Nidhi's code will go here > JSOM
            var deferred = $q.defer();
            ///This function will save data in Staff Leave Application list
            var hostUrl = SharePointOnlineService.GetHostWebUrl();
            var appUrl = SharePointOnlineService.GetAppWebUrl();
            var appcontext = new SP.ClientContext(appUrl);
            var hostcontext = new SP.AppContextSite(appcontext, hostUrl);
            var hostweb = hostcontext.get_web();
            var list = hostweb.get_lists().getByTitle(listTitle);
            var oListItem = list.getItemById(data.ID);

            //var leaveTypeObj = JSON.parse(data.LeaveType.text());

            oListItem.set_item(LeaveApplicationFields.EmployeeEmail, data.EmployeeEmail);
            oListItem.set_item(LeaveApplicationFields.EmployeeSurname, data.EmployeeSurname);
            oListItem.set_item(LeaveApplicationFields.EmployeeFirstname, data.EmployeeFirstname);
            oListItem.set_item(LeaveApplicationFields.EmployeeID, data.EmployeeID);
            oListItem.set_item(LeaveApplicationFields.Department, data.Department);
            oListItem.set_item(LeaveApplicationFields.Designation, data.Designation);
            oListItem.set_item(LeaveApplicationFields.ReportTo, data.ReportTo);

            if (data.LeaveType != null) {

                LEAVE_TYPE_PAYROLL_CODE.forEach(function (item) {
                    if (item.leave_type_code === data.LeaveType) {
                        oListItem.set_item(LeaveApplicationFields.LeaveType, item.leave_type_text);
                    }
                })
            } else {
                oListItem.set_item(LeaveApplicationFields.LeaveType, null);
            }

            oListItem.set_item(LeaveApplicationFields.PRCODE, data.LeaveType);
            oListItem.set_item(LeaveApplicationFields.Firstdayofleave, data.StartDate);
            oListItem.set_item(LeaveApplicationFields.Lastdayofleave, data.ReturnDate);
            oListItem.set_item(LeaveApplicationFields.Status, data.Status);
            oListItem.set_item(LeaveApplicationFields.Remarks, data.Remarks);
            oListItem.set_item(LeaveApplicationFields.RejectionReason, data.RejectionReason);
            oListItem.set_item(LeaveApplicationFields.Withdraw, data.Withdraw);
            oListItem.set_item(LeaveApplicationFields.Cancel, data.Cancel);
            

            oListItem.update();

            appcontext.executeQueryAsync(
                function (sender, args) {

                    deferred.resolve(oListItem);
                },
                function (sender, args) {

                    deferred.reject(args);
                });
            return deferred.promise;
        }

        AppServiceFactory.LeaveApplication_SaveOrCreateData = function (data) {
            //... Nidhi's code will go here > JSOM
            var deferred = $q.defer();
            ///This function will save data in Staff Leave Application list
            var hostUrl = SharePointOnlineService.GetHostWebUrl();
            var appUrl = SharePointOnlineService.GetAppWebUrl();
            var appcontext = new SP.ClientContext(appUrl);
            var hostcontext = new SP.AppContextSite(appcontext, hostUrl);
            var hostweb = hostcontext.get_web();
            var list = hostweb.get_lists().getByTitle(listTitle);

            var itemCreateInfo = new SP.ListItemCreationInformation();
            var oListItem = list.addItem(itemCreateInfo);

            //var leaveTypeObj = JSON.parse(data.LeaveType.text());

            oListItem.set_item(LeaveApplicationFields.EmployeeEmail, data.EmployeeEmail);
            oListItem.set_item(LeaveApplicationFields.EmployeeSurname, data.EmployeeSurname);
            oListItem.set_item(LeaveApplicationFields.EmployeeFirstname, data.EmployeeFirstname);
            oListItem.set_item(LeaveApplicationFields.EmployeeID, data.EmployeeID);
            oListItem.set_item(LeaveApplicationFields.Department, data.Department);
            oListItem.set_item(LeaveApplicationFields.Designation, data.Designation);
            oListItem.set_item(LeaveApplicationFields.ReportTo, data.ReportTo);


            //LEAVE_TYPE_PAYROLL_CODE.forEach(function (item) {
            //    if (item.leave_type_code == data.LeaveType) {
            //        oListItem.set_item(LeaveApplicationFields.LeaveType, item.leave_type_text);
            //    }
            //})
            LEAVE_TYPE_PAYROLL_CODE.forEach(function (item) {
                if (item.leave_type_code == data.LeaveType) {
                    oListItem.set_item(LeaveApplicationFields.LeaveType, item.leave_type_text);
                }
            })
            // oListItem.set_item(LeaveApplicationFields.LeaveType, data.LeaveType);
            //oListItem.set_item(LeaveApplicationFields.PayrollCode, data.PayrollCode.text());


            oListItem.set_item(LeaveApplicationFields.Firstdayofleave, data.StartDate);
            oListItem.set_item(LeaveApplicationFields.Lastdayofleave, data.ReturnDate);

            oListItem.set_item(LeaveApplicationFields.Status, data.Status);
            oListItem.set_item(LeaveApplicationFields.Remarks, data.Remarks);
            oListItem.set_item(LeaveApplicationFields.ActualLeave, data.ActualLeave);
            oListItem.set_item(LeaveApplicationFields.TotalDays, data.TotalDays);
            oListItem.set_item(LeaveApplicationFields.Withdraw, data.Withdraw);
            oListItem.set_item(LeaveApplicationFields.Cancel, data.Cancel);
            
            //  oListItem.set_item('ActualLeave', data.ActualLeave);
            oListItem.update();
            appcontext.load(oListItem);
            appcontext.executeQueryAsync(
                function (sender, args) {

                    deferred.resolve(oListItem);
                },
                function (sender, args) {

                    deferred.reject(args);
                });
            return deferred.promise;
        };

        AppServiceFactory.LeaveApplication_SubmitLeaveApplication = function (data) {
            //... Nidhi's code will go here > JSOM
            var deferred = $q.defer();
            var listTitle = "Staff Leave Application";
            ///This function will save data in Staff Leave Application list
            var hostUrl = SharePointOnlineService.GetHostWebUrl();
            var appUrl = SharePointOnlineService.GetAppWebUrl();
            var appcontext = new SP.ClientContext(appUrl);
            var hostcontext = new SP.AppContextSite(appcontext, hostUrl);
            var hostweb = hostcontext.get_web();
            var list = hostweb.get_lists().getByTitle(listTitle);
            var itemCreateInfo = new SP.ListItemCreationInformation();
            var oListItem = list.addItem(itemCreateInfo);
            var leaveTypeObj = JSON.parse(data.LeaveType.text());

            oListItem.set_item(LeaveApplicationFields.EmployeeEmail, data.EmployeeEmail);
            oListItem.set_item(LeaveApplicationFields.EmployeeSurname, data.EmployeeSurname);
            oListItem.set_item(LeaveApplicationFields.FirstName, data.EmployeeFirstname);
            oListItem.set_item(LeaveApplicationFields.EmployeeID, data.EmployeeID);
            oListItem.set_item(LeaveApplicationFields.Department, data.Department);
            oListItem.set_item(LeaveApplicationFields.Designation, data.Designation);
            oListItem.set_item(LeaveApplicationFields.ReportTo, data.ReportTo);
            LEAVE_TYPE_PAYROLL_CODE.forEach(function (item) {
                if (item.leave_type_code == data.leave_type_text) {
                    oListItem.set_item(LeaveApplicationFields.LeaveType, item.leave_type_text);
                }
            })
            oListItem.set_item(LeaveApplicationFields.PRCODE, data.leave_type_text);
            oListItem.set_item(LeaveApplicationFields.Firstdayofleave, data.StartDate);
            oListItem.set_item(LeaveApplicationFields.Lastdayofleave, data.ReturnDate);
            oListItem.set_item(LeaveApplicationFields.Totalnumberofdays, data.TotalDays);
            oListItem.set_item(LeaveApplicationFields.Status, data.Status);
            oListItem.set_item(LeaveApplicationFields.Remarks, data.Remarks);
           
            oListItem.set_item(LeaveApplicationFields.ActualLeave, data.ActualLeave);
            //  oListItem.set_item(LeaveApplicationFields.TotalDays, data.TotalDays);
            //  oListItem.set_item('Attche', data.ActualLeave);
            oListItem.set_item(LeaveApplicationFields.Withdraw, data.Withdraw);
            oListItem.set_item(LeaveApplicationFields.Cancel, data.Cancel);
            
            oListItem.update();
            appcontext.load(oListItem);
            appcontext.executeQueryAsync(
                function (sender, args) {
                    //  alert('Item  Submitted');
                    deferred.resolve(args);
                },
                function (sender, args) {
                    //    alert('Request failed. ' + args.get_message() + '\n' + args.get_stackTrace());
                    deferred.reject(args);
                });
            return deferred.promise;
        };


        AppServiceFactory.LeaveApplication_LoadUserData = function (email, userType) {

            var deffer = $q.defer();
            ///This function will filter data in Staff Leave Application list with status column
            var hostUrl = SharePointOnlineService.GetHostWebUrl();
            var appUrl = SharePointOnlineService.GetAppWebUrl();
            var appcontext = new SP.ClientContext(appUrl);
            var hostcontext = new SP.AppContextSite(appcontext, hostUrl);
            var hostweb = hostcontext.get_web();
            var list = hostweb.get_lists().getByTitle(listTitle);
            var oList = hostweb.get_lists().getByTitle(listTitle);
            var camlQuery = new SP.CamlQuery();
//
            
            var camlQ = undefined;
            if (userType == USER_TYPE.user)
                camlQ = '<View><Query><Where><Eq><FieldRef Name="EmployeeEmail" /> <Value Type="Text">' + email + '</Value></Eq></Where></Query></View>';
            else if (userType == USER_TYPE.lineManager)
                camlQ = '<View><Query><Where><Eq><FieldRef Name="ReportTo" /> <Value Type="Text">' + email + '</Value></Eq></Where></Query></View>'
            else if (userType == USER_TYPE.mainManager)
                camlQ = '<View><Query><Where></Where></Query></View>'
            camlQuery.set_viewXml(camlQ);
            var collListItem = oList.getItems(camlQuery);
            appcontext.load(collListItem);
            appcontext.executeQueryAsync(function () {

                var data = [];

                var listItemInfo = '';
                var listItemEnumerator = collListItem.getEnumerator();
                while (listItemEnumerator.moveNext()) {
                    var oListItem = listItemEnumerator.get_current();
                    var remarkStr = undefined;
                    var PRcodeObj = undefined;

                    listItemInfo = oListItem.get_id();
                  

                    var obj = JSON.parse(JSON.stringify(LeaveApplicationObj));
                    obj.ID = oListItem.get_fieldValues().ID;
                    obj.EmployeeEmail = oListItem.get_fieldValues().Author['$6_2'];
                    obj.EmployeeSurname = oListItem.get_fieldValues().EmployeeSurname;
                    obj.EmployeeFirstname = oListItem.get_fieldValues().FirstName;
                    obj.EmployeeID = oListItem.get_fieldValues().EmployeeID;
                    obj.Department = oListItem.get_fieldValues().DepartmentName;

                    obj.TotalDays = oListItem.get_fieldValues().TotalDays;
                    obj.ActualLeave = oListItem.get_fieldValues().ActualLeave;
                    obj.Designation = oListItem.get_fieldValues().Designation;
                    obj.ReportTo = oListItem.get_fieldValues().ReportTo;
                    obj.LeaveType = oListItem.get_fieldValues().LeaveType;
                    obj.PayrollCode = oListItem.get_fieldValues().PayrollCode;
                    obj.StartDate = oListItem.get_fieldValues().Firstdayofleave;
                    obj.ReturnDate = oListItem.get_fieldValues().Lastdayofleave;
                    obj.RejectionReason = oListItem.get_fieldValues().RejectionReason;
                    obj.Remarks = oListItem.get_fieldValues().Remarks;
                    obj.Status = oListItem.get_fieldValues().Status;
                    obj.Withdraw = oListItem.get_fieldValues().Withdraw;
                    obj.Cancel = oListItem.get_fieldValues().Cancel;
                    try {
                        remarkStr = $(oListItem.get_fieldValues().Remarks).text();
                        PRcodeObj = $(oListItem.get_fieldValues().PRCODE).text();
                        obj.Remarks = remarkStr;
                    } catch (ex) {
                        console.log(ex);
                    }
                   // obj.RejectionReason = remarkStr;
                    data.push(obj);
                }
                deffer.resolve(data);
            },
                function (sender, args) {
                  
                    deffer.reject(sender);
                }
            );
            return deffer.promise;

        };


        AppServiceFactory.LeaveApplication_CreateNewLeaveData = function (userPro) {
            var deferred = $q.defer();
            var obj = JSON.parse(JSON.stringify(LeaveApplicationObj));
            obj.EmployeeEmail = userPro.UserName;
            obj.EmployeeSurname = userPro.LastName;
            obj.EmployeeFirstname = userPro.FirstName;
            obj.EmployeeID = userPro.EmployeeId;
            obj.Department = userPro.Department;
            obj.Designation = userPro.Title;
            obj.Remarks = '';
            if (userPro === null || userPro === undefined)
                deferred.reject(obj);
            else
                deferred.resolve(obj);

            return deferred.promise;

        };
        AppServiceFactory.LeaveApplication_DeleteLeaveData = function (data) {
            var deferred = $q.defer();
            var itemId = data.ID;
           
            var deferred = $q.defer();
            var itemId = data.ID;
            var hostUrl = SharePointOnlineService.GetHostWebUrl();
            var appUrl = SharePointOnlineService.GetAppWebUrl();
            var appcontext = new SP.ClientContext(appUrl);    
            var hostcontext = new SP.AppContextSite(appcontext, hostUrl);
            var hostweb = hostcontext.get_web();
            var oList = hostweb.get_lists().getByTitle(listTitle);
            var oListItem = oList.getItemById(itemId);

            oListItem.deleteObject();
            appcontext.executeQueryAsync(Function.createDelegate(this, function () {

                deferred.resolve(oListItem);
            }), Function.createDelegate(this, function () {

                deferred.reject(null);
            }));
            return deferred.promise;
        };


        AppServiceFactory.LeaveApplication_AddAttachedData = function (fileInput, id) {
            var deferred = $.Deferred();
            //var manageUrl = appUrl + "/_api/SP.AppContextSite(@target)/web/sitegroups/getbyname('Staff Leave Manager')/users?@target=%27" + hostUrl + "%27";

            //get updated item
            var itemId = id;
            var fileInput = $('#inpFile');
            var fileCount = fileInput[0].files.length;
            var fileArray = [];

            for (var i = 0; i < fileCount; i++) {
                fileArray.push(fileInput[0].files[i]);
            }
            uploadFileSP("Staff Leave Application", itemId, fileArray, fileCount);
        }


        function getFileBuffer(file) {

            var deferred = $.Deferred();
            var reader = new FileReader();
            reader.onload = function (e) {
                deferred.resolve(e.target.result);
            }
            reader.onerror = function (e) {
                deferred.reject(e.target.error);
            }
            reader.readAsArrayBuffer(file);
            if (file === null || typeof file === 'undefined')
                deferred.reject(e.target.error);
            return deferred.promise();
        }

        function uploadFileSP(listName, id, fileArray, fileCount, listUrl) {
                var FilesCount = 0;
                var deferred = $q.defer();
                var uploadStatus = "";
                var file = fileArray[0];
                var getFile = getFileBuffer(file);

                var hostUrl = SharePointOnlineService.GetHostWebUrl();
                var appUrl = SharePointOnlineService.GetAppWebUrl();

                var appcontext = new SP.ClientContext(appUrl);

               // var listUrl = appUrl +  "/_api/lists/GetByTitle('" + listName + "')/items(" + id + ")/AttachmentFiles/add(FileName='" + file.name + "')" + "?@target=%27" + hostUrl + "%27";
                var listUrl = appUrl +  "/_api/SP.AppContextSite(@target)/web/lists/GetByTitle('"  + listName + "')/items(" + id + ")/AttachmentFiles/add(FileName='" + file.name + "')" + "?@target=%27" + hostUrl + "%27";

                getFile.then(function (buffer, status, xhr) {
                    var bytes = new Uint8Array(buffer);
                    var content = new SP.Base64EncodedByteArray();
                    var queryUrl = listUrl;
                    var uploadCount = 0;
                    $.ajax({
                        url: queryUrl,
                        type: "POST",
                        processData: false,
                        contentType: "application/json;odata=verbose",
                        data: buffer,
                        headers: {
                            "accept": "application/json;odata=verbose",
                            "X-RequestDigest": $("#__REQUESTDIGEST").val(),
                            "content-length": buffer.byteLength
                        },
                        success: function (data) {
                            deferred.resolve(data);
                        },
                        error: function (err) {
                            deferred.reject(err);
                        }
                    });
                    deferred.resolve(uploadStatus);
                });
                return deferred.promise;
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
                // templateUrl: 'https://localhost:44326/scripts/services/modalTemplate.html'
                templateUrl: 'https://sharepointapps.blob.core.windows.net/scripts/services/modalTemplate.html'
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
                    };
                }

                return $modal.open(tempModalDefaults).result;
            };

        }]);

})();