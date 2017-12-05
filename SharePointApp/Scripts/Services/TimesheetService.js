(function () {
    "use strict";

    angular
        .module("SharePointOnlineServices")
        .factory("TimesheetService", TimesheetService);

    TimesheetService.$inject = ["$http", "$q", "$timeout", "SharePointOnlineService"];

    function TimesheetService($http, $q, $timeout, SharePointOnlineService) {


        var TimesheetService = {}
        TimesheetService.cacheKey = null;


        TimesheetService.Timesheet_Get_TimesheetData_ForPeriod = function (useremail, startDate, endDate) {
            var dummy = [
                {
                    "Employee": "khang@vit.edu.au", "Manager": "Aaron",
                    "Department": "Moodle", "Period": "Fortnightly", "TimesheetType": "General",
                    "DayTasks": [
                        {
                            "TaskCodes": "GEN",
                            "StartDate": "8:00 AM",
                            "EndTimes": "10:00 AM"
                        }
                    ]
                    , "BreakTime": "30", "Total": "6", "Absent": false,
                    "AbsentReason": "", "ApprovalStatus": "Not Started"
                },
                {
                    "Employee": "khang@vit.edu.au", "Manager": "Aaron",
                    "Department": "Moodle", "Period": "Fortnightly", "TimesheetType": "Academic",
                    "DayTasks": [
                        {
                            "TaskCodes": "LEC",
                            "StartDate": "8:00 AM",
                            "EndTimes": "10:00 AM"
                        },
                        {
                            "TaskCodes": "RLEC",
                            "StartDate": "1:00 PM",
                            "EndTimes": "3:00 PM"
                        }
                    ],
                    "BreakTime": "30", "Total": "6", "Absent": false,
                    "AbsentReason": "", "ApprovalStatus": "Not Started"
                }

            ];



            return dummy;
             
        }


       

        return TimesheetService;
    }
})();