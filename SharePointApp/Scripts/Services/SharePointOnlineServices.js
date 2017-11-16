﻿(function () {
    'use strict';

    angular
        .module('SharePointOnlineServices', ['ngRoute', 'ngStorage'])
        .factory('SharePointOnlineService', SharePointOnlineService);

    SharePointOnlineService.$inject = ['$http', '$rootScope', '$timeout', '$q', '$localStorage', '$location'];

    function SharePointOnlineService($http, $rootScope, $timeout, $q, $localStorage, $location) {
        var AppServiceFactory = {};                


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

        AppServiceFactory.GetHostWebUrl = function () {           
            return decodeURIComponent(getQueryStringParameter("SPHostUrl"));
        }

        AppServiceFactory.setHtmlStorage = function(name, value) {
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
            name = name +'_time';            
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
        AppServiceFactory.SPSODAction = function(sodScripts, onLoadAction) {
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
        

        AppServiceFactory.getQueryStringParameter = function(paramToRetrieve) {
            var params =
                document.URL.split("?")[1].split("&");
            for (var i = 0; i < params.length; i = i + 1) {
                var singleParam = params[i].split("=");
                if (singleParam[0] == paramToRetrieve)
                    return singleParam[1];
            }
        }

        AppServiceFactory.getCacheValue = function (name)
        {
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

        AppServiceFactory.LeaveApplication_Get_UserData = function (useremail, filter) {
            var obj = new Object();
             
             if (filter == 'Pending') {
                 obj = [
                     {
                         'Employee': 'khang@vit.edu.au', 'StartDate': '12-Nov-2017',
                         'EndDate': '15-Nov-2017', 'Status': 'Pending', 'ReportTo': 'Aaron@vit.edu.au',
                         'RejectionReason': ''
                     },
                     {
                         'Employee': 'khang@vit.edu.au', 'StartDate': '1-Dec-2017',
                         'EndDate': '15-Dec-2017', 'Status': 'Pending', 'ReportTo': 'Aaron@vit.edu.au',
                         'RejectionReason': ''
                     }
                 ];
             }
             if (filter == 'Rejected') {
                 obj = [
                     {
                         'Employee': 'khang@vit.edu.au', 'StartDate': '12-Nov-2017',
                         'EndDate': '15-Nov-2017', 'Status': 'Rejected', 'ReportTo': 'Aaron@vit.edu.au',
                         'RejectionReason' : 'You do not have enough leave balance left.'
                     }
                 ];
             }
             if (filter == 'Approved') {
                 obj = [
                     {
                         'Employee': 'khang@vit.edu.au', 'StartDate': '12-Nov-2017',
                         'EndDate': '15-Nov-2017', 'Status': 'Approved', 'ReportTo': 'Aaron@vit.edu.au',
                         'RejectionReason': ''
                     }
                 ];
             }
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