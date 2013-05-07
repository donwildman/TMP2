// ==========================================================================
// Project:   The M-Project - Mobile HTML5 Application Framework
// Copyright: (c) 2013 M-Way Solutions GmbH. All rights reserved.
//            (c) 2013 panacoda GmbH. All rights reserved.
// Creator:   Dominik
// Date:      20.02.2013
// License:   Dual licensed under the MIT or GPL Version 2 licenses.
//            http://github.com/mwaylabs/The-M-Project/blob/master/MIT-LICENSE
//            http://github.com/mwaylabs/The-M-Project/blob/master/GPL-LICENSE
// ==========================================================================

/**
 * @class
 * @extends M.Object
 */
M.Exception = M.Object.extend(/** @scope M.Exception.prototype */{

    /**
     * The type of this object.
     *
     * @type String
     */
    _type: 'M.Exception',

    /**
     * The message of the exception (defined by the concrete instance).
     *
     * @type String
     */
    message: '',

    /**
     * The name of the exception (defined by the concrete instance).
     *
     * @type String
     */
    name: '',

    /**
     * Return the exception object to be thrown by the application.
     */
    getException: function() {
        var that = this;
        return {
            message: this.message,
            name: this.name,
            toString: function() {
                return that._type + '.' + that.name;
            }
        }
    }
});

M.Exception.INVALID_INPUT_PARAMETER = M.Exception.extend(/** @scope M.Exception.prototype */{
    message: 'At least one input parameter doesn\'t match the expected criteria.',
    name: 'INVALID_INPUT_PARAMETER'
});

M.Exception.RESERVED_WORD = M.Exception.extend(/** @scope M.Exception.prototype */{
    message: 'Usage of a reserved word.',
    name: 'RESERVED_WORD'
});

M.Exception.CORRUPT_VIEW_OBJECT_PASSED = M.Exception.extend(/** @scope M.Exception.prototype */{
    message: 'A corrupt view object was passed. Necessary methods and functionality is not available.',
    name: 'CORRUPT_VIEW_OBJECT_PASSED'
});

M.Exception.APPLICATION_START_NOT_DEFINED = M.Exception.extend(/** @scope M.Exception.prototype */{
    message: 'The application does not specify a valid start method.',
    name: 'APPLICATION_START_NOT_DEFINED'
});