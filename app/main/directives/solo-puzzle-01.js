'use strict';

angular.module('main.directives.solopuzzleone', [
  'main.board', 'main.localstorage'
])
  .controller('SoloPuzzleOneCtrl', ['$scope', function ($scope) {
    $scope.score = 0;
    $scope.time = 300;  // 5 mins (in seconds)
  }])
  .directive('soloPuzzleOne', function () {

    function link (scope, element, attrs) {
      console.log('link');
    }

    return {
      restrict: 'EAC',
      link: link
    };
  });
