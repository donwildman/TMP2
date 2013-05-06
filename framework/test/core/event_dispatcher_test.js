test('M.EventDispatcher implementation', function() {
    /**
     * GENERAL
     */
    ok(M.Exception, 'M.EventDispatcher is defined');
    ok(typeof M.Exception === 'object', 'M.EventDispatcher is an object');

    ok(M.EventDispatcher._type && M.EventDispatcher._type === 'M.EventDispatcher', 'M.EventDispatcher._type is M.EventDispatcher');
    ok(typeof M.EventDispatcher._type === 'string', 'M.EventDispatcher._type is a string');

    ok(M.EventDispatcher._globalEvents instanceof Array, '_globalEvents is an array.');
    ok(typeof(M.EventDispatcher._eventsRegistry) === 'object', '_eventsRegistry is an object.')

    ok(M.EventDispatcher._isGlobalEvent('orientationchange'), 'orientationchange correctly determined as global');
    ok(!M.EventDispatcher._isGlobalEvent('tap'), 'tap correctly determined as non-global');
    ok(!M.EventDispatcher._isGlobalEvent('whatever'), 'whatever correctly determined as non-global');


    /**
     * REGISTERING EVENTS
     */

    // creating a dummy view prototype

    var View = function(id) {
        return {
            _id: '' + id,

            _events: {
                tap: {
                    action: function() {
                        console.log('tap');
                    }
                },

                doubletap: {
                    action: function() {
                        console.log('doubletap');
                    }
                }
            },

            getId: function() {
                return this._id;
            },

            getEventHandler: function(type) {
                return this._events[type];
            }
        }
    };

    var view1 = new View(1);

    M.EventDispatcher.registerEvent({
        source: view1,
        type: 'tap'
    });

    ok(M.EventDispatcher._eventRegistry.tap, 'Tap registered');
    ok(M.EventDispatcher._eventRegistry.tap['1'], 'Tap registered to correct view id');
    ok(typeof(M.EventDispatcher._eventRegistry.tap['1']) === 'object', 'Tap registered to correct view id and event handler');


});