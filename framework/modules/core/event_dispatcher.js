// ==========================================================================
// Project:   The M-Project - Mobile HTML5 Application Framework
// Copyright: (c) 2013 M-Way Solutions GmbH. All rights reserved.
//            (c) 2013 panacoda GmbH. All rights reserved.
// Creator:   Sebastian
// Date:      06.05.2013
// License:   Dual licensed under the MIT or GPL Version 2 licenses.
//            http://github.com/mwaylabs/The-M-Project/blob/master/MIT-LICENSE
//            http://github.com/mwaylabs/The-M-Project/blob/master/GPL-LICENSE
// ==========================================================================

/**
 * @class
 *
 * M.EventDispatcher is the central instance for registering
 * and delegating DOM and non-UI events to their corresponding target
 * and handler
 *
 * @extends M.Object
 */
M.EventDispatcher = M.Object.extend(/** @scope M.EventDispatcher.prototype */ {

    _type: 'M.EventDispatcher',

    _globalEvents: ['orientationchange', 'resize', 'deviceorientation'], // TODO: make configurable for app devs, e.g. in application config. other events missing: e.g. "contentshow", ...

    _eventRegistry: null,

    _init: function() {
        this._eventRegistry = {};
    },

    registerEvent: function( obj ) {
        if( !obj.type ) {
            M.Logger.log('Cannot register event because no event type passed.', M.CONST.LOGGER.TAG_FRAMEWORK_CORE);
            return false;
        }

        if( !obj.source ) {
            M.Logger.log('Cannot register event because no event type passed.', M.CONST.LOGGER.TAG_FRAMEWORK_CORE);
            return false;
        }

        if( this._isGlobalEvent(obj.type) ) {
            /* case global events (orientationchange, resize, ...) */


        } else {
            /* case UI/DOM events (touchstart, touchmove, focus, ...) */

            try {
                /* id can be accessed via getId for TMP views or by passing an object with this parameter or explicitly passing an id */
                var id = _.isFunction(obj.source.getId) ? obj.source.getId() : (obj.source.id ? obj.source.id : obj.id);

                /* create new object for type if not exists yet */
                this._eventRegistry[obj.type] = this._eventRegistry[obj.type] || {};

                /* save handler under property <view-id> to be able to call it later */
                this._eventRegistry[obj.type][id] = obj.source.getEventHandler(obj.type);

            } catch( e ) {
                M.Logger.error('Error while trying to register event ' + obj.type + '. ' + e, M.CONST.LOGGER.TAG_FRAMEWORK_CORE);
                throw M.Exception.INVALID_INPUT_PARAMETER.getException();
            }

        }
    },

    /**
     *
     * @param obj
     */
    delegateEvent: function( obj ) {
        var type = obj.evt.type;
        var id = obj.evt.target.id;

        if( !this.eventRegistry[type] ) {
            return;
        }

        if( !this.eventRegistry[type][id] ) {
            return;
        }

        var eventHandler = M.ViewManager.getViewById(id).events[type];
        this.callHandler(eventHandler, null, NO, [id, evt]);

        this.callHandler(obj.callbacks.success, null, NO, [data, msg, xhr, obj]);
    },

    /**
     * This method is used to explicitly call an event handler. We mainly use this for
     * combining internal and external events.
     *
     * @param {Object} handler The handler for the event.
     * @param {Object} event The original DOM event.
     * @param {Boolean} passEvent Determines whether or not to pass the event and its target as the first parameters for the handler call.
     * @param {Array} parameters The (additional) parameters for the handler call.
     */
    callHandler: function( handler, event, passEvent, parameters ) {
        if( !this.checkHandler(handler, (event && event.type ? event.type : 'undefined')) ) {
            return;
        }

        if( !passEvent ) {
            this.bindToCaller(handler.target, handler.action, parameters)();
        } else {
            this.bindToCaller(handler.target, handler.action, [event.currentTarget.id ? event.currentTarget.id : event.currentTarget, event])();
        }
    },

    /**
     * Checks whether an event type is seen as global event or not.
     * True, e.g. for "orientationchange"
     * @param {String} type The type of the event, e.g. "orientationchange" or "touchstart"
     * @returns {Boolean} Flag determining whether event is seen as global or not
     * @private
     */
    _isGlobalEvent: function( type ) {
        return _.include(this._globalEvents, type);
    }


});