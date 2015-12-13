'use strict';

angular.module('game.solo.endless', [
            'game.board',
            'main.localstorage'
        ])
        .controller('SoloEndlessCtrl', function ($scope, $localstorage) {
            $scope.score = $localstorage.get('score', 0);
        })
        .directive('soloEndless', function (BoardFactory, $localstorage) {

            function link(scope, element, attr) {

                function Game () {
                        this.timePlayed = 0;
                    this.isActive = false;
                    this.score = 0;
                    this.paused = false;
                    this.board = BoardFactory.makeEndlessBoard();
                    this.exitConfirmation = false;
                    this.paper = null;
                    this.fps = 60;
                    this.gameOver = false;
                    this.generationInterval = 1000;
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

                    var isRunning = function () {
                        return !self.paused && !self.gameOver && !self.exitConfirmation;
                    };

                    // set timer
                    setInterval(function () {
                        if (isRunning()) {
                            self.timePlayed++;
                        }
                    }, 1000);

                    // make new active cell 
                    setInterval(function () {
                        if (isRunning()) {
                            self.board.randomEmptyToActive();
                        }
                    }, this.generationInterval);

                    // auto-incrementing score for staying alive
                    setInterval(function () {
                        if (self.board.isFull()) {
                            self.gameOver = true;
                        }
                        if (isRunning()) {
                            self.score += 1;
                        }
                    }, 500);

                    // TODO intilaize event handlers
                    var maxTime = 0;

                    setInterval(function () {
                        for (var i = 0; i < self.board.cells.length; i++) {
                            var cell = self.board.cells[i];
                            if (cell.inPath) {
                                cell.timeInPath++;
                                if (cell.timeInPath > maxTime) {
                                    maxTime = cell.timeInPath;
                                }
                            } else {
                                cell.timeInPath = 0;
                            }
                        }
                    }, 50);

                    setInterval(function () {
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
                    exit.touchstart(function (e) {
                        if (self.gameOver) {
                            self.exit();
                        } else {
                            self.exitConfirmation = true;
                        }
                    });

                    var timePlayed = this.paper.text(35, topOffset + 35, this.timePlayed);
                    timePlayed.attr({ "font-size": 16, "font-family": "Helvetica Neue, Helvetica, Arial, sans-serif" });

                    var score = this.paper.text(this.paper.width - 50, topOffset, "SCORE");
                    score.attr({ "font-size": 20, "font-family": "Helvetica Neue, Helvetica, Arial, sans-serif" });

                    if (!this.gameOver) {

                        var pausedText = this.paused ? "RESUME" : "PAUSE";
                        var paused = this.paper.text(this.paper.width -50, this.paper.height - 10, pausedText);
                        paused.attr({ "font-size": 20, "font-family": "Helvetica Neue, Helvetica, Arial, sans-serif" });

                        paused.touchstart(function (e) {
                            e.preventDefault();
                            self.paused = !self.paused;
                        });
                    }


                    var scoreValue = this.paper.text(this.paper.width - 50, topOffset + 35, this.score);
                    scoreValue.attr({ "font-size": 16, "font-family": "Helvetica Neue, Helvetica, Arial, sans-serif" });
                };

                Game.prototype.drawBoard = function () {
                    if (this.exitConfirmation) {
                        this.renderExitConfirmation();
                    } else if (this.gameOver) {
                        this.renderGameOver();
                    } else if (this.paused) {
                        this.renderPause();
                    } else {
                        this.renderGame();
                    }
                };

                Game.prototype.exit = function () {
                    
                    var scores = JSON.parse($localstorage.get("endless", "[]"));
                    
                    scores.push({"score": this.score, "time": new Date()});

                    scores.sort(function (a, b) { return a.score - b.score; });

                    $localstorage.set("endless", JSON.stringify(scores));

                    window.location.href = "/";
                
                };

                Game.prototype.renderExitConfirmation = function () {
                    var self = this;

                    var text = "ABANDON GAME?";
                    var centerHorizontal = (this.paper.width / 2);
                    var centerVertical = (this.paper.height / 2) - 40;

                    var message = this.paper.text(centerHorizontal, centerVertical, text); 
                    message.attr({ "font-size": 40, "font-family": "Helvetica Neue, Helvetica, Arial, sans-serif" });

                    var yes = this.paper.text(centerHorizontal - 100, centerVertical + 100, "YES");
                    var no = this.paper.text(centerHorizontal + 100, centerVertical + 100, "NO");

                    yes.attr({ "font-size": 20, "font-family": "Helvetica Neue, Helvetica, Arial, sans-serif" });
                    no.attr({ "font-size": 20, "font-family": "Helvetica Neue, Helvetica, Arial, sans-serif" });

                    yes.touchstart(function (e) {
                        e.preventDefault();
                        self.exit();
                    });
                    no.touchstart(function (e) {
                        self.exitConfirmation = false;
                    });
                }


                Game.prototype.renderPause = function () {
                    var text = "PAUSED";
                    var centerHorizontal = (this.paper.width / 2);
                    var centerVertical = (this.paper.height / 2) - 40;

                    var paused = this.paper.text(centerHorizontal, centerVertical, text); 
                    paused.attr({ "font-size": 40, "font-family": "Helvetica Neue, Helvetica, Arial, sans-serif" });
                };

                Game.prototype.renderGameOver = function () {
                    var text = "GAME OVER";
                    var centerHorizontal = (this.paper.width / 2);
                    var centerVertical = (this.paper.height / 2) - 40;

                    var paused = this.paper.text(centerHorizontal, centerVertical, text); 
                    paused.attr({ "font-size": 40, "font-family": "Helvetica Neue, Helvetica, Arial, sans-serif" });
                };

                Game.prototype.renderGame = function () {
                    var CELL_WIDTH = this.paper.width / 8;
                    var CELL_HEIGHT = this.paper.width / 8;
                    var fullCurve = CELL_WIDTH / 2;

                    var self = this;
                    var totalTimeInPath = this.board.pathDelay + 759;

                    for (var i = 0; i < this.board.cells.length; i++) {
                        var cell = this.board.cells[i];
                        // get starting pixel location based on coordinate values
                        var startX = cell.x * CELL_WIDTH;
                        var startY = cell.y * CELL_HEIGHT;

                        var borderRadius = 0;
                        if (cell.timeInPath > 0) {
                            var time = cell.timeInPath * 50;
                            var percentComplete = Math.floor( (time / totalTimeInPath) * 100 );
                            var percentOfHalf;
                            
                            if (percentComplete < 50) {
                                percentOfHalf = percentComplete / 50;
                            } else {
                                percentOfHalf = (50 - (percentComplete - 50)) / 50;
                            }
                            borderRadius = percentOfHalf * fullCurve;
                        } else {
                            borderRadius = 5;
                        }

                        var rect = this.paper.rect(startX, startY, CELL_WIDTH, CELL_HEIGHT, borderRadius);

                        var fill;
                        if (cell.selected) {
                            fill = "#14e715"; 
                        } else {
                            fill = getColorForType(cell.status);
                        }
                        //} else if (cell.type === 'active')  {
                            //fill = getColorForType(cell.status);
                        //} else if (cell.type === 'empty') {
                            //fill = "#f4f5f4";
                        //}

                        var attributes = { "fill": fill, "stroke": "#FFF", "stroke-width": 5 };
                        rect.attr(attributes);

                        rect.touchstart(function (e) {
                            event.preventDefault();

                            var canvasLeftOffset = 10, 
                                canvasTopOffset = 53;

                            var x = event.touches[0].pageX - canvasLeftOffset,
                                y = event.touches[0].pageY - canvasTopOffset;

                            self.handleBoardClick(x, y);
                        });
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
                        0: '#F4F5F4',
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
