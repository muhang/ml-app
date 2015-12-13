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
                    this.canvas = null;
                    this.fps = 60;
                }

                Game.prototype.run = function () {
                    var self = this;
                    var windowWidth = window.innerWidth;

                    this.canvas = document.getElementById('main-canvas');
                    this.canvas.width = windowWidth - 20;
                    this.canvas.height = this.canvas.width;

                    // set timer
                    setInterval(function () {
                        if (!self.pause) {

                            // make new active cell every other tick
                            if (self.timePlayed%2 === 0) {
                                self.board.randomEmptyToActive();
                            }

                            // tick
                            self.timePlayed++;
                        }
                    }, 1000);

                    // TODO intilaize event handlers

                    setInterval(function () {
                        var ctx = self.canvas.getContext('2d');
                        ctx.clearRect(0, 0, self.canvas.offsetHeight, self.canvas.offsetHeight);
                        self.drawBoard();
                    }, 1000, this.fps);
                };

                Game.prototype.drawBoard = function () {
                    var self = this;
                    var CELL_WIDTH = this.canvas.width / 8;
                    var CELL_HEIGHT = this.canvas.width / 8;

                    if (!this.canvas.getContext('2d')) {
                        return;
                    }

                    var ctx = this.canvas.getContext('2d');

                    for (var i = 0; i < this.board.cells.length; i++) {
                        var cell = this.board.cells[i];
                        // get starting pixel location based on coordinate values
                        var startX = cell.x * CELL_WIDTH;
                        var startY = cell.y * CELL_HEIGHT;
                        
                        if (cell.type === 'active')  {
                            ctx.fillStyle = getColorForType(cell.status);
                            ctx.fillRect(startX, startY, CELL_WIDTH, CELL_HEIGHT);
                        } else if (cell.type === 'empty') {
                            ctx.fillStyle = "#f4f5f4";
                            ctx.fillRect(startX, startY, CELL_WIDTH, CELL_HEIGHT);
                            ctx.strokeStyle = "#aaa";
                            ctx.lineWidth = 1;
                            ctx.strokeRect(startX, startY, CELL_WIDTH, CELL_HEIGHT);
                        }
                    }
                };

                var getColorForType = function (type) {
                    var hash = {
                        1: '#E53935',
                        2: '#8E24AA',
                        3: '#43A047',
                        4: '#FFB300',
                        5: '#1E88E5',
                        6: '#00897B',
                        7: '#263238'
                    };

                    var color;

                    for (var num in hash) {
                        if (Number(num) === Number(type)) {
                            color = hash[num];
                        }
                    }

                    console.log(color);

                    return color;
                };

                var game = new Game();

                game.run();
            }

            return {
                restrict: 'EAC',
                link: link,
                template: '<canvas id="main-canvas" width="" height=""></canvas>'
            };
        });
