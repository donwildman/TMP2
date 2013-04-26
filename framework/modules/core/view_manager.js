M.ViewManager = M.Object.extend({

    /**
     * The type of this object.
     *
     * @type String
     */
    type: 'M.ViewManager',

    /**
     * This property contains the numerical index of the next view id to be
     * assigned. Whenever a component derived from M.View is generated,
     * an ID will be calculated based on this number and a static prefix which
     * is defined with the idPrefix property.
     *
     * @type Number
     */
    nextId: 0,

    /**
     * The prefix for the view IDs.
     *
     * @type String
     */
    idPrefix: 'm_',

    /**
     * This property contains a lookup map with all views within an application.
     *
     * @type Object
     * @private
     */
    _views: null,

    /**
     * This method returns a unique ID based on nextId and idPrefix. Each view within an
     * application get their own unique ID. This ID is stored both in the view's _id
     * property but also added to the view's DOM representation as the HTML id tag.
     *
     * @returns {String} The ID of a view.
     */
    getNewId: function( view ) {
        this.nextId = this.nextId + 1;

        var id = this.idPrefix + this.nextId;
        this._views[id] = view;

        return id;
    },

    /**
     * This method initialized the view manager.
     */
    _init: function() {
        this.callFromSuper('_init');

        this._views = {};
    },

    /**
     * This method will return a view object based on a given ID.
     *
     * @param id
     * @returns M.View
     */
    getViewById: function( id ) {
        return this._views[id];
    }

});