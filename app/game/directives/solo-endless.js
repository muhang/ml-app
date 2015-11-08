'use strict';

angular.module('game.solo.endless', [
            'game.board',
            'main.localstorage'
        ])
        .controller('SoloEndlessCtrl', function ($scope, $localstorage) {
            $scope.level = $localstorage.get('level', 0);
            $scope.score = $localstorage.get('score', 0);

        })
        .directive('soloEndless', function (BoardFactory) {

            function link(scope, element, attr) {
                var GameBoard = BoardFactory.makeBoard();
                console.log('gamelink');
                console.log(GameBoard);
            }

            return {
                restrict: 'EAC',
                link: link,
            };
        });
