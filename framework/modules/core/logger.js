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
 * M.Logger defines the prototype for any logging object.
 * It is used to log messages out of the application.
 *
 * @extends M.Object
 */
M.Logger = M.Object.extend(/** @scope M.Logger.prototype */ {

    /**
     * Specifies which tags are displayed in the console.
     * Leave this properties empty to display all logs.
     *
     * M.Logger.filter('tag1');
     *
     * M.Logger.log('Init Module', 'tag1');               // will displayed
     * M.Logger.log('Get environment', 'tag2');           // will not displayed
     * M.Logger.log('Loading data', ['tag1', 'tag2']);    // will displayed
     * M.Logger.log('Loading images', ['tag2', 'tag3']);  // will not displayed
     *
     * @type Array
     */
    filter: [],

    /**
     * A constant value for tag type: empty.
     *
     * @type Sring
     */
    TAG_EMPTY: '',

    /**
     * The type of this object.
     *
     * @type String
     */
    _type: 'M.Logger',

    /**
     * A constant value for logging output: log.
     *
     * @type Number
     * @private
     */
    _OUTPUT_LOG: 0,

    /**
     * A constant value for logging output: warning.
     *
     * @type Number
     * @private
     */
    _OUTPUT_DEBUG: 1,

    /**
     * A constant value for logging output: warning.
     *
     * @type Number
     * @private
     */
    _OUTPUT_WARN: 2,

    /**
     * A constant value for logging output: error.
     *
     * @type Number
     * @private
     */
    _OUTPUT_ERROR: 3,

    /**
     * A constant value for logging level: timeEnd.
     *
     * @type Number
     * @private
     */
    _LEVEL_TIME_END: 4,

    /**
     * This property holds the fallback entries for _time() / _timeEnd()
     *
     * @type Array
     */
    _times: [],

    /**
     * This property holds the fallback entries for _count()
     *
     * @type Array
     */
    _counts: [],

    /**
     * This property holds the debugMode from the config
     *
     * @type Boolean
     */
    _appRunsInNotDebugMode: NO,

    /**
     * Constructor method for M.Logger
     */
    init: function () {

        // Prevent a console.log from blowing things up if we are on a browser that doesn't support this.
        if (_.isUndefined(console)) {
            window.console = {};
            console.log = console.debug = console.warn = console.error = function () {};
        }

        // Check if app runs in debug mode
        // TODO: Get debugMode form config
        this._appRunsInNotDebugMode = NO;
    },

    /**
     * This method is used to log a message on logging level debug.
     *
     * @param {String} message The logging message.
     * @param {String/Array} tag
     */
    log: function (message, tag) {
        this._print(this._OUTPUT_LOG, message, tag);
    },

    /**
     * This method is used to log a message on logging level warning.
     *
     * @param {String} message The logging message.
     * @param {String/Array} tag
     */
    warn: function (message, tag) {
        this._print(this._OUTPUT_WARN, message, tag);
    },

    /**
     * This method is used to log a message on logging level error.
     *
     * @param {String} message The logging message.
     */
    error: function (message) {
        this._print(this._OUTPUT_ERROR, message);
    },

    /**
     * Starts a new timer with an associated label.
     *
     * @param {String}
     */
    time: function (label) {

        // Are we in production mode, then do not throw any logs
        if (this._appRunsInNotDebugMode) {
            return;
        }

        // Fallback if the browser doesn't support time
        if (_.isUndefined(console.time)) {
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
    timeEnd: function (label) {

        // Are we in production mode, then do not throw any logs
        if (this._appRunsInNotDebugMode) {
            return;
        }

        // Fallback if the browser doesn't support timeEnd
        if (_.isUndefined(console.timeEnd)) {
            this._timeEnd(label);
            return;
        }
        console.timeEnd(label);
    },

    /**
     *  Writes the number of times that count() has been invoked with the same label.
     *
     * @param {String}
     */
    count: function (label) {

        // Are we in production mode, then do not throw any logs
        if (this._appRunsInNotDebugMode) {
            return;
        }

        // Fallback if the browser doesn't support count
        if (_.isUndefined(console.count2)) {
            this._count(label);
            return;
        }
        console.count(label);
    },

    /**
     * This method is used to log anything out of an application based on the given logging level.
     *
     * @param {String} message The logging message.
     * @param {Number} output The logging level.
     * @param {String/Array} tag
     * @private
     */
    _print: function (output, message, tag) {

        // Are we in production mode, then do not throw any logs
        if (this._appRunsInNotDebugMode) {
            return;
        }

        // Assign default level if level is undefined
        output = output || this._OUTPUT_LOG;

        // Assign default tag if tag is undefined
        tag = tag || this.TAG_EMPTY;

        if (this._preventOutputByTag(tag)) {
            return;
        }

        if (output < this._OUTPUT_ERROR) {
            if (_.isArray(tag) && this.filter.indexOf(this.TAG_EMPTY) === -1) {
                var tagString = _.without(this.filter, tag);
                message = '[' + tagString + '] ' + message;
            } else if (tag.length > 0) {
                message = '[' + tag + '] ' + message;
            }
        }

        switch (output) {
            case this._OUTPUT_LOG:
                console.log(message);
                break;
            case this._OUTPUT_WARN:
                console.warn('WARNING: ' + message);
                break;
            case this._OUTPUT_ERROR:
                console.error('ERROR: ' + message);
                break;
            case this._OUTPUT_DEBUG:
                console.debug(message);
                break;
            default:
                console.log(message);
                break;
        }
    },

    /**
     * Fallback if the browser doesn't support time
     *
     * @private
     */
    _time: function (label) {
        var item = _.find(this._times, function (item) {
            return item.label === label;
        });
        if (!item) {
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
    _timeEnd: function (label) {
        var item = _.find(this._times, function (item) {
            return item.label === label;
        });
        if (item) {
            var now = new Date().getTime();
            var diff = (now - item.time) / 1000;
            var index = this._times.indexOf(item);
            this._print(this._OUTPUT_DEBUG, item.label + ': ' + diff + 'ms');
            this._times.splice(index, 1);
        }
    },

    /**
     * Fallback if the browser doesn't support count
     *
     * @private
     */
    _count: function (label) {
        var item = _.find(this._counts, function (item) {
            return item.label === label;
        });
        if (item === undefined) {
            this._counts.push({
                label: label,
                count: 1
            });
            item = _.last(this._counts);
        } else {
            item.count++;
        }

        this._print(this._OUTPUT_DEBUG, item.label + ': ' + item.count);
    },

    /**
     * Prevent a print() call if the tag is not defined in filter.
     *
     * @param tag {String/Array}
     * @returns {boolean}
     * @private
     */
    _preventOutputByTag: function (tag) {
        if (this.filter.length > 0 && this.filter.indexOf(this.TAG_EMPTY) === -1) {
            if (_.isString(tag)) {
                if (this.filter.indexOf(tag) === -1) {
                    return YES;
                }
            } else if (_.isArray(tag)) {
                if (_.difference(tag, this.filter).length === tag.length) {
                    return YES;
                }
            }
        }
        return NO;
    }

});