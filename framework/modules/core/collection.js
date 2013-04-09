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

M.Collection = M.Object.extend({

    _type: 'M.Collection',

    _model: null,
    
    _records: null,

    create: function(model) {

        var collection = this.extend({
            _model: model,
            _records: []            
        });
        return collection;
    },

    add: function(record) {
        if ( M.Model.isPrototypeOf(record)) {
            this._records.push(record);
        } else if ( _.isObject(record) && this._model) {
            this._records.push(this._model.createRecord(record));
        }
    },

    indexOf: function(item) {
        var id = M.Model.isPrototypeOf(item) ? item.getId() : item;
        return _.indexOf(this._records, function(model) {
             return model.getId() == id;
        });
    },

    remove: function(item) {
        var id = M.Model.isPrototypeOf(item) ? item.getId() : item;
        this._records = _.reject(this._records, function(record) {
             return record.getId() == id;
        });
    },

    changeKey: function(oldKey, newKey) {
        var record = this.get(oldKey);
        if (record) {
            record.setId(newKey);
        }
    },

    getAt: function(index) {
        return this._records[index];
    },

    get: function(item) {
        var id = M.Model.isPrototypeOf(item) ? item.getId() : item;
        return _.find(this._records, function(record) {
             return record.getId() == id;
        });
    },

    set: function(record) {
        var index = this.indexOf(record);
        if (index >= 0) {
            this._records[index] = record;
        } else {
            this._records.push(record);
        }
    },

    find: function(obj) {
        if (obj && (obj.id || obj.where)) {
            var collect = M.Collection.create(this._model);
            var records = records || this._records;
            _.each(records, function(record) {
                if (!id || record.getId() === id) {
                    if (!where || that.matches(record.getData(), where)) {
                        collect.add(record);
                    }
                }
            });
            return collect;
        } else {
            return this;
        }
    },

    clear: function() {
        this._records = [];
    },

    getCount: function() {
        return this._records.length;
    },

    getRecords: function() {
        return this._records;
    },

    getData: function(records, id, where) {
        records = records || this._records;
        var data = [];
        _.each(records, function(record) {
            if (!id || record.getId() === id) {
                var rec = record.getData();
                if (!where || that.matches(rec, where)) {
                    data.push(rec);
                }
            }
        });
        return data;
    },

    matches: function(where) {
        return _.every(r, function(val, key) {
            return val === where[key];
        });
    }

});