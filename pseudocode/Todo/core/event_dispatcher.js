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
        this.callFromSuper('init');

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
        var targetView = this._getTargetView(jEvt);
        if( targetView ) {

            var event = this._bindings[jEvt.type][targetView.getId()];

            /* TODO: get the "app" namespace */
            var caller = null;
//            _.each(window[M.Application.getConfig('applicationName')], function(obj) {
            _.each(M, function(obj) {
                if(typeof obj === 'object' && obj._isMObject) {
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

    _getTargetView: function( jEvt ) {
        var targetView = null;
        var target = jEvt.target;
        while(target.parentNode && !targetView){
            var view = M.ViewManager.getViewById(target.id);

            if(view && this._bindings[jEvt.type] && this._bindings[jEvt.type][view.getId()]) {
                targetView = view;
            }

            target = target.parentNode;
        }

        return view;
    },

    registerEvents: function( source, events ) {
        if(!(source && source._isMView)) {
            return;
        }
        var that = this;
        _.each(events, function( callback, eventType ) {
            if( !that._bindings[eventType] ) {
                that._bindings[eventType] = {};
            }
            that._bindings[eventType][source.getId()] = that._bindings[eventType][source.getId()] || [];

            that._bindings[eventType][source.getId()] = M.Event.extend({
                source: source,
                callback: callback,
                eventType: eventType
            });
        });
    }

});