M.Object = /** @scope M.Object.prototype */ {

    /**
     * The type of this object.
     *
     * @type String
     */
    type: 'M.Object',

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

        /* save the prototype in an extra variable */
        obj._super = this;

        /* return the new object */
        return obj;
    },

    /**
    * Binds a method to its caller, so it is always executed within the right scope.
    *
    * @param {Object} caller The scope of the method that should be bound.
    * @param {Object} method The method to be bound.
    * @param {Object} arg One or more arguments. If more, then apply is used instead of call.
    */
    bindToCaller: function( caller, method, arg ) {
        return function() {
            if( Array.isArray(arg) ) {
                return method.apply(caller, arg);
            }
            return method.call(caller, arg);
        }
    },

    /**
    * Calls a method defined by a handler
    *
    * @param {Object} handler A function, or an object including target and action to use with bindToCaller.
    * @param {Object} arg One or more arguments.
    */
    handleCallback: function(handler, arg) {
        if (typeof(handler) === 'function') {
            handler(arg);
        } else if (handler && handler.target && handler.action) {
            var action = typeof(handler.action) === 'function' ? handler.action : handler.target[handler.action];
            var call   = this.bindToCaller(handler.target, action, arg);
            call();
        }
    },

    callFromSuper: function( functionName ) {
        var bind = this._super;
        if( M.Object._lastThis === this ) {
            bind = bind._super;
        } else {
            M.Object._lastThis = this;
        }
        return this.bindToCaller(this, bind[functionName])();
    }

};