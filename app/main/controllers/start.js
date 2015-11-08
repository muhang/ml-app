'use strict';

angular.module('main.controllers.start', [
])
  .controller('StartCtrl', function ($scope) {
    $scope.items = [{'title': 'poo1'}, {'title': 'poo2'}];
  });
