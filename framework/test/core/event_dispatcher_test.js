test('M.EventDispatcher implementation', function() {
    /**
     * GENERAL
     */
    ok(M.Exception, 'M.EventDispatcher is defined');
    ok(typeof M.Exception === 'object', 'M.EventDispatcher is an object');

    ok(M.EventDispatcher._type && M.EventDispatcher._type === 'M.EventDispatcher', 'M.EventDispatcher._type is M.EventDispatcher');
    ok(typeof M.EventDispatcher._type === 'string', 'M.EventDispatcher._type is a string');

    ok(M.EventDispatcher._domEvents instanceof Array, '_domEvents is an array.');
    ok(M.EventDispatcher._globalEvents instanceof Array, '_globalEvents is an array.');
    ok(typeof(M.EventDispatcher._eventRegistry) === 'object', '_eventsRegistry is an object.')

    ok(M.EventDispatcher._isGlobalEvent('orientationchange'), 'orientationchange correctly determined as global');
    ok(!M.EventDispatcher._isGlobalEvent('tap'), 'tap correctly determined as non-global');
    ok(!M.EventDispatcher._isGlobalEvent('whatever'), 'whatever correctly determined as non-global');


    /**
     * REGISTERING EVENTS
     */

    // register events to DOM (will later be done in bootstrapping...)
    $(document).bind(M.EventDispatcher.getAllEventsAsString(), function(evt) {
        M.EventDispatcher.delegateEvent({
            evt: evt
        });
    });


    // creating a disliked global
    counter = 0;

    // creating a dummy view prototype
    var View = function( id ) {
        return {
            _id: 'm_' + id,

            _events: {
                tap: {
                    target: this,
                    action: function() {
                        counter = counter + 1;
                    }
                },

                doubletap: {
                    target: this,
                    action: function() {
                        console.log('doubletap');
                    }
                }
            },

            getId: function() {
                return this._id;
            },

            getEventHandler: function( type ) {
                return this._events[type];
            },

            getHtmlRepresentation: function() {
                return '<div id="' + this.getId() + '" style="display: none;" />';
            }
        }
    };

    var view1 = new View(1);
    $('body').append(view1.getHtmlRepresentation());

    M.EventDispatcher.registerEvent({
        source: view1,
        type: 'tap'
    });

    ok(M.EventDispatcher._eventRegistry.tap, 'Tap registered');
    ok(M.EventDispatcher._eventRegistry.tap[view1.getId()], 'Tap registered to correct view id');
    ok(typeof(M.EventDispatcher._eventRegistry.tap[view1.getId()]) === 'object', 'Tap registered to correct view id and event handler');


    /* Trigger tap event three times to increase view1's internal counter */
    $view1 = $('#' + view1.getId());
    $view1.trigger('tap');
    $view1.trigger('tap');
    $view1.trigger('tap');

    ok(counter === 3, 'Event trigger and delegation went successfully.');



});