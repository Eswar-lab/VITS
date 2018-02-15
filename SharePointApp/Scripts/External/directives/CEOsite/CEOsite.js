//var site_url = 'https://vit1.sharepoint.com';
//var d = new Date();
//var n = d.getTime();
//$('<link/>', {
//    rel: 'stylesheet',
//    type: 'text/css',
//    href: 'https://maxcdn.bootstrapcdn.com/bootstrap/3.3.4/css/bootstrap.min.css'
//}).appendTo('head');
//$('<link/>', {
//    rel: 'stylesheet',
//    type: 'text/css',
//    href: 'https://maxcdn.bootstrapcdn.com/bootstrap/3.3.4/css/bootstrap-theme.min.css'
//}).appendTo('head');

//$('<script/>', {

//    type: 'text/javascript',
//    src: 'https://maxcdn.bootstrapcdn.com/bootstrap/3.3.4/js/bootstrap.min.js'
//}).appendTo('head');



(function () {
    'use strict';

    var app = angular.module('SharePointOnlineDirectives');
    app.directive('spoCeosite', function ($compile) {
        // var scripts = document.getElementsByTagName("script")
        // var currentScriptPath = scripts[scripts.length - 1].src;

        return {
            restrict: 'EA', //element
            scope: {
                tenant: '='
            },
            //templateUrl: currentScriptPath.replace('InlineSearch.js', 'InlineSearch.html'),
            templateUrl: 'https://localhost:44326/scripts/Directives/CEOsite/CEOsite.html',
            // template: 'CEOsite.html'    ,
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

    Controller.$inject = ['$scope', 'CEOsiteService', 'SharePointOnlineService', '$timeout'];
    function Controller($scope, CEOsiteService, SharePointOnlineService, $timeout) {


        $scope.myInterval = 5000;
        $scope.noWrapSlides = false;
        $scope.active = 0;
        var slides = $scope.slides = [];
        var currIndex = 0;

        CEOsiteService.getAnoucements();

        $scope.slides = CEOsiteService.slides;


    }
})();