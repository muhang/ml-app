'use strict';

angular.module('main.controllers.solopuzzle', [
  'main.localstorage'
])
  .controller('SoloPuzzleCtrl', function ($scope, $localstorage) {
    $scope.level = $localstorage.get('level', 0);
    $scope.score = $localstorage.get('score', 0);
  });
