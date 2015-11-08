'use strict';

class Board {
  constructor () {
    this.grid = [];
  }
}

class BoardGenerator {
  makeBoard () {
    return new Board();
  }
}


angular.module('game.board', [])
  .service('Board', function () {
    return new BoardGenerator();
  });
