'use strict';

angular.module('game.solo.endless', [
            'game.board',
            'main.localstorage'
        ])
        .controller('SoloEndlessCtrl', function ($scope, $localstorage) {
            $scope.score = $localstorage.get('score', 0);
        })
        .directive('soloEndless', function (BoardFactory) {

            function link(scope, element, attr) {
                function Game () {
                    this.timePlayed = 0;
                    this.isActive = false;
                    this.score = 0;
                    this.paused = false;
                    this.board = BoardFactory.makeEndlessBoard();
                }

                Game.prototype.run = function () {
                    var self = this;
                    var canvas = document.getElementById('main-canvas');

                    // set timer
                    setInterval(function () {
                        if (!self.pause) {
                            if (self.timePlayed%2 === 0) {
                                self.board.randomEmptyToActive();
                            }
                            self.timePlayed++;
                        }
                    }, 1000);

                    setInterval(function () {
                        var ctx = canvas.getContext('2d');
                        ctx.clearRect(0, 0, canvas.offsetHeight, canvas.offsetHeight);

                    })
                };

                console.log('gamelink');
                console.log(GameBoard);
            }

            return {
                restrict: 'EAC',
                link: link,
                template: '<canvas id="main-canvas" width="" height=""></canvas>'
            };
        });
