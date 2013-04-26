var jQueryInit = $.fn.init;
$.fn.init = function() {
    var args = arguments;

    if( args && args[0] && args[0]._isMView ) {
        args[0] = args[0]._dom;
    }

    return (function() {
        function F() {
            return jQueryInit.apply(this, args);
        }

        F.prototype = jQueryInit.prototype;
        return new F();
    })();
};