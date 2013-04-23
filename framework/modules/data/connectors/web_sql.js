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

M.DataConnectorWebSql = M.DataConnector.extend({

    _type: 'M.DataConnectorWebSql',

    _typeMapping: {
        'string':  'varchar(255)',
        'text':    'text',
        'object':  'text',
        'float':   'float',
        'integer': 'integer',
        'date':    'varchar(255)',
        'boolean': 'boolean'
    },

    _transactionFailed: false,

    _initialized: false,

    _callback: null,

    /**
     * Default configuration
     */
    config: {
        name: 'The-M-Project',
        version: '1.0',
        size: 1024 * 1024 * 5,
        tables: []
    },

    /**
     * Opens a database and creates the appropriate table for the model record.
     *
     * @param {Object} obj The param obj, includes model. Not used here, just passed through.
     * @param {Function} callback The function that called init as callback bind to this.
     * @private
     */
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

    update: function( obj ) {
        if( !this._initialized ) {
            this._init(obj, this.updateOrReplace);
        } else {
            this.updateOrReplace(obj);
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

    find: function( obj ) {
        if( !this._initialized ) {
            this._init(obj, this.select);
        } else {
            this.select(obj);
        }
    },

    execute: function(obj) {
        if( !this._initialized ) {
            this._init(obj, this.executeSql);
        } else {
            this.executeSql(obj);
        }
    },

    executeSql: function(obj) {
        if (obj.sql) {
            this.executeTransaction(obj, [obj.sql]);
        }
    },

    executeTransaction: function(obj, statements ) {
        var error;
        var lastStatement;
        if( this._checkDb(obj) ) {
            var that = this;
            try {
                /* transaction has 3 parameters: the transaction callback, the error callback and the success callback */
                this.db.transaction(function( t ) {
                    _.each(statements, function( stm ) {
                        var statement = stm.statement || stm;
                        var arguments = stm.arguments;
                        lastStatement = statement;
                        M.Logger.debug("SQL-Statement: " + statement);
                        t.executeSql(statement, arguments);
                    });
                }, function( sqlError ) { // errorCallback
                    that._transactionFailed = YES;
                    var err = M.Error.create(M.CONST.ERROR.WEBSQL_SYNTAX, sqlError);
                    that.handleError(obj, err, lastStatement);
                }, function() {
                    that.handleSuccess(obj);
                });
            } catch( e ) {
                error = M.Error.create(M.CONST.ERROR.WEBSQL_UNKNOWN, e.message, e);
            }
        }
        if( error ) {
            this.handleCallback(obj.error, error, lastSql);
        }
    },

    /**
     * @private
     */
    openDb: function( obj ) {
        var error, dbError;
        /* openDatabase(db_name, version, description, estimated_size, callback) */
        if( !this.db ) {
            try {
                if( !window.openDatabase ) {
                    error = M.Error.create(M.CONST.ERROR.WEBSQL_NOT_SUPPORTED, 'Your browser does not support WebSQL databases.');
                } else {
                    this.db = window.openDatabase(this.config.name, "", "", this.config.size);
                }
            } catch( e ) {
                dbError = e;
            }
        }
        if( this.db ) {
            if( this.config.version && this.db.version != this.config.version ) {
                this.updateDb(obj);
            } else {
                this.handleSuccess(obj, this.db);
            }
        } else if( dbError == 2 ) {
            // Version number mismatch.
            this.updateDb(obj);
        } else {
            if (!error && dbError) {
                error = M.Error.create(M.CONST.ERROR.WEBSQL_DATABASE, dbError.message, dbError);
            }
            this.handleSuccess(obj, error);
        }
    },

    updateDb: function( obj ) {
        var error;
        var lastSql;
        var that = this;
        try {
            var db = window.openDatabase(this.config.name, "", "", this.config.size);
            try {
                var arSql = this.buildSqlUpdateDatabase(db.version, this.config.version);
                db.changeVersion(db.version, this.config.version, function( tx ) {
                        _.each(arSql, function( sql ) {
                            M.Logger.debug("SQL-Statement: " + sql);
                            lastSql = sql;
                            tx.executeSql(sql);
                        });
                    }, function( msg ) {
                        var err = M.Error.create(M.CONST.ERROR.WEBSQL_SYNTAX, msg, arSql);
                        that.handleError(obj, err, lastSql);
                    }, function() {
                        that.handleSuccess(obj);
                    });
            } catch( e ) {
                error = M.Error.create(M.CONST.ERROR.WEBSQL_DATABASE, e.message, e);
                M.Logger.error('changeversion failed, DB-Version: '+db.version)
            }
        } catch( e ) {
            error = M.Error.create(M.CONST.ERROR.WEBSQL_DATABASE, e.message, e);
        }
        if( error ) {
            this.handleError(obj, error);
        }
    },

    createDb: function( obj ) {
        var error;
        var sql = [];
        if( !this.db ) {
            try {
                if( !window.openDatabase ) {
                    error = M.Error.create(M.CONST.ERROR.WEBSQL_NOT_SUPPORTED, 'Your browser does not support WebSQL databases.');
                } else {
                    this.db = window.openDatabase(this.config.name, "", "", this.config.size);
                }
            } catch( e ) {
                error = M.Error.create(M.CONST.ERROR.WEBSQL_UNKNOWN, e.message, e);
            }
        }
        if (!error && this._checkDb()) {
            var tables = this.getTables();
            if( tables ) {
                for( var name in tables ) {
                    var table = tables[name];
                    sql.push(this.buildSqlDropTable(name));
                    sql.push(this.buildSqlCreateTable(table));
                }
            }
            this.executeTransaction( obj, sql);
        }
        if(error) {
            return this.handleError(obj, error);
        }
    },

    dropTable: function( obj ) {

        var table = this.getTable(obj);

        if (this._checkDb(obj) && this._checkTable(table, obj)) {
            var sql = this.buildSqlDropTable(table.name);
            // reset flag
            this._transactionFailed = NO;
            this.executeTransaction(obj, [sql]);
        }
    },

    createTable: function( obj ) {

        var table = this.getTable(obj);

        if (this._checkDb(obj) && this._checkTable(table, obj)) {
            var sql = this.buildSqlCreateTable(table);
            // reset flag
            this._transactionFailed = NO;
            this.executeTransaction(obj, [sql]);
        }
    },


    /**
     *
     * @param {obj} obj
     * @param {Array} data
     * @param {Number} transactionSize
     */
    insertOrReplace: function( obj ) {

        // get data
        var data  = this.getData(obj);
        // get table
        var table = this.getTable(obj);

        if (this._checkDb(obj) && this._checkTable(obj, table) && this._checkData(obj, data)) {

            data  = _.isArray(data) ? data : [ data ];
            var statements  = [];
            var sqlTemplate = "INSERT OR REPLACE INTO '" + table.name + "' (";
            for( var i = 0; i < data.length; i++ ) {
                var statement = ''; // the actual sql insert string with values
                var value = this.fromRecord(data[i], table);
                var args  = _.values(value);
                var keys  = _.keys  (value);
                if (args.length > 0) {
                    var values  = new Array(args.length).join('?,')+'?';
                    var columns = "'" + keys.join("','") + "'";
                    statement += sqlTemplate + columns + ') VALUES (' + values + ');';
                    statements.push( { statement: statement, arguments: args } );
                }
            }
            // reset flag
            this._transactionFailed = NO;
            this.executeTransaction(obj, statements);
        }
    },

    updateOrReplace: function( obj ) {
        // get data
        var data  = this.getData(obj);
        // get table
        var table = this.getTable(obj);

        if (this._checkDb(obj) && this._checkTable(obj, table) && this._checkData(obj, data)) {

            data  = _.isArray(data) ? data : [ data ];
            var where = buildWhere(obj);
            var statements  = [];
            var sqlTemplate = "UPDATE OR REPLACE '" + table.name + "' SET";
            for( var i = 0; i < data.length; i++ ) {
                var statement = ''; // the actual sql insert string with values
                var value = this.fromRecord(data[i], table);
                var args  = _.values(value);
                var keys  = _.keys  (value);
                if (args.length > 0) {
                    var columns = "'" + keys.join("'=?,'") + "'=?";
                    statement += sqlTemplate + columns + where + ';';
                    statements.push( { statement: statement, arguments: args } );
                }
            }
            // reset flag
            this._transactionFailed = NO;
            this.executeTransaction(obj, statements);
        }
    },

    select: function( obj ) {

        var table = this.getTable(obj);

        if (this._checkDb(obj) && this._checkTable(obj, table)) {
            var lastStatement;
            var stm = this.buildSqlSelect(obj, table);

            var that   = this;
            var result = this.getCollection(table);
            result.clear();
            this.db.readTransaction(function( t ) {
                var statement = stm.statement || stm;
                var arguments = stm.arguments;
                lastStatement = statement;
                M.Logger.debug("SQL-Statement: " + statement);
                t.executeSql(statement, arguments, function( tx, res ) {
                    var len = res.rows.length;//, i;
                    for( var i = 0; i < len; i++ ) {
                        var item = res.rows.item(i);
                        result.add(that.createRecord(item, table));
                    }
                }, function() {
                    // M.Logger.log('Incorrect statement: ' + sql, M.ERR)
                }); // callbacks: SQLStatementErrorCallback
            }, function( sqlError ) { // errorCallback
                var err = M.Error.create(M.CONST.ERROR.WEBSQL_SYNTAX, sqlError);
                that.handleError(obj, err, lastStatement);
            }, function() { // voidCallback (success)
                that.handleSuccess(obj, result);
            });
        }
    },

    delete: function( obj ) {

        var table = this.getTable(obj);

        if (this._checkDb(obj) && this._checkTable(obj, table)) {
            var sql = this.buildSqlDelete(obj, table);
            // reset flag
            this._transactionFailed = NO;
            this.executeTransaction(obj, [sql]);
        }
    },

/*
    buildValue: function( column, value ) {
        if( column.type === 'String' || column.type === 'Text' || column.type === 'Date' ) {
            if( typeof(value) === "string" ) {
                value = value.replace(/"/g, '""'); // .replace(/;/g,',');
            }
            return '"' + value + '"';
        }
        return value;
    },
*/

    ///////////////////////////
    // Private helper functions

    _checkDb: function(obj) {
        // has to be initialized first
        if( !this.db ) {
            var error = M.Error.create(M.CONST.ERROR.WEBSQL_NO_DBHANDLER, "db handler not initialized.");
            this.handleError(obj, error);
            return false;
        }
        return true;
    },

    _checkTable: function(obj, table) {
        if( !table ) {
            var error = M.Error.create(M.CONST.ERROR.WEBSQL_SYNTAX, "No valid table passed.");
            this.handleError(obj, error);
            return false;
        }
        return true;
    },

    _checkData: function(obj, data) {
        /* if no data were passed execute error callback and pass it an error object */
        if( (!_.isArray(data) || data.length == 0) && !_.isObject(data) ) {
            var error = M.Error.create(M.CONST.ERROR.WEBSQL_BULK_NO_RECORDS, "No data passed.");
            this.handleError(obj, error);
            return false;
        }
        return true;
    },

    ///////////////////////////
    // Helpers, for building SQL syntax
    // SQL Builders

    buildSqlDelete: function(obj, table) {

        var sql = "DELETE FROM '" + table.name + "'";

        var where = obj.where || '';
/*
        // build where out of records
        if( !where && _.isArray(data) || _.isObject(data) ) {
            var records = _.isArray(obj.data) ? obj.data : [obj.data];
            var curRec = null;
            var keys = obj.key ? this.getKeys(obj) : this.getKeys(table);
            if( keys.length === 1 ) {
                var ids = '';
                for( var i = 1; i <= records.length; i++ ) {
                    curRec = records[i - 1];
                    var column = this.getField(table, keys[0]);
                    if( column ) {
                        var value = curRec[keys[0]];
                        if( typeof value !== 'undefined' ) {
                            ids += (ids ? ', ' : '') + this.buildValue(column, value);
                        }
                    }
                }
                if( ids ) {
                    where += keys[0] + ' IN (' + ids + ')';
                }
            } else {
                var ids = '';
                for( var i = 1; i <= records.length; i++ ) {
                    curRec = records[i - 1];
                    var id = '';
                    for( var k = 0; k < keys.length; k++ ) {
                        var column = this.getField(table, keys[k]);
                        if( column ) {
                            var value = curRec[keys[k]];
                            value = (typeof value !== 'undefined') ? this.buildValue(column, value) : "NULL";
                            id += (id ? ' AND ' : '') + keys[k] + '=' + value;
                        }
                    }
                    ids += (ids ? ' OR ' : '') + id;
                }
                if( ids ) {
                    where += ids;
                }
            }
        }
*/
        sql += where   ? ' WHERE ' + where : '';
        sql += obj.and ? ' AND ' + obj.and : '';

        return sql;
    },

    buildSqlWhere: function(obj, table) {
        var sql = '';
        if( _.isString(obj.where) ) {
            sql += ' WHERE ' + obj.where;
        } else  if ( _.isObject(obj.where) ) {

        }
        return sql;
    },

    buildSqlSelect: function(obj, table) {

        var sql = 'SELECT ';
        if( obj.fields ) {
            if( obj.fields.length > 1 ) {
                sql += obj.fields.join(', ');
            } else if( obj.fields.length == 1 ) {
                sql += obj.fields[0];
            }
        } else {
            sql += '*';
        }
        sql += " FROM '" + table.name + "'";

        if( obj.join ) {
            sql += ' JOIN ' + obj.join;
        }

        if( obj.leftJoin ) {
            sql += ' LEFT JOIN ' + obj.leftJoin;
        }

        var where = this.buildSqlWhere(obj);

        if( obj.order ) {
            sql += ' ORDER BY ' + obj.order;
        }

        if( obj.limit ) {
            sql += ' LIMIT ' + obj.limit;
        }

        if( obj.offset ) {
            sql += ' OFFSET ' + obj.offset;
        }
/*
        // now process constraint
        if( obj.constraint ) {

            var n = obj.constraint.statement.split("?").length - 1;
            //console.log('n: ' + n);
            // if parameters are passed we assign them to stmtParameters, the array that is passed for prepared statement substitution
            if( obj.constraint.parameters ) {

                if( n === obj.constraint.parameters.length ) { // length of parameters list must match number of ? in statement
                    sql += obj.constraint.statement;
                    stmtParameters = obj.constraint.parameters;
                } else {
                    M.Logger.log('Not enough parameters provided for statement: given: ' + obj.constraint.parameters.length + ' needed: ' + n, M.ERR);
                    return NO;
                }
//                * if no ? are in statement, we handle it as a non-prepared statement
//                * => developer needs to take care of it by himself regarding
//                * sql injection
            } else if( n === 0 ) {
                sql += obj.constraint.statement;
            }
        }

*/
        return sql;
    },

    buildSqlDropTable: function( name ) {
        var sql = "DROP TABLE IF EXISTS '" + name +"'";
        return sql;
    },

    buildSqlPrimaryKey: function( table, keys ) {
        if( keys && keys.length == 1 ) {
            var column = this.getField(table, keys[0]);
            if( column && column.type === M.CONST.TYPE.INTEGER ) {
                return keys[0] + ' INTEGER PRIMARY KEY ASC AUTOINCREMENT UNIQUE';
            } else {
                return keys[0] + ' PRIMARY KEY ASC UNIQUE';
            }
        }
        return '';
    },

    buildSqlConstraint: function( table, keys ) {
        if( keys && keys.length > 1 ) {
            return 'PRIMARY KEY (' + keys.join(',') + ') ON CONFLICT REPLACE';
        }
        return '';
    },

    buildSqlCreateTable: function( table ) {
        var that = this;
        var keys = this.getKeys(table);
        var primaryKey = keys.length === 1 ? this.buildSqlPrimaryKey(table, keys) : '';
        var constraint = keys.length > 1 ? this.buildSqlConstraint(table, keys) : (table.constraint || '');

        var columns = '';
        var fields  = this.getFields(table);
        _.each(fields, function(field) {
            // skip ID, it is defined manually above
            if(!primaryKey || field.name !== keys[0] ) {
            // only add valid types
                var attr = that.buildDbAttribute(field);
                if( attr ) {
                    columns += (columns ? ', ' : '') + attr;
                }
            }
        });

        var sql = "CREATE TABLE IF NOT EXISTS '" + table.name + "' (";
        sql += primaryKey ? primaryKey + ', ' : '';
        sql += columns;
        sql += constraint ? ', ' + constraint : '';
        sql += ');';
        return sql;
    },

    buildSqlUpdateDatabase: function( oldVersion, newVersion ) {
        // create sql array, simply drop and create the database
        var sql = [];
        var tables = this.getTables();
        if( tables ) {
            for( var name in tables ) {
                var table = tables[name];
                sql.push(this.buildSqlDropTable(name));
                sql.push(this.buildSqlCreateTable(table));
            }
        }
        return sql;
        // ToDo: check DB Metadata, and use alter table if possible
        // SELECT name, sql FROM sqlite_master where type = 'table'
        /*
         tx.executeSql('SELECT name, sql FROM sqlite_master WHERE type="table" AND name = "your_table_name";', [], function (tx, results) {
         var columnParts = results.rows.item(0).sql.replace(/^[^\(]+\(([^\)]+)\)/g, '$1').split(',');
         var columnNames = [];
         for(i in columnParts) {
         if(typeof columnParts[i] === 'string')
         columnNames.push(columnParts[i].split(" ")[0]);
         }
         console.log(columnNames);
         ///// Your code which uses the columnNames;
         });
         */
    },

    /**
     * @private
     * Creates the column definitions from the meta data of the table
     * @param {Object}
     * @returns {String} The string used for db create to represent this property.
     */
    buildDbAttribute: function( field ) {
        if (field && field.name) {
            var type = this._typeMapping[field.type];
            var isReqStr = field.required ? ' NOT NULL' : '';
            if( type ) {
                return field.name + ' ' + type.toUpperCase() + isReqStr;
            }
        }
    }


});