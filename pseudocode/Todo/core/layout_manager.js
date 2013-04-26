M.LayoutManager = M.Object.extend({

    /**
     * The type of this object.
     *
     * @type String
     */
    type: 'M.LayoutManager',

    layout: null,

    init: function() {

    },

    setLayout: function( layout ) {
        if( !(layout) ) {
            throw M.Exception.NO_TEMPLATE_DEFINED.getException();
        }
        this.layout = layout;
        $('body').empty().append(this.layout.basicMarkup());
    }

});
