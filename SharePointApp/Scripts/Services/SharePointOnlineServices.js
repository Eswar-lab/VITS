(function () {
    'use strict';

    angular
        .module('SharePointOnlineServices', ['ngRoute', 'ngStorage'])
        .factory('SharePointOnlineService', SharePointOnlineService);

    SharePointOnlineService.$inject = ['$http', '$rootScope', '$timeout', '$q', '$localStorage', '$location'];

    function SharePointOnlineService($http, $rootScope, $timeout, $q, $localStorage, $location) {
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

        function CreateFakeLeaveData(status) {
            return {
                'EmployeeEmail': 'khang@vit.edu.au',
                'EmployeeSurname': 'Khang',
                'EmployeeFirstname': 'Cao',
                'EmployeeID': '1234',
                'Department': 'Moodle',
                'Designation': 'Web Developer',
                'ReportsTo': 'Aaron@vit.edu.au',
                'LeaveType': 'Sick Leave',
                'PayrollCode': 'SIC',
                'LeaveCategory': 'WithCertificate',
                'StartDate': '12-Nov-2017',
                'ReturnDate': '15-Nov-2017',
                'TotalDays': '3',
                'ActualLeaveChecked': 'false',
                'ActualLeave': '0',
                'Status': status,
                'RejectionReason': 'Please attach sick certificate'
            };
        }

        AppServiceFactory.LeaveApplication_Get_Approvers = function () {
            return [{ id: "someId1", name: "Display name 1" },
            { id: "someId2", name: "Display name 2" }];
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



        //Load UserProfile with API

        AppServiceFactory.LoadUserProfile_API = function () {
            return $http.get('https://vit1.sharepoint.com/sites/developer//_api/SP.UserProfiles.PeopleManager/GetMyProperties', {
                'headers': {
                    "accept": "application/json;odata=verbose"
                }
            });

        }
        
        AppServiceFactory.LeaveApplication_Get_UserData = function (useremail, filter) {
            var obj = new Object();
            obj = [];
            obj.push(CreateFakeLeaveData(filter));

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
    'use strict';

    angular
        .module('SharePointOnlineServices')
        .factory('LeaveApplicationService', LeaveApplicationService);

    LeaveApplicationService.$inject = ['$http', '$q', '$timeout', 'SharePointOnlineService'];
 

    function LeaveApplicationService($http, $q, $timeout, SharePointOnlineService) {

        var SITE_URL = "https://vit1-sharepoint.com/sites/developer/";

        var LeaveApplicationService = {};

        var leaveApplicationObj = {
            'EmployeeEmail': undefined,
            'EmployeeSurname': undefined,
            'EmployeeFirstname': undefined,
            'EmployeeID': undefined,
            'Department': undefined,
            'Designation': undefined,
            'ReportsTo': undefined,
            'LeaveType': undefined,
            'PayrollCode': undefined,
            'LeaveCategory': undefined,
            'StartDate': undefined,
            'ReturnDate': undefined,
            'TotalDays': undefined,
            'ActualLeaveChecked': undefined,
            'ActualLeave': undefined,
            'Status': undefined,
            'RejectionReason': undefined
        };
        var userProfileObj = {
            'userProfileProperties': undefined,
            'userUrl': undefined
        };


        LeaveApplicationService.cacheKey = null;



        LeaveApplicationService.getStaff = getStaff;
        LeaveApplicationService.LeaveApplication_CreateNewLeaveData = LeaveApplication_CreateNewLeaveData;
        LeaveApplicationService.LoadUserProfile = LoadUserProfile;
        LeaveApplicationService.LeaveApplication_Get_Approvers = LeaveApplication_Get_Approvers;
        LeaveApplicationService.LeaveApplication_SaveOrCreateData = LeaveApplication_SaveOrCreateData;


        function getStaff() {
            $http.get(SITE_URL + "_api/web/sitegroups/getbyname('Staff Leave Manager')/users", { 'headers': { 'contentType': "application/json;odata=verbose" } }).then(function (data) {
                //alert('hi');
                var yourval = jQuery.parseJSON(JSON.stringify(data));
                var results = yourval.d.results;
                for (var i = 0; i < results.length; i++) {
                    myData.push(results[i].Email);
                }
                $("#managerEmail").autocomplete({
                    source: myData
                });
            });
        }

        function LeaveApplication_CreateNewLeaveData() {
            // AppServiceFactory.LeaveApplication_getUserProperties();
            if (userProfileObj.userProfileProperties == undefined) {
                SharePointOnlineService.LoadUserProfile().then(function (response) {
                    leaveApplicationObj.EmployeeEmail = userProfileObj.userProfileProperties.WorkEmail;
                    leaveApplicationObj.EmployeeSurname = userProfileObj.userProfileProperties.LastName;
                    leaveApplicationObj.EmployeeFirstname = userProfileObj.userProfileProperties.FirstName;
                    leaveApplicationObj.EmployeeID = userProfileObj.userProfileProperties.EmployeeId
                    leaveApplicationObj.Department = userProfileObj.userProfileProperties["SPS-Department"];
                    leaveApplicationObj.Designation = userProfileObj.userProfileProperties.Title;
                   // leaveApplicationObj.ReportsTo = userProfileObj.userProfileProperties.Manager;

                    leaveApplicationObj.RejectionReason = undefined;

                });
            }
            leaveApplicationObj.EmployeeEmail = userProfileObj.userProfileProperties.WorkEmail;
            leaveApplicationObj.EmployeeSurname = userProfileObj.userProfileProperties.LastName;
            leaveApplicationObj.EmployeeFirstname = userProfileObj.userProfileProperties.FirstName;
            leaveApplicationObj.EmployeeID = userProfileObj.userProfileProperties.EmployeeId;
            leaveApplicationObj.Department = userProfileObj.userProfileProperties["SPS-Department"];
            leaveApplicationObj.Designation = userProfileObj.userProfileProperties.Title;
            //leaveApplicationObj.ReportsTo = userProfileObj.userProfileProperties.Manager;

            leaveApplicationObj.RejectionReason = undefined;



            return leaveApplicationObj;
        }
        function LoadUserProfile() {
            var deferred = $q.defer();

            var profileData = null;

            try {
                // Data not cached
                SharePointOnlineService.SPSODAction(["sp.js", "SP.UserProfiles.js"],
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
                                    userProfileObj = {
                                        userProfileProperties: personProperties.get_userProfileProperties(),
                                        userUrl: personProperties.get_userUrl()
                                    };

                                    console.log("userUrl: " + userProfileObj.userUrl);
                                    console.log(userProfileObj);

                                }
                                catch (err) {
                                    deferred.resolve(null);
                                }
                                deferred.resolve(userProfileObj);
                            }),
                            Function.createDelegate(this, function (err, message) { deferred.reject(err, message); }));
                    });
            }
            catch (err) {
                deferred.resolve(null);
            }
            return deferred.promise;
        }
        function CreateFakeLeaveData(status) {
            return {
                'EmployeeEmail': 'khang@vit.edu.au',
                'EmployeeSurname': 'Khang',
                'EmployeeFirstname': 'Cao',
                'EmployeeID': '1234',
                'Department': 'Moodle',
                'Designation': 'Web Developer',
                'ReportsTo': 'Aaron@vit.edu.au',
                'LeaveType': 'Sick Leave',
                'PayrollCode': 'SIC',
                'LeaveCategory': 'WithCertificate',
                'StartDate': '12-Nov-2017',
                'ReturnDate': '15-Nov-2017',
                'TotalDays': '3',
                'ActualLeaveChecked': 'false',
                'ActualLeave': '0',
                'Status': status,
                'RejectionReason': 'Please attach sick certificate'
            };
        }

        function LeaveApplication_Get_Approvers() {
            return [{ id: "someId1", name: "Display name 1" },
            { id: "someId2", name: "Display name 2" }];
        }

        function LeaveApplication_SaveOrCreateData(data) {
            //... Nidhi's code will go here > JSOM
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
            oListItem.set_item('EmployeeSurname', data.EmployeeSurname);
            oListItem.set_item('FirstName', data.EmployeeFirstname);
            oListItem.set_item('EmployeeID', data.EmployeeID);
            oListItem.set_item('DepartmentName', data.Department);
            oListItem.set_item('Designation', data.Designation);
            oListItem.set_item('ReportTo', data.ReportsTo);
            oListItem.set_item('PayrollCode', data.LeaveType);
            oListItem.set_item('PRCODE', data.PayrollCode);
            oListItem.set_item('LeaveCategory', data.LeaveCategory);
            oListItem.set_item('Firstdayofleave', data.StartDate);
            oListItem.set_item('Lastdayofleave', data.ReturnDate);
            oListItem.set_item('Totalnumberofdays', data.TotalDays);
            oListItem.set_item('ActualLeave', data.ActualLeave);

            oListItem.update();
            appcontext.load(oListItem);
            appcontext.executeQueryAsync(
                LeaveApplication_SaveOrCreateData_onQueryItemSucceeded,
                LeaveApplication_SaveOrCreateData_onQueryItemFailed);
        }

        function LeaveApplication_SaveOrCreateData_onQueryItemSucceeded() {
            alert('Item created: ' + oListItem.get_id());
        }

        function LeaveApplication_SaveOrCreateData_onQueryItemFailed(sender, args) {
            alert('Request failed. ' + args.get_message() + '\n' + args.get_stackTrace());
        }





        function generateIndexesArray() {
            var indexes = [];
            for (var i = 0; i < CEOsiteService.currIndex; ++i) {
                indexes[i] = i;
            }
            return shuffle(indexes);
        }

        // http://stackoverflow.com/questions/962802#962890
        function shuffle(array) {
            var tmp, current, top = array.length;

            if (top) {
                while (--top) {
                    current = Math.floor(Math.random() * (top + 1));
                    tmp = array[current];
                    array[current] = array[top];
                    array[top] = tmp;
                }
            }

            return array;
        }




        return LeaveApplicationService;
    }

    


})();