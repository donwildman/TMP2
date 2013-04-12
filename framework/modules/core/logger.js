// ==========================================================================
// Project:   The M-Project - Mobile HTML5 Application Framework
// Copyright: (c) 2013 M-Way Solutions GmbH. All rights reserved.
//            (c) 2013 panacoda GmbH. All rights reserved.
// Creator:   Stefan
// Date:      12.04.2013
// License:   Dual licensed under the MIT or GPL Version 2 licenses.
//            http://github.com/mwaylabs/The-M-Project/blob/master/MIT-LICENSE
//            http://github.com/mwaylabs/The-M-Project/blob/master/GPL-LICENSE
// ==========================================================================

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
     * @type Array / String
     */
    filter: [],

    /**
     * @type Sring
     */
    TAG_ALL: 'all',

    /**
     * @type Sring
     */
    TAG_FRAMEWORK_CORE: 'framework-core',

    /**
     * @type Sring
     */
    TAG_FRAMEWORK_UI: 'framework-ui',

     /**
     * The type of this object.
     *
     * @type String
     */
    _type: 'M.Logger',

    /**
     * A constant value for logging level: log.
     *
     * @type Number
     * @private
     */
    _LEVEL_LOG: 0,

    /**
     * A constant value for logging level: debug.
     *
     * @type Number
     * @private
     */
    _LEVEL_DEBUG: 1,

    /**
     * A constant value for logging level: warning.
     *
     * @type Number
     * @private
     */
    _LEVEL_WARN: 2,

    /**
     * A constant value for logging level: error.
     *
     * @type Number
     * @private
     */
    _LEVEL_ERROR: 3,

    /**
     * A constant value for logging level: timeEnd.
     *
     * @type Number
     * @private
     */
    _LEVEL_TIME_END: 4,

    /**
     * A constant value for logging level: count.
     *
     * @type Number
     * @private
     */
    _LEVEL_COUNT: 5,

    /**
     *
     * @type Array
     */
    _times: [],

    /**
     *
     * @type Array
     */
    _counts: [],

    /**
     * This method is used to log a message on logging level debug.
     *
     * @param {String} msg The logging message.
     * @param {String/Array} tag
     */
    log: function( msg, tag ) {
        this._print(msg, this._LEVEL_LOG, tag);
    },

    /**
     * This method is used to log a message on logging level warning.
     *
     * @param {String} msg The logging message.
     * @param {String/Array} tag
     */
    warn: function( msg, tag ) {
        this._print(msg, this._LEVEL_WARN, tag);
    },

    /**
     * This method is used to log a message on logging level error.
     *
     * @param {String} msg The logging message.
     * @param {String/Array} tag
     */
    error: function( msg, tag ) {
        this._print(msg, this._LEVEL_ERROR, tag);
    },

    /**
     * This method is used to log a message on logging level debug.
     *
     * @param {String} msg The logging message.
     * @param {String/Array} tag
     */
    debug: function( msg, tag ) {
        this._print(msg, this._LEVEL_DEBUG, tag);
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
        if( _.isUndefined(console.time) ) {
            this._time(label);
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
        if( _.isUndefined(console.timeEnd) ) {
            this._timeEnd(label);
            return;
        }
        console.timeEnd(label);
        //this._print(label, this._LEVEL_TIME_END);
    },

    /**
     *  Writes the number of times that count() has been invoked with the same label.
     *
     * @param {String}
     */
    count: function( label ) {

        // Are we in production mode, then do not throw any logs
        if( this._appRunsInNotDebugMode() ) {
            return;
        }

        // Fallback if the browser doesn't support count
        if( _.isUndefined(console.count) ) {
            this._count(label);
            return;
        }
        this._print(label, this._LEVEL_COUNT);
    },

    /**
     * This method is used to log anything out of an application based on the given logging level.
     *
     * @param {String} msg The logging message.
     * @param {Number} level The logging level.
     * @param {String/Array} tag
     * @private
     */
    _print: function( msg, level, tag ) {

        // Are we in production mode, then do not throw any logs
        if( this._appRunsInNotDebugMode() ) {
            return;
        }

        // Assign default level if level is undefined
        level = level || this._LEVEL_LOG;

        // Assign default tag if tag is undefined
        tag = tag || this.TAG_ALL;

        if( this._preventPrintByTag(tag) ) {
            return;
        }

        /* Prevent a console.log from blowing things up if we are on a browser that doesn't support this. */
        if( _.isUndefined(console) ) {
            window.console = {};
            console.log = console.info = console.warn = console.error = function() {
            };
        }

        if( level < this._LEVEL_DEBUG) {
            msg = '[' + tag + '] '+msg;
        }

        switch( level ) {
            case this._LEVEL_LOG:
                console.log(msg);
                break;
            case this._LEVEL_WARN:
                console.warn(msg);
                break;
            case this._LEVEL_ERROR:
                console.error(msg);
                break;
            case this._LEVEL_DEBUG:
                console.debug(msg);
                break;
            case this._LEVEL_TIME_END:
                console.timeEnd(msg);
                break;
            case this._LEVEL_COUNT:
                console.count(msg);
                break;
            default:
                console.log(msg);
                break;
        }
    },

    /**
     * Fallback if the browser doesn't support time
     *
     * @private
     */
    _time: function( label ) {
        var item = _.find(this._times, function( item ) {
            return item.label === label;
        });
        if( !item ) {
            this._times.push({
                label: label,
                time: new Date().getTime()
            });
        }
    },

    /**
     * Fallback if the browser doesn't support timeEnd
     *
     * @private
     */
    _timeEnd: function( label ) {
        var item = _.find(this._times, function( item ) {
            return item.label === label;
        });
        if( item ) {
            var now = new Date().getTime();
            var diff = (now - item.time) / 1000;
            var index = this._times.indexOf(item);
            this._print(item.label + ': ' + diff + 'ms', this._LEVEL_DEBUG);
            this._times.splice(index, 1);
        }
    },

    /**
     * Fallback if the browser doesn't support count
     *
     * @private
     */
    _count: function( label ) {
        var item = _.find(this._counts, function( item ) {
            return item.label === label;
        });
        if( item === undefined ) {
            this._counts.push({
                label: label,
                count: 1
            });
            item = _.last(this._counts);
        } else {
            item.count++;
        }

        this._print(item.label + ': ' + item.count, this._LEVEL_DEBUG);
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
    },

    /**
     * Prevent a print() call if the tag is not defined in filter.
     *
     * @param tag {String/Array}
     * @returns {boolean}
     * @private
     */
    _preventPrintByTag: function( tag ) {
        if( this.filter.length > 0 && this.filter.indexOf(this.TAG_ALL) === -1 ) {
            if( _.isString(tag) ) {
                if( this.filter.indexOf(tag) === -1 ) {
                    return YES;
                }
            } else if( _.isArray(tag) ) {
                if( _.difference(tag, this.filter).length === tag.length ) {
                    return YES;
                }
            }
        }
        return NO;
    }

});