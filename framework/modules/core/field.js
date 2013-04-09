
M.DataField = M.Object.extend( /** @scope M.Model.prototype */ {

    /**
     * The type of this object.
     *
     * @type String
     */
    _type: 'M.DataField',

    name: null,

    type: null,

    default: undefined,

    length: null,

    required: NO,

    persistent: YES,

    create: function(obj) {
        var field = this.extend(obj);
        return field;
    },

    transform: function(value) {
        try {
            if ( _.isUndefined(value)) {
              return this.default;
            } if( this.type === M.CONST.TYPE.STRING || this.type === M.CONST.TYPE.TEXT) {
                if ( _.isObject(value) ) {
                    return _.isFunction(value.toJSON) ? value.toJSON() : JSON.stringify(value);
                } else {
                    return _.isNull(value) ? 'null' : value.toString();
                }
            } else if( this.type === M.CONST.TYPE.INTEGER) {
                return parseInt(value);
            } else if( this.type === M.CONST.TYPE.BOOLEAN) {
                return value == true || value === 'true'; // true, 1, "1" or "true"
            } else if( this.type === M.CONST.TYPE.FLOAT) {
                return parseFloat(value);
            } else if( this.type === M.CONST.TYPE.OBJECT) {
                if (!_.isObject(value)) {
                    return _.isString(value) ? JSON.parse(value) : null;
                }
            } else if (this.type === M.CONST.TYPE.DATE) {
                if ( !M.Date.isPrototypeOf(value)) {
                    var date = value ? M.Date.create(value) : null;
                    return date && date.isValid() ? date : null;
                }
            }
            return value;
        } catch (e) {
            M.Logger.error('Failed converting value! ' + e.message);
        }
    }
});