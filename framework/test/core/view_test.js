test('M.View Test', function() {

    ok(M.View, 'M.View is defined.');


    ok(M.View.hasOwnProperty('_render'), '_render function is defined.');

    ok(M.View.hasOwnProperty('_theme'), '_theme function is defined.');

    ok(M.View.hasOwnProperty('_renderUpdate'), '_renderUpdate function is defined.');

    ok(M.View.hasOwnProperty('preRender'), 'preRender function is defined.');

    ok(M.View.hasOwnProperty('postRender'), 'postRender function is defined.');

    ok(typeof M.View.design === 'function', 'design function is defined.');

    ok(M.View.hasOwnProperty('_type') && typeof M.View._type === 'string' && M.View.type === 'M.View', 'M.View._type is part of M.View.');

    M.Test = M.View.design({});

    ok(Object.getPrototypeOf(M.Test) === M.View, 'M.View is extendable.');

    /* cleanup */
    M.Test = null;

//    ok(M.Object.bindToCaller(M.NewObject, M.NewObject.testMethod, null)() === 123, 'M.Object.bindToCaller() binds the method call properly.');
//
//    throws(M.Object.bindToCaller(M.NewObject, 'testMethod', null), /^M.Exception.INVALID_INPUT_PARAMETER$/, M.Exception.INVALID_INPUT_PARAMETER.message);
//
//    throws(M.Object.bindToCaller('test', M.NewObject.testMethod, null), /^M.Exception.INVALID_INPUT_PARAMETER$/, M.Exception.INVALID_INPUT_PARAMETER.message);
//
//    throws(M.Object.bindToCaller(), /^M.Exception.INVALID_INPUT_PARAMETER$/, M.Exception.INVALID_INPUT_PARAMETER.message);

});