(function () {
    'use strict';

    var app = angular.module('SharePointOnlineDirectives');
    app.directive('spoInlinesearch', function ($compile) {
        var scripts = document.getElementsByTagName("script")
        var currentScriptPath = scripts[scripts.length - 1].src;

        return {
            restrict: 'EA', //element
            scope: {
                tenant: '='
            },
            //templateUrl: currentScriptPath.replace('InlineSearch.js', 'InlineSearch.html'),
            templateUrl: 'https://mjcdn.azurewebsites.net/scripts/Directives/InlineSearch/InlineSearch.html',
            //template: 'blah'    ,
            replace: true,
            //require: 'ngModel',
            link: function ($scope, elem, attr, ctrl) {
                console.debug($scope);
                //var textField = $('input', elem).attr('ng-model', 'myDirectiveVar');
                // $compile(textField)($scope.$parent);
            },
            controller: Controller
        };
    });

    Controller.$inject = ['$scope', 'SearchService', 'SharePointOnlineService', '$timeout'];
    function Controller($scope, SearchService, SharePointOnlineService, $timeout) {
       

        var vm = this;
        $scope.title = 'Base Controller';

        $scope.SearchText = "*sharepoint*";
        $scope.ShowSpinner = false;

        function ShowSpinner() { $scope.ShowSpinner = true; }
        function HideSpinner() { $scope.ShowSpinner = false; }

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

        function BindData(data, maxitems, fromCache) {
            var SearchResults = [];
            if ($scope.template == 2) {
                $scope.SearchResults = [];
                // var breakdowns = grouping.split(",");

                if (data || fromCache === false) {
                    data.forEach(function (item) {
                        var found = false;
                        if (item[$scope.groupingField].length > 0) {
                            var multipicks = item[$scope.groupingField].split(";");
                            SearchResults.forEach(function (result) {
                                multipicks.forEach(function (eachPick) {
                                    if (result.groupBy == eachPick) {
                                        if (result.children.length <= maxitems) {
                                            //  if ($.inArray(item, result.children) == -1) {
                                            result.children.push(item);
                                            // }
                                        }
                                        found = true;
                                    }
                                });
                            });

                            if (!found) {
                                multipicks.forEach(function (eachPick) {

                                    var groupingItem = {
                                        groupBy: eachPick,
                                        children: [item]
                                    }

                                    SearchResults.push(groupingItem);
                                });
                            }
                        }
                    });
                }
                $scope.SearchResults = SearchResults;
            }
            else {
                $scope.SearchResults = data;
            }
        };

        function ClearCache() {
            $scope.SearchResults = [];
            SharePointOnlineService.forceCacheDeletion();
        }

        // Set the cache key
        var wpId = SharePointOnlineService.GetURLParameters("wpId");
        var cacheKey = 'Officeworks_ONET2_Search_' + wpId
        SearchService.cacheKey = cacheKey;

        $scope.ClearCacheAndSearch = function (event) {
            if (event != null) {
                event.preventDefault();
            }
            ClearCache();
            $scope.Search();
        }

        $scope.Search = function () {
            ShowSpinner();
            try {
                $scope.template = SharePointOnlineService.GetURLParameters("displayTemplate");
                $scope.quickLinkTitle = SharePointOnlineService.GetURLParameters("quickLinkTitle");

                var query = SharePointOnlineService.GetURLParameters("filterQuery");
                var maxitems = SharePointOnlineService.GetURLParameters("maxitemsDisplay");
                var wpId = SharePointOnlineService.GetURLParameters("wpId");

                $scope.groupingField = SharePointOnlineService.GetURLParameters("groupingField");//"Category/Area Of InterestClick to expand menu";
                if (query) {
                    if (SharePointOnlineService.statusHtmlStorage(cacheKey) == 0) {
                        // Cache has expired
                        //        $timeout(function () { // Force an asynchronous return
                        SearchService.UpdateCache(query, wpId, $scope.template).then(function (data) {
                            BindData(data, maxitems, false);
                        }, function (data) {
                            _ShowValidationErrors(data);
                            console.log(data);
                        });
                        //    }, 0);
                    }
                    else {
                        //    $timeout(function () { // Force an asynchronous return
                        // Get search results from the cache
                        SearchService.SearchCache(wpId).then(function (data) {
                            BindData(data, maxitems, true);
                        }, function (data) {

                            _ShowValidationErrors(data);
                            console.log(data);
                        });
                        //        }, 0);
                        //$scope.sampleConfigTxt = "trimduplicates=false&rowlimit=100&refiners='RefinableString06:\"Equipment+Manuals+and+User+Guides\"'&sourceid='82ac564e-7d00-44fc-ac58-867d50636948'&clienttype='CSOM'";
                    }
                }
            }

            catch (err) {
                _ShowValidationErrors(err);
            }
            finally {
                HideSpinner();
            }
        }
        $scope.Search();

    }
})();