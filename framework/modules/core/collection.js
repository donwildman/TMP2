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

    _data:   null,

    create: function(data) {

        var collection = this.extend({
            _data:   []
        });

        collection.add(data);

        return collection;
    },

    add: function(data) {
        if ( M.Model.isPrototypeOf(data)){
            this._data.push(data.getRecord());
        } else if (_.isArray(data)) {
            this._data = this._data.concat(data);
        } else if (_.isObject(data)) {
            this._data.push(data);
        }
    },

    clear: function() {
        this._data = [];
    },

    getCount: function() {
        return this._data ? this._data.length : 0;
    },

    getAt: function(index) {
        return this._data[index];
    },

    getData: function() {
        return this._data;
    }

});