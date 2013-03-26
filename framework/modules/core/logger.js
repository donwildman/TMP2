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
     * A constant value for logging level: info.
     *
     * @type Number
     * @private
     */
    LEVEL_INFO: 0,

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
     * This method is used to log a message on logging level debug.
     *
     * @param {String} msg The logging message.
     */
    log: function( msg ) {
        this._print(msg, this.LEVEL_DEBUG);
    },

    /**
     * This method is used to log a message on logging level debug.
     *
     * @param {String} msg The logging message.
     */
    debug: function( msg ) {
        this._print(msg, this.LEVEL_DEBUG);
    },

    /**
     * This method is used to log a message on logging level error.
     *
     * @param {String} msg The logging message.
     */
    error: function( msg ) {
        this._print(msg, this.LEVEL_ERROR);
    },

    /**
     * This method is used to log a message on logging level warning.
     *
     * @param {String} msg The logging message.
     */
    warn: function( msg ) {
        this._print(msg, this.LEVEL_WARN);
    },

    /**
     * This method is used to log a message on logging level info.
     *
     * @param {String} msg The logging message.
     */
    info: function( msg ) {
        this._print(msg, this.LEVEL_INFO);
    },

    /**
     * Starts a new timer with an associated label.
     *
     * @param {String}
     */
    time: function( label ) {

        // Are we in production mode, then do not throw any logs
        if( this._appRunsInDebugMode() ) {
            return;
        }

        if( typeof console === 'undefined' || typeof console.time === 'undefined' ) {
            // TODO: Implement fallback
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
        if( this._appRunsInDebugMode() ) {
            return;
        }

        if( typeof console === 'undefined' || typeof console.time === 'undefined' ) {
            // TODO: Implement fallback
            return;
        }
        console.timeEnd(label);
    },

    /**
     * This method is used to log anything out of an application based on the given logging level.
     * Possible values for the logging level are:
     *
     * - debug:   M.LEVEL_DEBUG
     * - error:   M.ERROR
     * - warning: M.LEVEL_WARN
     * - info: M.LEVEL_INFO
     *
     * @param {String} msg The logging message.
     * @param {Number} level The logging level.
     * @private
     */
    _print: function( msg, level ) {
        level = level || this.LEVEL_DEBUG;

        // Are we in production mode, then do not throw any logs
        if( this._appRunsInDebugMode() ) {
            return;
        }

        /* Prevent a console.log from blowing things up if we are on a browser that doesn't support this. */
        if( typeof console === 'undefined' ) {
            window.console = {};
            console.log = console.info = console.warn = console.error = function() {
            };
        }

        switch( level ) {
            case this.LEVEL_DEBUG:
                console.debug(msg);
                break;
            case this.LEVEL_ERROR:
                console.error(msg);
                break;
            case this.LEVEL_WARN:
                console.warn(msg);
                break;
            case this.LEVEL_INFO:
                console.info(msg);
                break;
            default:
                console.debug(msg);
                break;
        }
    },

    /**
     * Check if app runs in debug mode
     *
     * @returns {boolean}
     * @private
     */
    _appRunsInDebugMode: function() {
        // TODO: Get debugMode form config
        return false;
    }

});