test('M.View Test', function() {

    ok(M.hasOwnProperty('View'), 'M.View is defined.');

    ok(M.View.hasOwnProperty('_render') && typeof M.View._render === 'function', '_render function is defined.');

    ok(M.View.hasOwnProperty('_theme')  && typeof M.View._theme === 'function', '_theme function is defined.');

    ok(M.View.hasOwnProperty('_registerEvents') && typeof M.View._registerEvents === 'function', '_registerEvents function is defined.');

    ok(M.View.hasOwnProperty('_renderUpdate') && typeof M.View._renderUpdate === 'function', '_renderUpdate function is defined.');

    ok(M.View.hasOwnProperty('preRender') && typeof M.View.preRender === 'function', 'preRender function is defined.');

    ok(M.View.hasOwnProperty('postRender') && typeof M.View.postRender === 'function', 'postRender function is defined.');

    ok(M.View.hasOwnProperty('design') && typeof M.View.design === 'function', 'design function is defined.');

    ok(M.View.hasOwnProperty('_type') && typeof M.View._type === 'string' && M.View.type === 'M.View', 'M.View._type is part of M.View.');

    ok(M.View.hasOwnProperty('_isView') && typeof M.View._isView === 'boolean', 'M.View has the boolean _isView.');

    ok(M.View.hasOwnProperty('isView') && typeof M.View.isView === 'function', 'M.View has getter isView.');

    ok(M.View.hasOwnProperty('_value') && typeof M.View._value === 'object', 'M.View has the object _value.');

    ok(M.View.hasOwnProperty('cssClass') && typeof M.View.cssClass === 'string', 'M.View has the string cssClass.');

    ok(M.View.hasOwnProperty('getValue') && typeof M.View.getValue === 'function', 'M.View has getter getValue.');

    ok(M.View.hasOwnProperty('getValues') && typeof M.View.getValues === 'function', 'M.View has getter getValues.');

    ok(M.View.hasOwnProperty('setValue') && typeof M.View.setValue === 'function', 'M.View has setter setValue.');

    ok(M.View.hasOwnProperty('clearValue') && typeof M.View.clearValue === 'function', 'M.View has the function clearValue.');

    ok(M.View.hasOwnProperty('clearValues') && typeof M.View.clearValues === 'function', 'M.View has the function clearValues.');

    ok(M.View.hasOwnProperty('_computedValue') && typeof M.View._computedValue === 'object', 'M.View has the object _computedValue.');

    ok(M.View.hasOwnProperty('_contentBinding') && typeof M.View._contentBinding === 'object', 'M.View has the object _contentBinding.');

    ok(M.View.hasOwnProperty('_contentBindingReverse') && typeof M.View._contentBindingReverse === 'object', 'M.View has the object _contentBindingReverse.');

    ok(M.View.hasOwnProperty('childViews') && typeof M.View.childViews === 'string', 'M.View has the string childViews.');

    ok(M.View.hasOwnProperty('getChildViews') && typeof M.View.getChildViews === 'function', 'M.View has the function getChildViews.');

    ok(M.View.hasOwnProperty('getChildViewsAsArray') && typeof M.View.getChildViewsAsArray === 'function', 'M.View has the function getChildViewsAsArray.');

    ok(M.View.hasOwnProperty('_contentDidChange') && typeof M.View._contentDidChange === 'function', 'M.View has the function _contentDidChange.');

    ok(M.View.hasOwnProperty('getParentView') && typeof M.View.getParentView === 'function', 'M.View has the function getParentView.');

    M.Test = M.View.design({});

    ok(Object.getPrototypeOf(M.Test) === M.View, 'M.View is extendable.');

    var childViewsAsArray = M.Test.getChildViewsAsArray();

    ok(Array.isArray(childViewsAsArray) && childViewsAsArray.length === 0, 'getChildViewsAsArray returns an empty Array.');

    M.Test.childViews = 'firstChild';

    childViewsAsArray = M.Test.getChildViewsAsArray();

    ok(childViewsAsArray.lenght === 1 && childViewsAsArray[0] === 'firstChild', 'getChildViewsAsArray returns an Array with one element.');

    M.Test.childViews = 'firstChild secondChild';

    var childViewsAsArray = M.Test.getChildViewsAsArray();

    ok(childViewsAsArray.lenght === 2 && childViewsAsArray[0] === 'firstChild' && childViewsAsArray[1] === 'secondChild', 'getChildViewsAsArray returns an Array with two elements.');

    /* cleanup */
    M.Test = null;
    childViewsAsArray = null;

//    ok(M.Object.bindToCaller(M.NewObject, M.NewObject.testMethod, null)() === 123, 'M.Object.bindToCaller() binds the method call properly.');
//
//    throws(M.Object.bindToCaller(M.NewObject, 'testMethod', null), /^M.Exception.INVALID_INPUT_PARAMETER$/, M.Exception.INVALID_INPUT_PARAMETER.message);
//
//    throws(M.Object.bindToCaller('test', M.NewObject.testMethod, null), /^M.Exception.INVALID_INPUT_PARAMETER$/, M.Exception.INVALID_INPUT_PARAMETER.message);
//
//    throws(M.Object.bindToCaller(), /^M.Exception.INVALID_INPUT_PARAMETER$/, M.Exception.INVALID_INPUT_PARAMETER.message);

});