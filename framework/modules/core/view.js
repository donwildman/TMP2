M.View = M.Object.extend({

    /**
     * This property is used internally to recursively build the pages html representation.
     * It is once set within the render method and then eventually updated within the
     * renderUpdate method.
     *
     * @type String
     */

    _html: null,

    /**
     * Initialize M.View
     *
     * @type function
     */
    _init: function(){
        this._html = '';
    },

    /**
     * This is the basic render construct for any views.
     *
     * @returns {String} The list item view's html representation.
     */
    render: function(){

        this.preRender();

        this._render();

        this.postRender();

        return this.html;
    },

    /**
     * This is the method is called before the rendering.
     *
     */
    preRender: function(){

    },

    /**
     * This is the method is called right after the view was appended to a DOM.
     *
     */
    postRender: function(){

    },

    /**
     * This is the basic render method for any views. Most views overwrite this method with a custom render behaviour.
     *
     */

    _render: function(){

    }



});