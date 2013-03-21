M.Exception = M.Object.extend(/** @scope M.Object.prototype */ {

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