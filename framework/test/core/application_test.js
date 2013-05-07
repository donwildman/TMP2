test('M.Application Test', function() {

    ok(M.hasOwnProperty('Application'), 'M.Application is defined.');

    ok(M.Application.type === 'M.Application', 'The type of M.Application is M.Application.');

    ok(M.Application.hasOwnProperty('config') && typeof M.Application.config === 'object', 'M.Application has config property.');

    ok(M.Application.hasOwnProperty('start') && typeof M.Application.start === 'function', 'M.Application has a start() method.');

    ok(M.Application.hasOwnProperty('getConfig') && typeof M.Application.getConfig === 'function', 'M.Application has a getConfig() method.');

    M.Application.config = {
        prop1: 'test',
        prop2: 123,
        prop3: {
            a: 'a',
            b: 'b'
        }
    };

    ok(M.Application.getConfig('prop1') === 'test', 'getConfig() returns the right config property with the correct data type (string).');

    ok(M.Application.getConfig('prop2') === 123, 'getConfig() returns the right config property with the correct data type (number).');

    ok(typeof M.Application.getConfig('prop3') === 'object' && JSON.stringify(M.Application.getConfig('prop3')) === JSON.stringify({a: 'a',b: 'b'}), 'getConfig() returns the right config property with the correct data type (object).');

    throws(function() {M.Application.start()}, /^M.Exception.APPLICATION_START_NOT_DEFINED$/, M.Exception.APPLICATION_START_NOT_DEFINED.message);

});