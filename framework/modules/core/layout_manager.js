// ==========================================================================
// Project:   The M-Project - Mobile HTML5 Application Framework
// Copyright: (c) 2013 M-Way Solutions GmbH. All rights reserved.
//            (c) 2013 panacoda GmbH. All rights reserved.
// Creator:   Dominik
// Date:      07.05.2013
// License:   Dual licensed under the MIT or GPL Version 2 licenses.
//            http://github.com/mwaylabs/The-M-Project/blob/master/MIT-LICENSE
//            http://github.com/mwaylabs/The-M-Project/blob/master/GPL-LICENSE
// ==========================================================================

/**
 * @class
 * @extends M.Object
 */
M.LayoutManager = M.Object.extend(/** @scope M.LayoutManager.prototype */{

    /**
     * The type of this object.
     *
     * @type String
     */
    type: 'M.LayoutManager',

    /**
     * This method sets the layout of an application. It triggers the rendering
     * process on the desired layout and appends it to the live DOM.
     *
     * @param layout
     */
    setLayout: function( layout ) {
        if( !(layout && layout.isMLayout) ) {
            return;
        }

        if( !(Object.getPrototypeOf(layout).isMLayout && Object.getPrototypeOf(layout).type === layout.type ) ) {
            layout = layout.design()
        }

        this.layout = layout;

        /* empty the body and append the given layout */
        $('body').empty().append(this.layout.render());
    },

    /**
     * This method sets the content of the currently active layout. It requires
     * an object as its only parameter.
     *
     * @param obj
     */
    setContent: function( obj ) {
        if( !(obj && typeof obj === 'object') ) {
            return;
        }

        this.layout.setContent(obj);
    }

});