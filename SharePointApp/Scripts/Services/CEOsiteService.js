(function () {
    'use strict';

    angular
        .module('SharePointOnlineServices')
        .factory('CEOsiteService', CEOsiteService);

    CEOsiteService.$inject = ['$http', '$q', '$timeout', 'SharePointOnlineService'];

    function CEOsiteService($http, $q, $timeout, SharePointOnlineService) {


        var CEOsiteService = {}
        CEOsiteService.cacheKey = null;
        CEOsiteService.getAnoucements = getAnoucements;

        CEOsiteService.slides = [];
        CEOsiteService.currIndex = 0;
        function getAnoucements() {

            // $http.get(BASE_URL + 'scenes').then(function (response) {
            // $http.get(BASE_URL.format('scenes')).then(function (response) {
            //
            //     $scope.slides = response.data;
            //
            //
            // });
            addSlide();
            addSlide();
            addSlide();

        }


        function generateIndexesArray() {
            var indexes = [];
            for (var i = 0; i <  CEOsiteService.currIndex; ++i) {
                indexes[i] = i;
            }
            return shuffle(indexes);
        }

        // http://stackoverflow.com/questions/962802#962890
        function shuffle(array) {
            var tmp, current, top = array.length;

            if (top) {
                while (--top) {
                    current = Math.floor(Math.random() * (top + 1));
                    tmp = array[current];
                    array[current] = array[top];
                    array[top] = tmp;
                }
            }

            return array;
        }


        function addSlide() {
            var newWidth = 600 + CEOsiteService.slides.length + 1;
            CEOsiteService.slides.push({
                image: '//unsplash.it/' + newWidth + '/300',
                text: ['Nice image', 'Awesome photograph', 'That is so cool', 'I love that'][CEOsiteService.slides.length % 4],
                id:  CEOsiteService.currIndex++
            });
        };

        function assignNewIndexesToSlides(indexes) {
            for (var i = 0, l = CEOsiteService.slides.length; i < l; i++) {
                CEOsiteService.slides[i].id = indexes.pop();
            }
        }

        return CEOsiteService;
    }
})();