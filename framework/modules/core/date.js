// ==========================================================================
// Project:   The M-Project - Mobile HTML5 Application Framework
// Copyright: (c) 2010 M-Way Solutions GmbH. All rights reserved.
//            (c) 2011 panacoda GmbH. All rights reserved.
// Creator:   Frank
// Date:      29.03.2013
// License:   Dual licensed under the MIT or GPL Version 2 licenses.
//            http://github.com/mwaylabs/The-M-Project/blob/master/MIT-LICENSE
//            http://github.com/mwaylabs/The-M-Project/blob/master/GPL-LICENSE
// ==========================================================================


/**
 * @class
 *
 * @extends M.Object
*/

M.Date = M.Object.extend(
/** @scope M.Date.prototype */ {

    create: function(p1, p2, p3) {
        var momt = moment(p1, p2, p3);
        var date = this.extend(momt);
        return date;
    }

});