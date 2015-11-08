'use strict';

class Cell {
  constructor () {

  }
}

class CellGenerator {
  makeCell () {
    return new Cell();
  }
}

angular.module('game.cell', [])
  .service('Cell', function () {
    return new CellGenerator();
  });
