'use strict';

angular.module('game.board', ['game.cell'])
    .service('BoardFactory', function (CellFactory) {
        function Board () {
            this.grid;
            this.cells = [];
            this.width = 0;
            this.height = 0;
            this.activeTypes = [1, 2, 3, 4, 5, 6, 7, 'block', 'empty'];
        }

        Board.prototype.getSelectedCells = function () {
            
        };

        Board.prototype.removeCells = function () {

        };

        Board.prototype.isFull = function () {

        };

        function BoardFactory () {}

        BoardFactory.prototype.makeBoard = function () {
            return new Board();
        };

        BoardFactory.prototype.generateBoardFromDimensions = function (width, height) {

        };

        BoardFactory.prototype.generateBoardFromTemplate = function (template) {

        };

        return new BoardFactory();
    });