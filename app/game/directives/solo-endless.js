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
                    this.gameOver = false;
                }


                Game.prototype.run = function () {
                    var self = this;
                    var windowWidth = window.innerWidth;

                    pubsub.sub("match", function () {
                        self.score += 50;
                    });

                    this.canvas = document.getElementById('main-canvas');
                    this.canvas.width = windowWidth - 20;
                    this.canvas.height = this.canvas.width + 150;

                    this.handleEvents();

                    // set timer
                    setInterval(function () {
                        if (!self.pause && !self.gameOver) {

                            // make new active cell every other tick
                            if (self.timePlayed%2 === 0) {
                                self.board.randomEmptyToActive();
                            }

                            // tick
                            self.timePlayed++;
                            self.score += 10;
                        }
                    }, 1000);

                    // TODO intilaize event handlers

                    setInterval(function () {
                        var ctx = self.canvas.getContext('2d');
                        ctx.clearRect(0, 0, self.canvas.offsetHeight, self.canvas.offsetHeight);
                        self.drawBoard();
                        self.drawUI();
                    }, 1000 / this.fps);
                };

                Game.prototype.drawUI = function () {
                    var self = this;

                    if (!this.canvas.getContext('2d')) {
                        return;
                    }

                    var ctx = this.canvas.getContext('2d');

                    var topOffset = this.canvas.width + 48;

                    ctx.font = "20px sans-serif";
                    ctx.fillStyle = "#3b3b3b";
                    ctx.strokeStyle = "#3b3b3b";

                    ctx.fillText("TIME", 20, topOffset);
                    ctx.fillText("SCORE", this.canvas.width - 100, topOffset);
                    ctx.fillText("EXIT", 20, this.canvas.height);
                    ctx.fillText("PAUSE", this.canvas.width - 100, this.canvas.height);

                    ctx.font = "16px sans-serif";
                    ctx.fillText(this.timePlayed, 20, topOffset + 35);
                    ctx.fillText(this.score, this.canvas.width - 100, topOffset + 35);
                };

                Game.prototype.drawBoard = function () {
                    var self = this;
                    var CELL_WIDTH = this.canvas.width / 8;
                    var CELL_HEIGHT = this.canvas.width / 8;

                    if (!this.canvas.getContext('2d')) {
                        return;
                    }

                    var ctx = this.canvas.getContext('2d');

                    if (this.gameOver) {
                        this.renderGameOver(ctx);
                    } else if (this.pause) {
                        this.renderPause(ctx);
                    } else {
                        this.renderGame(ctx);
                    }
                };

                Game.prototype.renderPause = function (ctx) {
                    var text = "PAUSED";
                    var textWidth = ctx.measureText(text);
                    var center = (this.canvas.width / 2) - (textWidth / 2);

                    ctx.font = "40px sans-serif";
                    ctx.fillStyle = "#3b3b3b";
                    ctx.fillText(text, center, this.canvas.height / 2);
                };

                Game.prototype.renderGameOver = function (ctx) {

                };

                Game.prototype.renderGame = function (ctx) {
                    for (var i = 0; i < this.board.cells.length; i++) {
                        var cell = this.board.cells[i];
                        // get starting pixel location based on coordinate values
                        var startX = cell.x * CELL_WIDTH;
                        var startY = cell.y * CELL_HEIGHT;

                        if (cell.selected) {
                            ctx.fillStyle = "#14e715"; 
                        } else if (cell.type === 'active')  {
                            ctx.fillStyle = getColorForType(cell.status);
                        } else if (cell.type === 'empty') {
                            ctx.fillStyle = "#f4f5f4";
                        }

                        if (cell.inPath) {
                            ctx.fillStyle = "#000";
                        }

                        ctx.fillRect(startX, startY, CELL_WIDTH, CELL_HEIGHT);
                        ctx.strokeStyle = "#aaa";
                        ctx.lineWidth = 1;
                        ctx.strokeRect(startX, startY, CELL_WIDTH, CELL_HEIGHT);
                    }
                };

                Game.prototype.handleEvents = function () {
                    var self = this;
                    
                    this.canvas.addEventListener('touchstart', function (event) {
                        event.preventDefault();

                        var canvasLeftOffset = 10, 
                            canvasTopOffset = 53;

                        var x = event.touches[0].pageX - canvasLeftOffset,
                            y = event.touches[0].pageY - canvasTopOffset;

                        if (y < self.canvas.width) {
                            self.handleBoardClick(x, y);
                        } else {
                            self.handleUIClick(x, y);
                        }
                    });
                };

                Game.prototype.handleBoardClick = function (x, y) {

                    var CELL_WIDTH = this.canvas.width / 8;
                    var CELL_HEIGHT = this.canvas.width / 8;

                    var cellX = Math.floor(x / CELL_WIDTH),
                        cellY = Math.floor(y / CELL_HEIGHT);

                    this.board.handleSelection(cellX, cellY);
                };

                Game.prototype.handleUIClick = function (x, y) {
                    
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
