(function () {
    'use strict';
    // https://stackoverflow.com/questions/17063000/ng-model-for-input-type-file 
    var app = angular.module('SharePointOnlineDirectives');
    app.directive('filesInput', function () {
        return {
            require: "ngModel",
            link: function postLink(scope, elem, attrs, ngModel) {
                elem.on("change", function (e) {
                    var files = elem[0].files;
                    if (files.length > 0)
                    { ngModel.$setViewValue(files); }
                    else { ngModel.$setViewValue(undefined); }
                })
            }
        }
    });
})();