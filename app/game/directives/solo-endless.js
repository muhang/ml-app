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
                    this.paper = null;
                    this.fps = 60;
                    this.gameOver = false;
                    this.generationInterval = 1500;
                }

                Game.prototype.run = function () {
                    var self = this;
                    var windowWidth = window.innerWidth;

                    pubsub.sub("match", function () {
                        self.score += 10;
                    });

                    var cWidth = windowWidth - 20,
                        cHeight = cWidth + 150;

                    var canvas = document.getElementById('main-canvas');
                    canvas.width = windowWidth - 20;
                    canvas.height = canvas.width + 150;

                    this.paper = new Raphael(canvas, cWidth, cHeight);



                    //this.canvas.width = windowWidth - 20;
                    //this.canvas.height = this.canvas.width + 150;

                    //this.handleEvents();

                    // set timer
                    setInterval(function () {
                        if (!self.paused && !self.gameOver) {
                            self.timePlayed++;
                        }
                    }, 1000);

                    // make new active cell 
                    setInterval(function () {
                        if (!self.paused && !self.gaveOver) {
                            self.board.randomEmptyToActive();
                        }
                    }, this.generationInterval);

                    // auto-incrementing score for staying alive
                    setInterval(function () {
                        if (!self.paused && !self.gameOver) {
                            self.score += 1;
                        }
                    }, 500);

                    // TODO intilaize event handlers

                    setInterval(function () {
                        //var ctx = self.canvas.getContext('2d');
                        //ctx.clearRect(0, 0, self.canvas.offsetHeight, self.canvas.offsetHeight);
                        self.paper.clear();
                        self.drawBoard();
                        self.drawUI();
                    }, 1000 / this.fps);
                };

                Game.prototype.drawUI = function () {
                    var self = this;
                    var topOffset = this.paper.width + 48;

                    var time = this.paper.text(35, topOffset, "TIME");
                    time.attr({ "font-size": 20, "font-family": "Helvetica Neue, Helvetica, Arial, sans-serif" });

                    var exit = this.paper.text(35, this.paper.height - 10, "EXIT");
                    exit.attr({ "font-size": 20, "font-family": "Helvetica Neue, Helvetica, Arial, sans-serif" });

                    var timePlayed = this.paper.text(35, topOffset + 35, this.timePlayed);
                    timePlayed.attr({ "font-size": 16, "font-family": "Helvetica Neue, Helvetica, Arial, sans-serif" });

                    var score = this.paper.text(this.paper.width - 50, topOffset, "SCORE");
                    score.attr({ "font-size": 20, "font-family": "Helvetica Neue, Helvetica, Arial, sans-serif" });

                    var pausedText = this.paused ? "RESUME" : "PAUSED";
                    var paused = this.paper.text(this.paper.width -50, this.paper.height - 10, pausedText);
                    paused.attr({ "font-size": 20, "font-family": "Helvetica Neue, Helvetica, Arial, sans-serif" });

                    paused.touchstart(function (e) {
                        e.preventDefault();
                        self.paused = !self.paused;
                    });

                    var scoreValue = this.paper.text(this.paper.width - 50, topOffset + 35, this.score);
                    scoreValue.attr({ "font-size": 16, "font-family": "Helvetica Neue, Helvetica, Arial, sans-serif" });

                    //if (!this.canvas.getContext('2d')) {
                        //return;
                    //}

                    //var ctx = this.canvas.getContext('2d');

                    //var topOffset = this.canvas.width + 48;

                    //ctx.font = "20px sans-serif";
                    //ctx.fillStyle = "#3b3b3b";
                    //ctx.strokeStyle = "#3b3b3b";

                    //ctx.fillText("TIME", 20, topOffset);
                    //ctx.fillText("SCORE", this.canvas.width - 100, topOffset);


                    //ctx.fillText("EXIT", 20, this.canvas.height);
                    //var pauseText = this.paused ? "RESUME" : "PAUSE";
                    //ctx.fillText(pauseText, this.canvas.width - 100, this.canvas.height);

                    //ctx.font = "16px sans-serif";
                    //ctx.fillText(this.timePlayed, 20, topOffset + 35);
                    //ctx.fillText(this.score, this.canvas.width - 100, topOffset + 35);


                };

                Game.prototype.drawBoard = function () {
                    if (this.gameOver) {
                        this.renderGameOver();
                    } else if (this.paused) {
                        this.renderPause();
                    } else {
                        this.renderGame();
                    }
                };

                Game.prototype.renderPause = function (ctx) {
                    var text = "PAUSED";
                    var centerHorizontal = (this.paper.width / 2);
                    var centerVertical = (this.paper.height / 2) - 40;

                    var paused = this.paper.text(centerHorizontal, centerVertical, text); 
                    paused.attr({ "font-size": 40, "font-family": "Helvetica Neue, Helvetica, Arial, sans-serif" });

                    //ctx.font = "40px sans-serif";
                    //ctx.fillStyle = "#3b3b3b";
                    //ctx.fillText(text, centerHorizontal, centerVertical);
                };

                Game.prototype.renderGameOver = function (ctx) {
                    ctx.font = "40px sans-serif";
                    ctx.fillStyle = "#3b3b3b";
                    ctx.fillText(text, center, this.canvas.height / 2);
                };

                Game.prototype.renderGame = function (ctx) {
                    var CELL_WIDTH = this.paper.width / 8;
                    var CELL_HEIGHT = this.paper.width / 8;

                    var self = this;

                    for (var i = 0; i < this.board.cells.length; i++) {
                        var cell = this.board.cells[i];
                        // get starting pixel location based on coordinate values
                        var startX = cell.x * CELL_WIDTH;
                        var startY = cell.y * CELL_HEIGHT;

                        var rect = this.paper.rect(startX, startY, CELL_WIDTH, CELL_HEIGHT);

                        var fill;
                        if (cell.selected) {
                            fill = "#14e715"; 
                        } else if (cell.type === 'active')  {
                            fill = getColorForType(cell.status);
                        } else if (cell.type === 'empty') {
                            fill = "#f4f5f4";
                        }

                        //if (cell.inPath) {
                            //ctx.fillStyle = "#000";
                        //}

                        rect.attr({ "fill": fill, "stroke": "#AAA", "stroke-width": 1 });

                        rect.touchstart(function (e) {
                            event.preventDefault();

                            var canvasLeftOffset = 10, 
                                canvasTopOffset = 53;

                            var x = event.touches[0].pageX - canvasLeftOffset,
                                y = event.touches[0].pageY - canvasTopOffset;

                            self.handleBoardClick(x, y);
                        });

                        //ctx.fillRect(startX, startY, CELL_WIDTH, CELL_HEIGHT);
                        //ctx.strokeStyle = "#aaa";
                        //ctx.lineWidth = 1;
                        //ctx.strokeRect(startX, startY, CELL_WIDTH, CELL_HEIGHT);
                    }
                };

                Game.prototype.handleBoardClick = function (x, y) {
                    var CELL_WIDTH = this.paper.width / 8;
                    var CELL_HEIGHT = this.paper.width / 8;

                    var cellX = Math.floor(x / CELL_WIDTH),
                        cellY = Math.floor(y / CELL_HEIGHT);

                    this.board.handleSelection(cellX, cellY);
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
                template: '<div id="main-canvas" width="" height=""></div>'
            };
        });
