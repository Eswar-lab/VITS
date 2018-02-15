(function () {
    'use strict';
    angular
        .module('SharePointOnlineControllers', ['ui.bootstrap', 'SharePointOnlineServices'])
        .controller('BaseController', BaseController)

    /* Base Controller */
    BaseController.$inject = ['$scope', '$rootScope', '$location', 'SharePointOnlineService'];
    function BaseController($scope, $rootScope, $location, SharePointOnlineService) {

        $scope.FunctionA = function () {
            // blah .. //
        }
        /* Nothing to do */

       

    }
 
})();
