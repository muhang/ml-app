'use strict';

angular.module('game.board', [
    'game.cell',
    'ngLodash'
])
    .service('BoardFactory', function (CellFactory, lodash) {
        function Board (width, height) {
            this.grid;
            this.cells = [];
            this.width = width;
            this.height = height;
            this.activeTypes = [1, 2, 3, 4, 5, 6, 7];
            this.types = ['active', 'block', 'empty'];

            this.initializeGrid();
            this.initializeCells();
        }

        Board.prototype.initializeGrid = function () {
            var matrix = [];
            for (var i = 0; i < this.width; i++) {
                var mRow = [];

                for (var j = 0; j < this.height; j++) {
                    mRow.push(0);
                }
                matrix.push(mRow);
            }
            this.grid = new PF.Grid(this.width, this.height, matrix);
        };

        Board.prototype.initializeCells = function () {
            for (var i = 0; i < this.height; i++) {

                for (var j = 0; j < this.width; j++) {
                    this.cells.push(CellFactory.generateEmptyCell(i, j));
                }
            }
        };

        Board.prototype.getCell = function (x, y) {
            return lodash.filter(this.cells, function (cell) {
                return cell.x === x && cell.y === y;
            });
        };

        Board.prototype.randomEmptyToActive = function () {
            var randomType = this.getRandomItemFromArray(this.activeTypes);

            var randomEmptyCell = this.getRandomItemFromArray(lodash.filter(this.cells, function (cell) {
                return cell.type === 'empty';
            }));

            this.modifyCellByLocation(randomEmptyCell.x, randomEmptyCell.y, {
                status: randomType,
                type: 'active'
            });
        };

        Board.prototype.activeToEmpty = function (cell) {
            cell.type = 'empty'; 
        };

        Board.prototype.modifyCellByLocation = function (x, y, props) {
            for (var i = 0; i < this.cells.length; i++) {
                if (this.cells[i].x === x && this.cells[i].y === y) {
                    for (var prop in props) {
                        this.cells[i][prop] = props[prop];
                    }
                }
            }
        };

        Board.prototype.handleSelection = function (x, y) {
            var cell = this.getCell(x, y);
            cell = cell[0];

            if (cell.type !== 'active') {
                return;
            }
            
            if (cell.selected) {
                cell.selected = false;
                return;
            }

            cell.selected = true;

            var selectedCells = this.getSelectedCells();

            console.log('selectedCells', selectedCells);

            if (selectedCells.length < 2) {
                return;
            }

            if (!this.matchCells(selectedCells[0], selectedCells[1])) {
                this.matchFailure(selectedCells[0], selectedCells[1]);
                return;
            }

            this.matchSuccess(selectedCells[0], selectedCells[1]);
        };

        Board.prototype.matchSuccess = function (cellA, cellB) {
            cellA.successState = true;

            cellB.successState = true;
            
            var pathCells = [];
            
            for (var i = 0; i < this.cells.length; i++) {
                if (this.cells[i].pathNumber !== 0) {
                    pathCells.push(this.cells[i]);
                }
            } 

            pathCells = pathCells.sort(function (a, b) { return a.pathNumber - b.pathNumber; });
            
            var addDelay = 0;
            var delayConstant = 100;
            var timeInPath = delayConstant * 2.5;

            for (var j = 0; j < pathCells.length; j++) {
                (function (idx) {
                    addDelay += delayConstant; 

                    var removeDelay = addDelay + timeInPath;

                    setTimeout(function () {
                        if (idx === 0) {
                            cellA.type = 'empty';
                        }

                        console.log('adding', pathCells[idx]);
                        pathCells[idx].inPath = true;
                        
                    }, addDelay);

                    setTimeout(function () {
                        if (idx === pathCells.length - 1) {
                            cellB.type = 'empty';
                        }

                        console.log('removing', pathCells[idx]);
                        pathCells[idx].inPath = false;
                        pathCells[idx].pathNumber = 0;
                    }, removeDelay);
                })(j)
            }

            this.removeSelection(); 
        };

        Board.prototype.matchFailure = function (cellA, cellB) {
            cellA.errorState = true;
            cellB.errorState = true;

            setTimeout(function () {
                cellA.errorState = false;
                cellB.errorState = false;
            }, 1000);

            this.removeSelection(); 
        };

        Board.prototype.removeSelection = function () {
            for (var i = 0; i < this.cells.length; i++) {
                if (this.cells[i].selected) {
                    this.cells[i].selected = false;
                }
            }
        };

        Board.prototype.getSelectedCells = function () {
            var ret = [];
            for (var i = 0; i < this.cells.length; i++) {
                if (this.cells[i].selected) {
                    ret.push(this.cells[i]);
                }
            }

            return ret;
        };

        Board.prototype.getActiveCells = function () {
            return lodash.filter(this.cells, function (cell) {
                return cell.type !== 'empty' && cell.type !== 'block';
            });
        };

        Board.prototype.getRandomItemFromArray = function (list) {
            return list[Math.floor(Math.random() * list.length)];
        };

        Board.prototype.isFull = function () {
            return this.getActiveCells().length === this.width * this.height;
        };

        Board.prototype.getPath = function (cell1, cell2) {
            this.grid.setWalkableAt(cell1.x, cell1.y, true);
            this.grid.setWalkableAt(cell2.x, cell2.y, true);

            var gridBackup = this.grid.clone();
            var finder = new PF.AStarFinder();
            var path = finder.findPath(cell1.x, cell1.y, cell2.x, cell2.y, this.grid);

            this.grid = gridBackup;

            if (!path.length) {
                return false;
            }

            for (var i = 0; i < path.length; i++) {
                this.modifyCellByLocation(path[i][0], path[i][1], {
                    pathNumber: i+1
                });
            }

            return true;
        };

        Board.prototype.matchCells = function (cell1, cell2) {
            return cell1.isSelectable() && cell2.isSelectable()
                && cell1.type === cell2.type
                && cell1.status === cell2.status
                && this.getPath(cell1, cell2);
        };

        function BoardFactory () {}

        BoardFactory.prototype.makeEndlessBoard = function () {
            var ret = new Board(8, 8);
            return ret;
        };

        return new BoardFactory();
    });
