'use strict';

angular.module('main.controllers.highscores', [
    'main.localstorage'
])
    .controller('HighScoresCtrl', function ($scope, $localstorage) {
        $scope.endlessScores = JSON.parse($localstorage.get('endless', "[]"));

        // Get top 10
        $scope.endlessScores = $scope.endlessScores.slice(0, 10);

        for (var i = 0; i < $scope.endlessScores.length; i++) {
            $scope.endlessScores[i]['formattedTime'] = window.moment($scope.endlessScores[i]['time']).format("MMM Do");
        }
    });   
