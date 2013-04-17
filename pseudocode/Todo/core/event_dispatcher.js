M.Event = M.Object.extend({

    source: null,
    callback: null,
    eventType: null

});

M.EventDispatcher = M.Object.extend(/** @scope M.EventDispatcher.prototype */ {

    /**
     * The type of this object.
     *
     * @type String
     */
    type: 'M.EventDispatcher',

    _internalEvents: null,

    _bindings: null,

    init: function() {
        this._internalEvents = [M.CONST.EVENTS.CLICK, M.CONST.EVENTS.DOM_NODE_INSERTED];
        this._bindings = {};
        this._bindDocumentEvents();

    },

    _bindDocumentEvents: function() {
        var that = this;
        $(document).on(this._internalEvents.join(' '), function( jEvt ) {
            that._eventDidHappen(jEvt);
        });
    },

    _eventDidHappen: function( jEvt ) {
        if( this._checkEventBinding(jEvt) ) {

            var event = this._bindings[jEvt.type][jEvt.target.attr('id')];

            /* TODO: get the "app" namespace */
            var caller = null;
            _.each(window[M.Application.getConfig('applicationName')], function(obj) {
                if(typeof obj === 'object' && this._isMObject) {
                    _.each(obj, function(f) {
                        if(typeof f === 'function' && f.name === event.callback.name) {
                            caller = obj;
                        }
                    })
                }
            });
            if(caller) {
                event.callback.apply(caller, []);
            }
        }
    },

    _checkEventBinding: function( jEvt ) {
        if( this._bindings[jEvt.type] ) {
            return true;
        }
    },

    registerEvents: function( source, events ) {

        var that = this;
        _.each(events, function( callback, eventType ) {
            if( !that._bindings[eventType] ) {
                that._bindings[eventType] = {};
            }
            that._bindings[eventType][source.id] = that._bindings[eventType][source.id] || [];

            that._bindings[eventType][source.id] = M.Event.extend({
                source: source,
                callback: callback,
                eventType: eventType
            });
        });
    }

});