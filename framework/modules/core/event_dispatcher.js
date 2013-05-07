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


    _domEvents: ['blur', 'focus', 'focusin', 'focusout', 'load', 'scroll', 'unload', 'click', 'dblclick', 'mousedown', 'mouseup', 'mousemove', 'mouseover', 'mouseout', 'mouseenter', 'mouseleave', 'change', 'select', 'submit', 'keydown', 'keypress', 'keyup', 'error', 'touch', 'release', 'hold', 'tap', 'doubletap', 'dragstart', 'drag', 'dragend', 'dragleft', 'dragright', 'dragup', 'dragdown', 'swipe', 'swipeleft', 'swiperight', 'swipeup', 'swipedown', 'transformstart', 'transform', 'transformend', 'rotate', 'pinch', 'pinchin', 'pinchout'],

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

        if( !this._eventRegistry[type] ) {
            return false;
        }

        if( !this._eventRegistry[type][id] ) {
            return false;
        }

        var eventHandler = this._eventRegistry[type][id];
        this.callHandler(eventHandler, null, NO, [id, obj.evt]);
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
     * This method is used to check the handler. It tests if target and action are
     * specified correctly.
     *
     * @param {Object} handler The handler for the event.
     * @param {String} type The type of the event.
     * @return {Boolean} Specifies whether or not the check was successful.
     */
    checkHandler: function( handler, type ) {
        if( _.isString(handler.action) ) {
            if( handler.target ) {
                if( handler.target[handler.action] && _.isFunction(handler.target[handler.action]) ) {
                    handler.action = handler.target[handler.action];
                    return YES;
                } else {
                    M.Logger.warn('No action \'' + handler.action + '\' found for given target and the event type \'' + type + '\'!', M.CONST.LOGGER.TAG_FRAMEWORK_CORE);
                    return NO;
                }
            } else {
                M.Logger.warn('No valid target passed for action \'' + handler.action + '\' and the event type \'' + type + '\'!', M.CONST.LOGGER.TAG_FRAMEWORK_CORE);
                return NO;
            }
        } else if( !_.isFunction(handler.action) ) {
            M.Logger.warn('No valid action passed for the event type \'' + type + '\'!', M.CONST.LOGGER.TAG_FRAMEWORK_CORE);
            return NO;
        }

        return YES;
    },

    /**
     * Creates a jQuery compatible event string listing all available events from the arrays
     * _domEvents and _globalEvents.
     * @returns {String} A jQuery compatible event string listing all available events
     */
    getAllEventsAsString: function() {
        return this._domEvents.join(' ') + this._globalEvents.join(' ');
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