﻿(function () {
    'use strict';

    angular
        .module('SharePointOnlineServices')
        .factory('DocumentSetService', DocumentSetService);

    DocumentSetService.$inject = ['$http', '$rootScope', '$timeout', '$q', '$localStorage', '$location', 'SharePointOnlineService'];

    function DocumentSetService($http, $rootScope, $timeout, $q, $localStorage, $location, SharePointOnlineService) {
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
        //https://stackoverflow.com/questions/29462134/programmatically-access-files-in-document-set-in-sharepoint-using-javascript
        AppServiceFactory.GetItems = function (listtitle, folderUrl) {
            var deferred = $q.defer();
            try {
            var hostUrl = SharePointOnlineService.GetHostWebUrl();
            var appUrl = SharePointOnlineService.GetAppWebUrl();


            folderUrl = "/" + hostUrl.replace(/^(?:\/\/|[^\/]+)*\//, "") + "/" + listtitle + "/" + folderUrl;
            var appcontext = new SP.ClientContext(appUrl);
            var hostcontext = new SP.AppContextSite(appcontext, hostUrl);

            var hostweb = hostcontext.get_web();
            var list = hostcontext.get_web().get_lists().getByTitle(listtitle);
            var qry = SP.CamlQuery.createAllItemsQuery();
            qry.set_folderServerRelativeUrl(folderUrl);

            var items = list.getItems(qry);
            appcontext.load(items, 'Include(Id, VIT_Student_ID, File)');

            appcontext.executeQueryAsync(
                function () {
                    deferred.resolve(items);
                },
                function (sender, args) {
                    deferred.reject(args, args.get_message());
                });
            }
            catch (err) {
                deferred.reject(err);
            }
            return deferred.promise;
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