
M.Model = M.Object.extend( /** @scope M.Model.prototype */ {

    /**
     * The type of this object.
     *
     * @type String
     */
    _type: 'M.Model',

    deleteUnknownFields: YES,

    _id:   '',
    _name: '',
    _key:  '',
    _data: null,
    _fields: null,
    _connector: null,

    create: function(obj) {
        var model = this.extend({
            _data: {},
            _fields: {}
        });

        _.each(obj, function(prop, key) {
            if( _.isFunction(prop)) {
                model[key] = prop;
            }
        });

        if (obj.config) {
            model._name = obj.config.name;
            model._key  = obj.config.key;
            model._setFields(obj.config.fields);
        }

        return model;
    },

    createRecord: function(obj) {
        var that = this;
        var rec = this.extend();

        /* add data to the record property */
        rec.setData(obj);

        return rec;
    },

    get: function(propName) {
        var value = this._data[propName];
        if (typeof value === 'undefined' && this._fields[propName]) {
            return this._fields[propName].default;
        }
        return value;
    },

    set: function(propName, value) {
        this._data[propName, value];
    },

    /**
     * Returns the key of the model
     *
     * @returns {String} _key the key of the model
     */
    getKey: function() {
        return this._key;
    },

    /**
     * Returns an array of keys of the model
     *
     * @returns {String} _key the key of the model
     */
    getKeys: function() {
         var keys = [];
         if( _.isString(this._key) ) {
             _.each(this._key.split(","), function(key) {
                 key = key.trim();
                 if( key ) {
                     keys.push(key);
                 }
             });
         }
         return keys;
    },

    /**
     * Returns the key of the model
     *
     * @returns {String} _key the key of the model
     */
    getId: function() {
        return this._id;
    },

    setId: function(id) {
        this._id = id;
    },

    /**
     * Returns the name of the model
     *
     * @returns {String} _name the name of the model
     */
    getName: function() {
        return this._name;
    },

    /**
     * Returns the blank meta data fields object (contains fields information)
     *
     * @returns {Object} _data The meta data object of a model record
     */
    getFields: function() {
        return this._fields;
    },

    /**
     * Returns the blank data record, that is just a plain old JS object
     *
     * @returns {Object} _data The data object of a model record
     */
    getData: function() {
        return this._data;
    },

    setData: function(data) {
        var that   = this;
        var fields = this.getFields();
        var val    = {};
        _.each(data, function(rec, name) {
            if (_.has(fields, name )) {
                val[name] = fields[name].transform(data[name]);
            } else {
                console.warn('Deleting "' + name + '" property. It\'s not part of ' + that.name + ' definition.');
            }
        });
        this._data = val;
        this._id   = this._buildId(val) || this._id || this.getUniqueId();
    },

    getUniqueId: function() {
         return M.UniqueId.uuid();
    },

    _buildId: function(data) {
        var ids = [];
        _.each(this.getKeys(), function(key) {
            if (!_.isUndefined(data[key])) {
                ids.push(data[key].toString());
            }
        });
        return ids.join('_');
    },

    _setFields: function(fieldsDefinition) {
        var that = this;
        _.each(fieldsDefinition, function(def, name) {
            def.name = name;
            that._fields[name] = M.DataField.extend(def);
        });
    },

    _deleteFromData: function(propName) {
        delete this._data[propName];
    }
});