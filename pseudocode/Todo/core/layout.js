M.Layout = M.Object.extend({
    /**
     * The type of this object.
     *
     * @type String
     */
    type: 'M.Layout',

    setView: function(){
        throw M.Exception.SET_VIEW_NOT_DEFINED.getException();
    }
});