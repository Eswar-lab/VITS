(function () {
    'use strict';

    var app = angular.module('SharePointOnlineDirectives');
    app.directive('spoElectronicrecords', function ($compile) {
        var scripts = document.getElementsByTagName("script")
        var currentScriptPath = scripts[scripts.length - 1].src;

        return {
            restrict: 'EA', //element
            scope: {
                tenant: '='
            },
            //templateUrl: currentScriptPath.replace('InlineSearch.js', 'InlineSearch.html'),
            templateUrl: 'https://localhost/scripts/Directives/InlineSearch/InlineSearch.html',
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

        function GetDocumentSets() {

        }

        function SaveDocumentSet(properties[]) {

        }

        function GetDocumentsAndPropertiesForDocument(docSetId) {

        }

        function SaveDocumentProperties(properties) {

        }

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

       
        function ClearCache() {
            $scope.SearchResults = [];
            SharePointOnlineService.forceCacheDeletion();
        }

        // Set the cache key
        var wpId = SharePointOnlineService.GetURLParameters("wpId");
        var cacheKey = 'VIT_ElectronicRecords_' + wpId
        SearchService.cacheKey = cacheKey;

        $scope.ClearCacheAndSearch = function (event) {
            if (event != null) {
                event.preventDefault();
            }
            ClearCache();
            $scope.Search();
        }
    }
})();