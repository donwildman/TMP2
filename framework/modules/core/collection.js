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
            this._data.concat(data);
        } else if (_.isObject(data)) {
            this._data.push(data);
        }
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