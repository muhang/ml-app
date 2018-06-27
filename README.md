# MatchLink
Mobile game where the player clicks matching tiles with an open path between them to clear them from the board.

Built using Angular 1.x, gulp, and bower on the front-end, and Ionic / Cordova for mobile support.

# Building
- Make sure you have gulp and bower installed: `npm i -g gulp bower`
- Install dependencies
  * `npm install`
  * `bower install`

Framework summary can be found [here](https://github.com/mwaylabs/generator-m-ionic/blob/master/docs/intro/quick_start.md).

# Running
- Run application with `gulp watch`
- On a mobile device, visit local address provided by the above command.

## TODO
- Abstract most of Game runtime functionality out of game/directions/solo-endless
- Create puzzle levels
- Enforce CPU/GPU rendering depending on performance of device
- Make text prettier

This project was generated with Generator-M-Ionic v1.4.0. For more info visit the [repository](https://github.com/mwaylabs/generator-m-ionic).
