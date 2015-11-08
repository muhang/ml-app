'use strict';

angular.module('main', [
  'ionic',
  'ngCordova',
  'ui.router',
  // TODO: load other modules selected during generation
  'main.controllers',
  'main.directives',
  'game'
])
  .config(function ($stateProvider, $urlRouterProvider) {

    // ROUTING with ui.router
    $urlRouterProvider.otherwise('/start');
    $stateProvider
    // this state is placed in the <ion-nav-view> in the index.html
      .state('main', {
        url: '/main',
        //templateUrl: '/main/templates/main.html'
        views: {
          main: {
            templateUrl: 'main/templates/main.html',
            controller: 'MainCtrl'
          }
        }
        //template: '<ion-view view-title="MatchLink"></ion-view>',
        //templateUrl: 'main/templates/main.html',
        //controller: function ($scope) {
        //$scope.player = {};
        //}
      })
      .state('start', {
        url: '/start',
        views: {
          main: {
            templateUrl: 'main/templates/start.html',
            controller: 'StartCtrl'
          }
        }
      })
      .state('login', {
        url: '/login',
        views: {
          main: {
            templateUrl: 'main/templates/login.html'
          }
        }
      })

      .state('singleplayer', {
        url: '/singleplayer',
        views: {
          main: {
            templateUrl: 'main/templates/singleplayer.html'
          }
        }
      })
      .state('singleplayer-endless', {
        url: '/singleplayer-endless',
        views: {
          main: {
            templateUrl: 'main/templates/singleplayer-endless.html',
            controller: 'SoloEndlessCtrl'
          }
        }
      })
      .state('singleplayer-puzzle', {
        url: '/singleplayer-puzzle',
        views: {
          main: {
            templateUrl: 'main/templates/singleplayer-puzzle.html',
            controller: 'SoloPuzzleCtrl'
          }
        }
      })

      .state('multiplayer', {
        url: '/multiplayer',
        views: {
          main: {
            templateUrl: 'main/templates/multiplayer.html'
          }
        }
      });
    //$stateProvider
    //  .state('main.singleplayer', {
    //    url: '/singleplayer',
    //    views: {
    //      singleplayer: {
    //        templateUrl: 'main/templates/singleplayer.html'
    //      }
    //    }
    //  });
    //
    //$stateProvider
    //  .state('main.endless', {
    //    url: '/endless',
    //    views: {
    //      endless: {
    //        templateUrl: 'main/templates/singleplayer-endless.html'
    //      }
    //    }
    //  });
  });
