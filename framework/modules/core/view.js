M.View = M.Object.extend({

    /**
     * The type of this object.
     *
     * @type String
     */
    type: 'M.View',

    /**
     * This property contains the view's DOM representation.
     *
     * @type Object
     * @private
     */
    _dom: null,

    /**
     * This property contains the view's unique ID. This ID is automatically generated by the
     * framework.
     *
     * @type String
     * @private
     */
    _id: null,

    /**
     * This property is used to identify M.View and all of its derived object as views.
     *
     * @type Boolean
     * @private
     */
    _isMView: YES,

    /**
     * This property can be used to add custom css class/classes to the rendered view. This allows
     * custom styling.
     *
     * @type String
     */
    cssClass: '',

    /**
     * This property contains the value of a view. It is directly connected to the view's DOM
     * representation. To write / read the value, use getValue() / setValue().
     *
     * @type String
     */
    value: null,

    /**
     * This method is based on M.Object's extend() but adds some view specific features
     * such as registering the view at the view manager and applying a unique id.
     *
     * @param obj
     * @returns M.View
     */
    design: function( obj ) {
        var view = this.extend(this._normalize(obj));
        view._id = M.ViewManager.getNewId(view);
        return view;
    },

    /**
     * This method is used internally to process the configuration object for the view
     * before handing it to the extend method. The job of this method is to make sure that
     * the configuration object fits the requirements of the extend process.
     *
     * @param obj
     * @returns Object
     * @private
     */
    _normalize: function( obj ) {
        return obj;
    }

});