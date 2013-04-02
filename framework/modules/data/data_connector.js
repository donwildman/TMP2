M.DataConnector = M.Object.extend({

    _type: 'M.DataConnector',

    _tables: null,

    config: null,

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
                _.extend(table.fields, obj.model.getFields());
            }
            if (obj.fields) {
                this._mergeFields(table.fields, obj.fields);
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
        _.each(fields, function(value, key) {
            if (value.persistent === NO) {
                delete fields[key];
            }
            // add missing names
            else if (!value.name) {
                value.name = key;
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
        } else if (obj.model) {
            table = _.find(this._tables, function(t) {
                return t.model ? obj.model.getName() === t.model.getName() : t.name === obj.model.getName();
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

    getField: function(table, name) {
        var field;
        var table = table.fields ? table : this.getTable(table);
        if (table && table.fields && name) {
            field = table.fields[name];
        }
        return field;
    },

    getData: function(obj) {
        var data;
        if (obj.data) {
            data = obj.data;
        } else if (obj.model) {
            data = obj.model.getRecord();
        }
        return data;
    },

    getCollection: function(table) {
        if ( _.isObject(table) ) {
            // if table is given, we cache the data
            if (!table.collection) {
                table.collection = M.Collection.create();
            }
            return table.collection;
        } else {
            return M.Collection.create();
        }
    },

    clear: function() {
        _.each(this.getTables(), function(table) {
            delete table.collection;
        });
    },

    fromRecordValue: function(value, field) {
        if (field) {
            var type = typeof value;
            if (type === 'undefined') {
              return field.default;
            } if( field.type === M.CONST.TYPE.STRING || field.type === M.CONST.TYPE.TEXT) {
                return ""+value;
            } else if( field.type === M.CONST.TYPE.INTEGER) {
                return parseInt(value);
            } else if( field.type === M.CONST.TYPE.BOOLEAN) {
                return value == true || value === 'true'; // true, 1, "1" or "true"
            } else if( field.type === M.CONST.TYPE.FLOAT) {
                return parseFloat(value);
            } else if( field.type === M.CONST.TYPE.OBJECT || field.type === M.CONST.TYPE.DATE) {
                try {
                    return value ? JSON.stringify(value) : '';
                } catch(e) {
                    M.Logger.error(e.message);
                    return;
                }
            }
        }
        return value;
    },

    toRecordValue: function(value, field) {
        if (field) {
            var type = typeof value;
            if (type === 'undefined') {
              return field.default;
            } else if( field.type === M.CONST.TYPE.OBJECT) {
                return type === 'string' ? JSON.parse(value) : null;
            } else if (field.type === M.CONST.TYPE.DATE) {
                var date = value ? M.Date.create(value) : null;
                return date && date.isValid() ? date : null;
            } else {
                return this.fromRecordValue(value, field);
            }
        }
        return value;
    },

    toRecord: function(data, fields) {
        var record = {};
        var that = this;
        _.each(fields, function(field, key) {
            var value = that.toRecordValue(data[field.name], field);
            if( typeof(value) !== 'undefined' ) {
                record[key] = value;
            }
        });
        return record;
    },

    fromRecord: function(record, fields) {
        var data = {};
        var that = this;
        _.each(fields, function(field, key) {
            var value = that.fromRecordValue(record[key], field);
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
            var records    = M.Collection.create();
            var count      = collection.getCount();
            for (var i=0; i<count; i++) {
                records.add(this.toRecord(collection.getAt(i), this.getFields(table)));
            }
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
        // get data
        var data  = this.getData(obj);
        // get table
        var table = this.getTable(obj);

        var collection = this.getCollection(table);
        if (this._checkTable(obj, table) && this._checkData(obj, data)) {
            collection.add(this.fromRecord(data, this.getFields(table)));
        }

        this.handleCallback(obj.onSuccess);
        this.handleCallback(obj.onFinish);
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
        if(typeof data !== 'object' ) {
            var error = M.Error.create(M.CONST.ERROR.VALIDATION_PRESENCE, "No data passed.");
            this.handleCallback(obj.onError, error);
            this.handleCallback(obj.onFinish, error);
            return false;
        }
        return true;
    }

});