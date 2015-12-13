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
            console.log('width', this.width, 'height', this.height);
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

            console.log(randomEmptyCell);
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

        Board.prototype.removeSelectedCells = function () {
            for (var i = 0; i < this.cells.length; i++) {
                if (this.cells[i].selected) {
                    this.cells[i].selected = false;
                }
            }
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
                    inPath: true,
                    pathNumber: i+1
                });
            }

            return true;
        };

        Board.prototype.matchCells = function (cell1, cell2) {
            return cell1.isSelectable() && cell2.isSelectable()
                && cell1.type === cell2.type
                && this.getPath(cell1, cell2);
        };

        function BoardFactory () {}

        BoardFactory.prototype.makeEndlessBoard = function () {
            var ret = new Board(8, 8);
            return ret;
        };

        return new BoardFactory();
    });
