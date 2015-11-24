'use strict';

angular.module('game.cell', [])
    .service('CellFactory', function () {
        function Cell (x, y, type) {
            this.x = x;
            this.y = y;
            this.type = type;
            this.status = 0;
            this.selected = false;
            this.inPath = false;
            this.pathNumber = 0;
        }

        Cell.prototype.changeState = function (type) {
            this.type = type;
        };

        Cell.prototype.isWalkable = function () {
            return this.type === 'empty';
        };

        Cell.prototype.isSelectable = function () {
            return this.type === 'active';
        };

        Cell.prototype.isSelected = function () {
            return this.selected === true;
        };

        function CellGenerator () {}

        CellGenerator.prototype.generateEmptyCell = function (x, y) {
            return new Cell(x, y, 'empty');
        };

        CellGenerator.prototype.generateActiveCell = function (x, y, type) {
            return new Cell(x, y, 'active');
        };

        CellGenerator.prototype.generateBlockCell = function (x, y) {
            return new Cell(x, y, 'block');
        };

        return new CellGenerator();
    });