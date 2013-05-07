// ==========================================================================
// Project:   The M-Project - Mobile HTML5 Application Framework
// Copyright: (c) 2013 M-Way Solutions GmbH. All rights reserved.
//            (c) 2013 panacoda GmbH. All rights reserved.
// Creator:   Dominik
// Date:      07.05.2013
// License:   Dual licensed under the MIT or GPL Version 2 licenses.
//            http://github.com/mwaylabs/The-M-Project/blob/master/MIT-LICENSE
//            http://github.com/mwaylabs/The-M-Project/blob/master/GPL-LICENSE
// ==========================================================================

/**
 * @class
 * @extends M.Object
 */
M.Application = M.Object.extend(/** @scope M.Application.prototype */{

    /**
     * The type of this object.
     *
     * @type String
     */
    type: 'M.Application',

    /**
     * This property contains the application-specific configurations. It is automatically set by Espresso
     * during the init process of an application. To access these properties within the application, use the
     * getConfig() method of M.Application.
     */
    config: null,

    /**
     * M.Application's _init method.
     *
     * @private
     */
    _init: function() {
        this.config = this.config || {};
    },

    /**
     * This method is called automatically once the application is launched. This
     * basic implementation throws an exception to indicate, that it has to be
     * implemented within an application.
     */
    start: function() {
        throw M.Exception.APPLICATION_START_NOT_DEFINED.getException();
    },

    /**
     * This method returns the value of a config parameter specified in the config.json
     * of an application.
     *
     * @param key
     * @returns {*}
     */
    getConfig: function( key ) {
        if( key && this.config.hasOwnProperty(key) ) {
            return this.config[key];
        }
        return null;
    }

});