// ==========================================================================
// Project:   The M-Project - Mobile HTML5 Application Framework
// Copyright: (c) 2013 M-Way Solutions GmbH. All rights reserved.
//            (c) 2013 panacoda GmbH. All rights reserved.
// Creator:   Frank
// Date:      02.04.2013
// License:   Dual licensed under the MIT or GPL Version 2 licenses.
//            http://github.com/mwaylabs/The-M-Project/blob/master/MIT-LICENSE
//            http://github.com/mwaylabs/The-M-Project/blob/master/GPL-LICENSE
// ==========================================================================

M.DataConnector = M.Object.extend({

    _type: 'M.DataConnector',

    _tables: null,

    config: null,

    typeMap: {
        'object':  'text',
        'array':   'text',
        'binary':  'text',
        'date':    'string'
    },

    create: function(obj) {
        var connector = this.extend(obj);
        connector.configure(obj.config);
        return connector;
    },

    // initialize from configuration
    configure: function (config) {
        this._tables = {};
        var that = this;
        if (config) {
            this._name = config.name;
            // merge table fields
            if (config.tables) {
                _.each(config.tables, function(table, name) {
                    if( _.isObject(table)) {
                        that.addTable({
                            name: name,
                            model: table.model,
                            fields: table.fields,
                            key: table.key }
                        );
                    }
                });
            }
        }
    },

    addTable: function(obj) {
        if (!obj.name && obj.model) {
            obj.name = obj.model.getName();
        }
        if (!obj.key && obj.model) {
            obj.key = obj.model.getKey();
        }
        var table;
        if (obj.name) {
            table  = { name: obj.name, model: obj.model, fields: {} };
            if (obj.model) {
                this._mergeFields(table.fields, obj.model.getFields());
            }
            if (obj.fields) {
                var fields = {};
                _.each(obj.fields, function(def, name) {
                    fields[name] = M.DataField.extend(def);
                });
                this._mergeFields(table.fields, obj.fields);
            }
            if (!obj.model) {
                // create dynamic model
                table.model = M.Model.extend({ config: { name: name, id: table.id, fields: table.fields } } );
            }
            this._updateFields(table.fields);
            table.key = obj.key;
            this._tables[obj.name] = table;
        }
        return table;
    },

    _mergeFields: function(fields1, fields2) {
        if (fields1 && fields2) {
            _.each(fields2, function(value, key) {
                if (!fields1[key]) {
                    fields1[key] = {};
                }
                _.extend(fields1[key], value);
            });
        }
    },

    _updateFields: function(fields) {
        var that = this;
        _.each(fields, function(value, key) {
            if (value.persistent === NO) {
                delete fields[key];
            }
            else {
                // add missing names
                if (!value.name) {
                    value.name = key;
                }
                // apply default type conversions
                if (that.typeMap[value.type]) {
                    value.type = that.typeMap[value.type];
                }
            }
        });
    },

    getTables: function() {
        return this._tables || {};
    },

    getTableNames: function() {
        return _.keys(this._tables);
    },

    getTable: function(obj) {
        var table = null;
        if (obj.table) {
            table = this._tables[obj.table];
        } else if (obj.data && _.isFunction(obj.data.getName)) {
            var name = obj.data.getName();
            table = _.find(this._tables, function(t) {
                return t.model ? name === t.model.getName() : name === t.name;
            });
        }
        return table;
    },

    getKey: function( table ) {
        if( table) {
            return table.key
        }
    },

    getKeys: function( table ) {
        var keys = [];
        if( table && table.key ) {
            if( typeof table.key === 'string' ) {
                var key, array = table.key.split(",");
                for( var i = 0, l = array.length; i < l; ++i ) {
                    key = array[i].trim();
                    if( key ) {
                        keys.push(key);
                    }
                }
            }
        }
        return keys;
    },

    getFields: function(table) {
        return table ? table.fields : {};
    },

    getModel: function(table) {
        return table ? table.model : null;
    },

    getField: function(table, name) {
        return this.getFields(table)[name];
    },

    getData: function(obj) {
        if (obj && obj.data) {
            return _.isFunction(obj.data.getData) ? obj.data.getData() : obj.data;
        } else if (obj && _.isFunction(obj.getData)) {
            return obj.getData();
        }
    },

    getRecords: function(obj) {
        var records = [];
        var data  = obj && obj.data ? obj.data : null;
        var table = this.getTable(obj);
        var model = this.getModel(table);
        if ( _.isObject(data)) {
            data = _.isArray(data) ? data : [ data ];
            _.each(data, function(rec) {
                if (M.Model.isPrototypeOf(rec)) {
                    records.push(rec);
                } else if (model && _.isObject(data)) {
                    records.push(model.createRecord(rec));
                }
            });
        }
        return records;
    },

    getCollection: function(table) {
        var model = this.getModel(table);
        if (model) {
            // if table is given, we cache the data
            if (!table.collection) {
                table.collection = M.Collection.create(model);
            }
            return table.collection;
        }
    },

    clear: function(table) {
        if (table) {
            delete table.collection;
        } else {
            _.each(this.getTables(), function(table) {
                delete table.collection;
            });
        }
    },

    createRecord: function(data, table) {
        var model  = this.getModel(table);
        if (model) {
            // map field names
            var record = {};
            var fields = this.getFields(table);
            _.each(fields, function(field, key) {
                record[key] = data[field.name];
            });
            return model.createRecord(record);
        }
    },

    fromRecord: function(record, table) {
        var that = this;
        var fields = this.getFields(table);
        var data = {};
        var rec  = _.isFunction(record.getData) ? record.getData() : record;
        _.each(fields, function(field, key) {
            var value = field.transform(rec[key]);
            if( typeof(value) !== 'undefined' ) {
                data[field.name] = value;
            }
        });
        return data;
    },

    // jugglingdb:
    // {where: {userId: user.id}, order: 'id', limit: 10, skip: 20}
    // {where: {published: true}, order: 'date DESC'}

    // mongodb:
    // .find( <query>, <projection> )
    //

    find: function(obj) {

        // get table
        var table = this.getTable(obj);

        if (this._checkTable(obj, table)) {
            // map internal collection to records
            var collection = this.getCollection(table);
            var records    = collection.find(obj);
            this.handleCallback(obj.onSuccess, records);
            this.handleCallback(obj.onFinish,  records);
        }
    },

    /***
     *
     * @param obj { data: array of model, onSuccess: success callback, onError: error callback, onFinish:   }
     * @return {*}
     */
    save: function(obj) {

        // get array
        var array  = _.isArray(obj.data) ? obj.data : (_.isObject(obj.data) ? [ obj.data ] : null);

        // get table
        var table = this.getTable(obj);

        if (this._checkTable(obj, table) && this._checkData(obj, array)) {
            var collection = this.getCollection(table);
            _.each(array, function(item) {
                record = M.Model.isPrototypeOf(item) ? item : that.createRecord(item);
                collection.set(record);
            });
            this.handleCallback(obj.onSuccess);
            this.handleCallback(obj.onFinish);
        }
    },

    _checkTable: function(obj, table) {
        if( !table ) {
            var error = M.Error.create(M.CONST.ERROR.VALIDATION_PRESENCE, "No valid table passed.");
            this.handleCallback(obj.onError, error);
            this.handleCallback(obj.onFinish, error);
            return false;
        }
        return true;
    },

    _checkData: function(obj, data) {
        if( (!_.isArray(data) || data.length == 0) && !_.isObject(data) ) {
            var error = M.Error.create(M.CONST.ERROR.VALIDATION_PRESENCE, "No data passed.");
            this.handleCallback(obj.onError, error);
            this.handleCallback(obj.onFinish, error);
            return false;
        }
        return true;
    }

});