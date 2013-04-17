M.Event = M.Object.extend({

    element: null,
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

        }
    },

    _checkEventBinding: function( jEvt ) {
        if( this._bindings[jEvt.type] && this._bindings[jEvt.type].length > 0 ) {

            console.log(this._bindings[jEvt.type]);
        }
    },

    registerEvents: function( events ) {

        var that = this;
        _.each(events, function( callback, eventType ) {
            if( !that._bindings[eventType] ) {
                that._bindings[eventType] = [];
            }
            that._bindings[eventType].push(callback);
        });
    }

});