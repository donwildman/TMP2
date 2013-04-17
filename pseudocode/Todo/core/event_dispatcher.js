M.EventDispatcher = M.Object.extend(/** @scope M.EventDispatcher.prototype */ {

    /**
     * The type of this object.
     *
     * @type String
     */
    type: 'M.EventDispatcher',

    _internalEvents: ['click', 'DOMNodeInserted'],

    _bindings: null,

    init: function(){
        var that = this;

        this._bindings = {};

        $(document).on(this._internalEvents.join(' '), function(jEvt){
            that._eventDidHappen(jEvt);
        });

    },

    _eventDidHappen: function(jEvt){

        if(this._checkEventBinding(jEvt)){

        }
    },

    _checkEventBinding: function(jEvt){


    },

    registerEvent: function(eventType){


    }

});