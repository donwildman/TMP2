/**
 * @class
 *
 * M.Logger defines the prototype for any logging object. It is used to log messages out of the application
 * based on a given logging level.
 *
 * @extends M.Object
 */
M.Logger = M.Object.extend(/** @scope M.Logger.prototype */ {

    /**
     * A constant value for logging level: log.
     *
     * @type Number
     * @private
     */
    LEVEL_LOG: 0,

    /**
     * A constant value for logging level: debug.
     *
     * @type Number
     * @private
     */
    LEVEL_DEBUG: 1,

    /**
     * A constant value for logging level: warning.
     *
     * @type Number
     * @private
     */
    LEVEL_WARN: 2,

    /**
     * A constant value for logging level: error.
     *
     * @type Number
     * @private
     */
    LEVEL_ERROR: 3,

    /**
     * The type of this object.
     *
     * @type String
     */
    type: 'M.Logger',


    /**
     *
     * @type Array
     */
    _timeCollection: [],

    /**
     *
     * @type Array
     */
    _countCollection: [],

    /**
     * This method is used to log a message on logging level debug.
     *
     * @param {String} msg The logging message.
     */
    log: function( msg, options ) {
        this._print(msg, this.LEVEL_LOG, options);
    },

    /**
     * This method is used to log a message on logging level debug.
     *
     * @param {String} msg The logging message.
     */
    debug: function( msg, options ) {
        this._print(msg, this.LEVEL_LOG, options);
    },

    /**
     * This method is used to log a message on logging level info.
     *
     * @param {String} msg The logging message.
     */
    info: function( msg, options ) {
        this._print(msg, this.LEVEL_LOG, options);
    },

    /**
     * This method is used to log a message on logging level warning.
     *
     * @param {String} msg The logging message.
     */
    warn: function( msg, options ) {
        this._print(msg, this.LEVEL_WARN, options);
    },

    /**
     * This method is used to log a message on logging level error.
     *
     * @param {String} msg The logging message.
     */
    error: function( msg, options ) {
        this._print(msg, this.LEVEL_ERROR, options);
    },

    /**
     * Starts a new timer with an associated label.
     *
     * @param {String}
     */
    time: function( label ) {

        // Are we in production mode, then do not throw any logs
        if( this._appRunsInNotDebugMode() ) {
            return;
        }

        // Fallback if the browser doesn't support time
        if( typeof console === 'undefined' || typeof console.time === 'undefined' ) {
            var item = _.find(this._timeCollection, function( item ) {
                return item.label === label;
            });
            if( !item ) {
                this._timeCollection.push({
                    label: label,
                    time: new Date().getTime()
                });
            }
            return;
        }
        console.time(label);
    },

    /**
     * Stops the timer with the specified label and prints the elapsed time.
     *
     * @param {String}
     */
    timeEnd: function( label ) {

        // Are we in production mode, then do not throw any logs
        if( this._appRunsInNotDebugMode() ) {
            return;
        }

        // Fallback if the browser doesn't support timeEnd
        if( typeof console === 'undefined' || typeof console.time === 'undefined' ) {
            var item = _.find(this._timeCollection, function( item ) {
                return item.label === label;
            });
            if( item ) {
                var now = new Date().getTime();
                var diff = (now - item.time) / 1000;
                var index = this._timeCollection.indexOf(item);
                this._print(item.label + ': ' + diff + 'ms', this.LEVEL_DEBUG);
                this._timeCollection.splice(index, 1);
            }

            return;
        }
        console.timeEnd(label);
    },

    /**
     *
     * @param {String}
     */
    count: function( label ) {

        // Are we in production mode, then do not throw any logs
        if( this._appRunsInNotDebugMode() ) {
            return;
        }

        // Fallback if the browser doesn't support count
        if( typeof console === 'undefined' || typeof console.count === 'undefined' ) {
            var item = _.find(this._countCollection, function( item ) {
                return item.label === label;
            });
            if( item === undefined ) {
                this._countCollection.push({
                    label: label,
                    count: 1
                });
                item = _.last(this._countCollection);
            } else {
                item.count++;
            }

            this._print(item.label + ': ' + item.count, this.LEVEL_DEBUG);

            return;
        }
        console.count(label);
    },

    /**
     * This method is used to log anything out of an application based on the given logging level.
     *
     * @param {String} msg The logging message.
     * @param {Number} level The logging level.
     * @private
     */
    _print: function( msg, level, options ) {

        // Are we in production mode, then do not throw any logs
        if( this._appRunsInNotDebugMode() ) {
            return;
        }

        // Assign default level if level is undefined
        level = level || this.LEVEL_LOG;

        var defaultOptions = {
            // TODO: Add default options e.g. printDate
        }

        var settings = _.extend(defaultOptions, options);

        /* Prevent a console.log from blowing things up if we are on a browser that doesn't support this. */
        if( typeof console === 'undefined' ) {
            window.console = {};
            console.log = console.info = console.warn = console.error = function() {
            };
        }

        switch( level ) {
            case this.LEVEL_LOG:
                console.log(msg);
                break;
            case this.LEVEL_WARN:
                console.warn(msg);
                break;
            case this.LEVEL_ERROR:
                console.error(msg);
                break;
            case this.LEVEL_DEBUG:
                console.debug(msg);
                break;
            default:
                console.log(msg);
                break;
        }
    },

    /**
     * Check if app runs in debug mode
     *
     * @returns {boolean}
     * @private
     */
    _appRunsInNotDebugMode: function() {
        // TODO: Get debugMode form config
        return NO;
    }

});