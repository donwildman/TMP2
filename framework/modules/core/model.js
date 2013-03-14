
M.Model = M.Object.extend( /** @scope M.Model.prototype */ {

    /**
     * The type of this object.
     *
     * @type String
     */
    type: 'M.Model',

    _record: null,
    _fields: null,
    _dataProvider: null,

    create: function(obj) {
        var model = this.extend({
            _record: {},
            _fields: {}
        });

        model._name = obj.config.name;

        _.each(obj, function(prop, key) {
            if( _.isFunction(prop)) {
                model[key] = prop;
            }
        });

        _.each(obj.config.fields, function(def, name) {
            model._fields[name] = def;
        });

        return model;
    },

    createRecord: function(obj) {
        var that = this;
        var rec = this.extend();

        /* add data to the record property */
        rec._setRecord(obj);


        _.each(this.getRecord(), function(rec, name) {
            if(!_.has(this.getFields(), name)) {
                that._deleteFromRecord(name);
                console.warn('Deleting "' + name + '" property. It\'s not part of ' + that.name + ' definition.');
            }
        });

        return rec;
    },

    get: function(propName) {
        return this._record[propName];
    },

    set: function(propName, value) {
        this._record[propName, value];
    },

    /**
     * Returns the blank meta data fields object (contains fields information)
     *
     * @returns {Object} _record The meta data object of a model record
     */
    getFields: function() {
        return this._fields;
    },

    /**
     * Returns the blank data record, that is just a plain old JS object
     *
     * @returns {Object} _record The data object of a model record
     */
    getRecord: function() {
        return this._record;
    },

    _setFields: function(fieldsDefinition) {
        this._fields = fieldsDefinition;
    },

    _setRecord: function(rec) {
        this._record = rec;
    },

    _deleteFromRecord: function(propName) {
        delete this._record[propName];
    }
})