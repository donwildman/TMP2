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

    /**
     * Returns a unique Id build from nextId property incremented by 1 and the prefix.
     * The id is used as the value for the HTML attribute id.
     *
     * @returns {String} The next id for a view, e.g. 'm_123' (if last id was 'm_122').
     */
    getNewId: function() {
        this.nextId = this.nextId + 1;
        return this.idPrefix + this.nextId;
    }

});