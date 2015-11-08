'use strict';

angular.module('game.solo.endless', [
  'game.board',
  'game.cell',
  'game.main',
  'main.localstorage'
])
  .controller('SoloEndlessCtrl', function ($scope, $localstorage) {
    $scope.level = $localstorage.get('level', 0);
    $scope.score = $localstorage.get('score', 0);

  })
  .directive('soloEndless', function (Board, Cell, Main) {

    function link (scope, element, attr) {
      var GameBoard = Board.makeBoard();
      console.log('gamelink');
      console.log(GameBoard);
    }

    return {
      restrict: 'EAC',
      link: link
    };
  });
