window.pubsub = (function () {
    var eventToListeners = {};

    return {
        sub: function (event, callback) {
            if (!eventToListeners.hasOwnProperty(event)) {
                eventToListeners[event] = [];
            }
            eventToListeners[event].push(callback);
        },
        pub: function (event, args) {
            if (eventToListeners.hasOwnProperty(event)) {
                for (var i = 0; i < eventToListeners[event].length; ++i) {
                   try {
                       eventToListeners[event][i].call(null, args);
                   } catch (e) {
                       if (console && console.error) {
                           console.error(e);
                       }
                   }
                }
            }
        }
    };
}());
