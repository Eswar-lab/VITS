﻿(function () {
    'use strict';

    angular
        .module('SharePointOnlineServices')
        .factory('ListService', ListService);

    ListService.$inject = ['$http', '$rootScope', '$timeout', '$q', '$localStorage', '$location', 'SharePointOnlineService'];

    function ListService($http, $rootScope, $timeout, $q, $localStorage, $location, SharePointOnlineService) {
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

        AppServiceFactory.GetListByTitle = function (libraryUrl) {
            var hostUrl = SharePointOnlineService.GetHostWebUrl();
            var appUrl = SharePointOnlineService.GetAppWebUrl();
            var scriptbase = hostUrl + "/_layouts/15/";
            $.getScript(scriptbase + "SP.RequestExecutor.js", function () {
                var executor = new SP.RequestExecutor(appUrl);
                executor.executeAsync(
                    { 
                        url:
                        appUrl +
                        "/_api/SP.AppContextSite(@target)/web/lists/getbytitle('Staff Leave Application')/items?@target='" + hostUrl + "'",
                        method: "GET",
                        headers: { "Accept": "application/json; odata=verbose" },
                        function(data) {
                            var jsonObject = JSON.parse(data.body);
                            var announcementsHTML = "";

                            var results = jsonObject.d.results;

                        },
                        function(data, errorCode, errorMessage) {
                            console.log(errorMessage);
                        }
                    }
                );
            });
        }

        function execCrossDomainRequest() {

            var executor = new SP.RequestExecutor(that.appUrl);

            executor.executeAsync(
                {
                    url:
                    appUrl +
                    "/_api/web/lists/getbytitle('Staff Leave Application')/items",
                    method: "GET",
                    headers: { "Accept": "application/json; odata=verbose" },
                    function(data) {
                        var jsonObject = JSON.parse(data.body);
                        var announcementsHTML = "";

                        var results = jsonObject.d.results;

                    },
                    function(data, errorCode, errorMessage)
                    {
                        console.log(errorMessage);
                    }
                }
            );
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



        return AppServiceFactory;
    }
})();