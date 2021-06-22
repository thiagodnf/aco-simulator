// MIT licensed, Written by Abdul Khan and Alexey Novak, 2014
// version 0.1.3

var utils = utils || {};

// Publish/Subscribe pattern adapted from
// http://davidwalsh.name/pubsub-javascript
(function () {

    utils.Events = function () {
        this._init = this._init.bind(this);
        this._addListener = this._addListener.bind(this);
        this._generateToken = this._generateToken.bind(this);

        this.on = this.on.bind(this);
        this.emit = this.emit.bind(this);
        this.removeListener = this.removeListener.bind(this);
        this.removeListeners = this.removeListeners.bind(this);

        this._init();
    };

    utils.Events.prototype = {
        _init: function Events__init() {
            this._queues = {};
        },
        _generateToken: function Events__generateToken() {
            // taken from http://stackoverflow.com/a/105074/812519
            var s4 = function () {
                return Math.floor((1 + Math.random()) * 0x10000)
                    .toString(16)
                    .substring(1);
            };

            return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
                s4() + '-' + s4() + s4() + s4();
        },
        _addListener: function Events__addListener(eventName, callback, once) {
            if (typeof eventName !== 'string' || eventName === '' || typeof callback !== 'function') {
                throw 'Event.js: incorrect input parameters';
            }

            // Create the queue for an event if does not exist yet
            if (!this._queues[eventName]) {
                this._queues[eventName] = [];
            }

            var token = this._generateToken();

            // Add the listener to queue
            this._queues[eventName].push({
                callback: callback,
                once: once,
                increment: 0,
                token: token
            });

            // Provide handle back for removal of the listener
            return {
                token: token,
                remove: function () {
                    this.removeListener(eventName, token);
                }.bind(this)
            };
        },
        on: function Events_on(eventName, callback) {
            return this._addListener(eventName, callback, false);
        },
        once: function Events_once(eventName, callback) {
            return this._addListener(eventName, callback, true);
        },
        emit: function Events_emit(eventName, args) {
            // If the eventName doesn't exist, or there's no listeners in queue
            if (!this._queues[eventName] || !this._queues[eventName].length) {
                return;
            }

            // Cycle through event's queue and fire
            var items = this._queues[eventName],
                tempItems = items.slice(),
                len = items.length;
            for (var i = 0; i < len; i++) {
                var listener = tempItems[i];
                // if it is a one time listener then it will remove itself
                // after firing an event
                if (listener.once) {
                    items.splice(i, 1);
                }

                if (typeof listener.callback === 'function') {
                    listener.callback.apply(undefined, args || []);
                    listener.increment++;
                }
            }

            if (!items.length) {
                delete this._queues[eventName];
            }
        },
        removeListener: function Events_removeListener(eventName, token) {
            // If the eventName doesn't exist, or there's no listeners in queue
            if (!this._queues[eventName] || !this._queues[eventName].length) {
                return;
            }

            // Cycle through event's queue and remove matching functions
            var items = this._queues[eventName],
                len = items.length;
            for (var i = 0; i < len; i++) {
                if (items[i].token === token) {
                    items.splice(i, 1);
                    len--;
                    break;
                }
            }

            if (!items.length) {
                delete this._queues[eventName];
            }
        },
        removeListeners: function Events_removeListeners(eventName) {
            delete this._queues[eventName];
        },
        _queues: null
    };

})();
