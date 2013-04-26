M.ViewManager = M.Object.extend({

    /**
     * The type of this object.
     *
     * @type String
     */
    type: 'M.ViewManager',

    /**
     * The nextId delivered to a view (used as html id attribute value) with prefix m_.
     * Initial state is 0, will be incremeneted by 1 on each call.
     *
     * @type Number
     */
    nextId: 0,

    /**
     * Prefix for Id.
     *
     * @type String
     */
    idPrefix: 'm_',

    _views: null,

    _functionNameMap: null,

    /**
     * Returns a unique Id build from nextId property incremented by 1 and the prefix.
     * The id is used as the value for the HTML attribute id.
     *
     * @returns {String} The next id for a view, e.g. 'm_123' (if last id was 'm_122').
     */
    getNewId: function(view) {
        this.nextId = this.nextId + 1;

        var id = this.idPrefix + this.nextId;
        this._views[id] = view;

        return id;
    },

    init: function() {
        this.callFromSuper('init');

        this._functionNameMap = {};
        this._views = {};
    },

    getViewById: function(id) {
        return this._views[id];
    },

    addFunctionMapping: function(name, func){
        this._functionNameMap[name] = func;
    },

    getFunctionByName: function(name){
        if(this._functionNameMap[name]){
            return this._functionNameMap[name];
        }
    }

});