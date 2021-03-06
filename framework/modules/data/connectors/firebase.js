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

M.DataConnectorFirebase = M.DataConnector.extend({

    _type: 'M.DataConnectorFirebase',

    _initialized: false,

    _callback: null,

    /**
     * Default configuration
     */
    config: {
        name: 'https://mway.firebaseIO.com/the-m-project',
        version: '1.0',
        tables: []
    },

    _init: function( obj, callback ) {
        if( !this._callback ) {
            this._callback = callback;
        }
        var that = this;
        this._initialized = true;

        this.openDb({
            error: function( msg ) {
                M.Logger.error(msg);
            },
            success: function() {
                that._callback(obj, callback);
            }
        });
    },

    save: function( obj ) {
        if( !this._initialized ) {
            this._init(obj, this.insertOrReplace);
        } else {
            this.insertOrReplace(obj);
        }
    },

    del: function( obj ) {
        if( !this._initialized ) {
            this._init(obj, this.delete);
        } else {
            this.delete(obj);
        }
    },

    drop: function( obj ) {

        if( !this._initialized ) {
            this._init(obj, this.dropTable);
        } else {
            this.dropTable(obj);
        }
    },

    openDb: function( obj ) {
        var that = this;
        var error;
        if( !this.db ) {
            try {
                this.db = new Firebase(this.config.name);
                // initialize all tables
                var tables = this.getTableNames();
                _.each(tables, function(name) {
                    that.createTable({ table: name});
                });
            } catch( e ) {
                error = M.Error.create(M.CONST.ERROR.WEBSQL_DATABASE, e.message, e);
            }
        }
        if( this.db ) {
            this.handleSuccess(obj, this.db);
        } else {
            error = error || M.Error.create(M.CONST.ERROR.WEBSQL_DATABASE, "failed opening database");
            this.handleError(obj, error);
        }
    },

    dropTable: function( obj ) {
        var that = this;

        var table = this.getTable(obj);

        if (this._checkTable(table, obj)) {

            if (table.ref) {
                table.ref.off(); // remove all bindings
                table.ref = null;
            }

            if (table.collection) {
                table.collection.clear();
                table.collection = null;
            }

            var onComplete = function(error) {
                if (error) {
                    var err = M.Error.create(M.CONST.ERROR.WEBSQL_SYNTAX, 'Remove failed.');
                    that.handleError(obj, err);
                } else {
                    that.handleSuccess(obj);
                }
            };

            if (this._checkDb(obj)) {
                try {
                    var dbTable = this.db.child(table.name);
                    dbTable.remove(onComplete);
                } catch(e) {
                    var err = M.Error.create(M.CONST.ERROR.WEBSQL_DATABASE, e.message, e);
                    that.handleError(obj, err);
                }
            }
        }
    },

    createTable: function( obj ) {
        // get table
        var table = this.getTable(obj);

        if (this.db && this._checkTable(obj, table)) {
            try {
                if (!table.ref) {
                    this._bindTable(table, this.db.child(table.name))
                }
                this.handleSuccess(obj);
            } catch(e) {
                var err = M.Error.create(M.CONST.ERROR.WEBSQL_DATABASE, e.message, e);
                this.handleError(obj, err);
            }
        }
    },

    _bindTable: function(table, ref) {
        var that = this;
        var store = this.getCollection(table);
        table.ref = ref;

        table._asRecord = function (snapshot) {
            if (snapshot) {
                var name = snapshot.name();
                var data = snapshot.val();
                var record = that.createRecord(data, this);
                record.setId(name);
                return record;
            }
        };

        table.onChildAdded = function(snapshot, prevChildName) {
            store.add(this._asRecord(snapshot));
        };

        table.onChildChanged = function(snapshot, oldName) {
            store.set(this._asRecord(snapshot));
        };

        table.onChildRemoved = function(snapshot) {
            store.remove(snapshot.name());
        };

        table.onChildMoved = function(snapshot, oldName) {
            store.changeKey(oldName, snapshot.getName());
        };

        table.onCancel = function () { };

        table.ref.on( 'child_added',   table.onChildAdded,   table.onCancel, table);
        table.ref.on( 'child_changed', table.onChildChanged, table.onCancel, table);
        table.ref.on( 'child_removed', table.onChildRemoved, table.onCancel, table);
        table.ref.on( 'child_moved',   table.onChildMoved,   table.onCancel, table);
    },

    insertOrReplace: function(obj) {
        var that = this;
        // get data
        var records = this.getRecords(obj);
        // get table
        var table = this.getTable(obj);

        var count = records.length;
        var onComplete = function(error) {
            if (--count <= 0) {
                if (error) {
                    var err = M.Error.create(M.CONST.ERROR.WEBSQL_SYNTAX, 'Update failed.');
                    that.handleError(obj, err);
                } else {
                    that.handleSuccess(obj);
                }
            }
        };

        if (this._checkDb(obj) && this._checkTable(obj, table) && this._checkData(obj, records)) {
            _.each(records, function(record) {
                var value = that.fromRecord(record, table);
                var key   = record.getId();
                try {
                    if (key) {
                        table.ref.child(key).set(value, onComplete);
                    } else {
                        table.ref.push(value, onComplete );
                    }
                } catch(e) {
                    var err = M.Error.create(M.CONST.ERROR.WEBSQL_DATABASE, e.message, e);
                    that.handleError(obj, err);
                }
            });
        }
    },

    delete: function(obj) {
        var that = this;
        // get records
        var records  = this.getRecords(obj);
        // get table
        var table = this.getTable(obj);

        var count = records.length;
        var onComplete = function(error) {
            if (--count <= 0) {
                if (error) {
                    var err = M.Error.create(M.CONST.ERROR.WEBSQL_SYNTAX, 'Delete failed.');
                    that.handleError(obj, err);
                } else {
                    that.handleSuccess(obj);
                }
            }
        };

        if (this._checkDb(obj) && this._checkTable(obj, table)) {
            try {
                if (records && records.length > 0) {
                    _.each(records, function(record) {
                        table.ref.child(record.getId()).remove(onComplete);
                    });
                } else {
                    // delete all
                    table.ref.remove(onComplete);
                }
            } catch(e) {
                var err = M.Error.create(M.CONST.ERROR.WEBSQL_DATABASE, e.message, e);
                that.handleError(obj, err);
            }
        }
    },

    getCollection: function(table) {
        if ( _.isObject(table) ) {
            // if table is given, we cache the data
            if (!table.collection) {
                table.collection = M.Collection.create(table.model);
            }
            return table.collection;
        }
    },

    _checkDb: function(obj) {
        // has to be initialized first
        if( !this.db ) {
            var err = M.Error.create(M.CONST.ERROR.WEBSQL_NO_DBHANDLER, "db handler not initialized.");
            this.handleError(obj, err);
            return false;
        }
        return true;
    }

});
