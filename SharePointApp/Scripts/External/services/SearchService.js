(function () {
    'use strict';

    angular
        .module('SharePointOnlineServices')
        .factory('SearchService', SearchService);

    SearchService.$inject = ['$http',  '$q', '$timeout', 'SharePointOnlineService'];

    function SearchService($http, $q, $timeout, SharePointOnlineService) {

        var hostweburl;
        var appweburl;
        var MAXLOOP = 5;
        var currentLoop = 0;
        var context;
        var hostcontext;
        var web;
        var collListItem = [];
        var smartLoopMode = false;
        var personProperties;        
        var filterQuery;
        var startRow = 0;
        var deferred;
        
        var SearchServiceFactory = {}
        SearchServiceFactory.cacheKey = null;
        

        function parseData(data) {
            angular.forEach(data.data.d.query.PrimaryQueryResult.RelevantResults.Table.Rows.results, function (value, key) {

                var rowItem = {};

                value.Cells.results.forEach(function (name) {

                    if (name.Key) {
                        if (name.Key.length <= 1) {
                            name.Key = name.Key.toLowerCase();
                        } else {
                            name.Key = name.Key.substring(0, 1).toLowerCase() + name.Key.substring(1);
                        }

                        rowItem[name.Key] = name.Value;
                    }
                });

                collListItem.push(rowItem);
            });
        }

      
        function inlineSearchImpl()//cacheKey,filterQuery, startRow, deferred, hostweburl, appweburl)
        {
            $http({
                method: 'GET',
                url: appweburl + '/_api/search/query?' + filterQuery + "&startrow=" + startRow + "&trimduplicates=true",
                headers: { "Accept": "application/json; odata=verbose" }
            })
            .then(function (response) {
                // this callback will be called asynchronously
                // when the response is available

                parseData(response);

                if (smartLoopMode) {
                    // cache the result
                    if (collListItem.length < response.data.d.query.PrimaryQueryResult.RelevantResults.TotalRows && currentLoop < MAXLOOP) {
                        currentLoop++;
                        startRow = startRow + 500;
                        inlineSearchImpl();
                    }
                    else {
                        SharePointOnlineService.setHtmlStorage(SharePointOnlineService.cacheKey, collListItem)
                        deferred.resolve(collListItem);
                    }
                } else {
                    SharePointOnlineService.setHtmlStorage(SharePointOnlineService.cacheKey, collListItem)
                    deferred.resolve(collListItem);
                }

            }, function (response) {
                // called asynchronously if an error occurs
                // or server returns response with an error status.
                deferred.reject(response.message);
            });
        }

        SearchServiceFactory.UpdateCache = function (fq, wpId, templateId) {
            deferred = $q.defer();
            filterQuery = fq;
            smartLoopMode = templateId == 2;
            hostweburl = decodeURIComponent(SharePointOnlineService.getQueryStringParameter("SPHostUrl"));
            appweburl = decodeURIComponent(SharePointOnlineService.getQueryStringParameter("SPAppWebUrl"));
            appweburl = appweburl.replace('#/', '')

            try {

                // Data not cached
                SharePointOnlineService.SPSODAction(["SP.Search.js", "sp.js"], inlineSearchImpl);
            }
            catch (err) {
                deferred.reject(err);
            }
            return deferred.promise;
        }


        SearchServiceFactory.SearchCache = function (wpId) {

            deferred = $q.defer();

            var searchData = [];

            try {
                //if (localStorageService.isSupported) {

                    
                //}
                searchData = SharePointOnlineService.getCacheValue(SearchServiceFactory.cacheKey);
                $timeout(function () { // Force an asynchronous return
                    deferred.resolve(searchData);
                }, 0);

            }
            catch (err) {
                deferred.reject(err);
            }
            return deferred.promise;

        }

        return SearchServiceFactory;
    }
})();

(function () {

    angular.module('SharePointOnlineServices').service('modalService', ['$modal',
        function ($modal) {

            var modalDefaults = {
                backdrop: true,
                keyboard: true,
                modalFade: true,
                templateUrl: '/app/partials/modal.html'
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
