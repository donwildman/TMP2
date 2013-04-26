var jQueryInit = $.fn.init;
$.fn.init = function() {
    var args = arguments;

    if( args && args[0] && args[0]._isMView && args[0]._dom ) {
        args[0] = args[0]._dom;
    }

    return (function() {
        function f() {
            return jQueryInit.apply(this, args);
        }

        f.prototype = jQueryInit.prototype;
        return new f();
    })();
};