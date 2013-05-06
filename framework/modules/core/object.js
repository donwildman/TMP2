M.Object = /** @scope M.Object.prototype */ {

    /**
     * The type of this object.
     *
     * @type String
     */
    _type: 'M.Object',

    /**
     * This property is used internally in combination with the callFromSuper method.
     *
     * @private
     * @type Object
     */
    _lastThis: null,

    /**
     * Creates an object based on a passed prototype.
     *
     * @param {Object} proto The prototype of the new object.
     */
    create: function( proto ) {
        var f = function() {
        };
        f.prototype = proto;
        return new f();
    },

    /**
     * Includes passed properties into a given object.
     *
     * @param {Object} properties The properties to be included into the given object.
     */
    include: function( properties ) {
        for( var prop in properties ) {
            if( this.hasOwnProperty(prop) ) {
                throw M.Exception.RESERVED_WORD.getException();
            }
            this[prop] = properties[prop];
        }
    },

    /**
     * Creates a new class and extends it with all functions of the defined super class
     * The function takes multiple input arguments. Each argument serves as additional
     * super classes - see mixins.
     *
     * @param {Object} properties The properties to be included into the given object.
     */
    extend: function( properties ) {
        /* create the new object */
        var obj = M.Object.create(this);

        /* assign the properties passed with the arguments array */
        obj.include(properties);

        /* call the new object's _init method to initialize it */
        obj._init();

        /* return the new object */
        return obj;
    },

    /**
     * Binds a method to its caller, so it is always executed within the right scope.
     *
     * @param {Object} caller The scope of the method that should be bound.
     * @param {Function} method The method to be bound.
     * @param {Object} arg One or more arguments. If more, then apply is used instead of call.
     */
    bindToCaller: function( caller, method, arg ) {
        return function() {
            if( typeof method !== 'function' || typeof caller !== 'object' ) {
                throw M.Exception.INVALID_INPUT_PARAMETER.getException();
            }
            if( Array.isArray(arg) ) {
                return method.apply(caller, arg);
            }
            return method.call(caller, arg);
        }
    },

    /**
     * This method is called right after the creation of a new object and can be used to
     * initialize some internal properties.
     *
     * This implementation in M.Object only serves as some kind of 'interface' declaration.
     */
    _init: function() {

    },

    /**
     * Calls a method defined by a handler
     *
     * @param {Object} handler A function, or an object including target and action to use with bindToCaller.
     */
    handleCallback: function( handler ) {
        var args = Array.prototype.slice.call(arguments, 1);
        if (handler) {
            var target = typeof handler.target === 'object' ? handler.target : this;
            var action = handler;
            if (typeof handler.action === 'function') {
                action = handler.action;
            } else if (typeof handler.action === 'string') {
                action = target[handler.action];
            }
            if (typeof action === 'function') {
                return this.bindToCaller(target, action, args)();
            }
        }
    },

    /**
     * This method returns the prototype implementation of a certain function but binds
     * it to the 'this' pointer.
     *
     * @param functionName
     * @return {Function} The context bound function.
     */
    callFromSuper: function( functionName ) {
        var bind = Object.getPrototypeOf(this);
        if( M.Object._lastThis === this ) {
            bind = Object.getPrototypeOf(bind);
        } else {
            M.Object._lastThis = this;
        }
        return this.bindToCaller(this, bind[functionName])();
    },

    /**
     * Define hidden property
     * @param {String} name
     * @param {Mixed} value
     */
    defineHiddenProperty: function(name, value) {
        this.defineProperty(name, value, {
            writable: YES,
            enumerable: NO,
            configurable: YES
        });
    },

    /**
     * Define readonly property on object
     *
     * @param {String} name
     * @param {Mixed} value
     */
    defineReadonlyProperty: function(name, value) {
        this.defineProperty(name, value, {
            writable: NO,
            enumerable: YES,
            configurable: YES
        });
    },

    /**
     * Define new property on object and set hidden/readonly flags.
     *
     * @param {String} name
     * @param {Mixed} value
     * @param {Object} config
     */
    defineProperty: function(name, value, config) {
        config = config || {};
        Object.defineProperty(this, name, {
            writable: !!config.writable,
            enumerable: !!config.enumerable,
            configurable: !!config.configurable,
            value: value
        });
    },

    /**
     * Returns an array of keys of the objects public own properties.
     *
     * @return {Array}
     */
    keys: function() {
        return Object.keys(this);
    },

    /**
     * Returns the type of the object.
     *
     * @return {String}
     */
    getObjectType: function() {
        return this._type;
    }

};