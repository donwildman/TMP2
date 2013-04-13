test('M.Logger implementation', function() {

    // CLASS
    ok(M.Logger, 'M.Logger is defined');
    ok(typeof M.Logger === 'object', 'M.Logger is an object');
    ok(M.Logger._type && M.Logger._type === 'M.Logger', 'M.Logger._type is M.Logger');
    ok(typeof M.Logger._type === 'string', 'M.Logger._type is a string');

    // CONST defined
    ok(M.Logger.hasOwnProperty('_LEVEL_LOG') , 'M.Logger._LEVEL_LOG is defined.');
    ok(M.Logger.hasOwnProperty('_LEVEL_DEBUG') , 'M.Logger._LEVEL_DEBUG is defined.');
    ok(M.Logger.hasOwnProperty('_LEVEL_WARN') , 'M.Logger._LEVEL_WARN is defined.');
    ok(M.Logger.hasOwnProperty('_LEVEL_ERROR') , 'M.Logger._LEVEL_ERROR is defined.');
    ok(M.Logger.hasOwnProperty('_LEVEL_TIME_END') , 'M.Logger._LEVEL_TIME_END is defined.');
    ok(M.Logger.hasOwnProperty('_LEVEL_COUNT') , 'M.Logger._LEVEL_COUNT is defined.');
    ok(M.Logger.hasOwnProperty('TAG_ALL') && typeof M.Logger.TAG_ALL === 'string', 'M.Logger.TAG_ALL is defined.');
    ok(M.Logger.hasOwnProperty('TAG_FRAMEWORK_CORE') && typeof M.Logger.TAG_FRAMEWORK_CORE === 'string', 'M.Logger.TAG_FRAMEWORK_CORE is defined.');
    ok(M.Logger.hasOwnProperty('TAG_FRAMEWORK_UI') && typeof M.Logger.TAG_FRAMEWORK_UI === 'string', 'M.Logger.TAG_FRAMEWORK_UI is defined.');

    ok(typeof M.Logger._LEVEL_LOG === 'number', 'M.Logger._LEVEL_LOG is a number.');
    ok(typeof M.Logger._LEVEL_DEBUG === 'number', 'M.Logger._LEVEL_DEBUG is a number.');
    ok(typeof M.Logger._LEVEL_WARN === 'number', 'M.Logger._LEVEL_WARN is a number.');
    ok(typeof M.Logger._LEVEL_ERROR === 'number', 'M.Logger._LEVEL_ERROR is a number.');
    ok(typeof M.Logger._LEVEL_TIME_END === 'number', 'M.Logger._LEVEL_TIME_END is a number.');
    ok(typeof M.Logger._LEVEL_COUNT === 'number', 'M.Logger._LEVEL_COUNT is a number.');
    ok(typeof M.Logger.TAG_ALL === 'string', 'M.Logger.TAG_ALL is a string.');
    ok(typeof M.Logger.TAG_FRAMEWORK_CORE === 'string', 'M.Logger.log is a string.');
    ok(typeof M.Logger.TAG_FRAMEWORK_UI === 'string', 'M.Logger.TAG_FRAMEWORK_UI is a string.');

    ok(M.Logger._LEVEL_LOG === 0, 'M.Logger._LEVEL_LOG is 0.');
    ok(M.Logger._LEVEL_DEBUG === 1, 'M.Logger._LEVEL_DEBUG is 1.');
    ok(M.Logger._LEVEL_WARN === 2, 'M.Logger._LEVEL_WARN is 2.');
    ok(M.Logger._LEVEL_ERROR === 3, 'M.Logger._LEVEL_ERROR is 3.');
    ok(M.Logger._LEVEL_TIME_END === 4, 'M.Logger._LEVEL_TIME_END is 4.');
    ok(M.Logger._LEVEL_COUNT === 5, 'M.Logger._LEVEL_COUNT is 5.');
    ok(M.Logger.TAG_ALL === 'all', 'M.Logger.TAG_ALL is equal to all.');
    ok(M.Logger.TAG_FRAMEWORK_CORE === 'framework-core', 'M.Logger.log is equal to framework-core.');
    ok(M.Logger.TAG_FRAMEWORK_UI === 'framework-ui', 'M.Logger.TAG_FRAMEWORK_UI is equal to framework-ui.');

    // PROPERTIES defined
    ok(M.Logger.hasOwnProperty('filter') , 'M.Logger.filter is defined.');
    ok(M.Logger.hasOwnProperty('_times') , 'M.Logger._times is defined.');
    ok(M.Logger.hasOwnProperty('_counts') , 'M.Logger._counts is defined.');

    ok(_.isArray(M.Logger.filter), 'M.Logger.filter is a array.');
    ok(_.isArray(M.Logger._times), 'M.Logger._times is a array.');
    ok(_.isArray(M.Logger._counts), 'M.Logger._counts is a array.');

    // METHODS defined
    ok(M.Logger.hasOwnProperty('log') , 'M.Logger.log is defined.');
    ok(M.Logger.hasOwnProperty('warn') , 'M.Logger.warn is defined.');
    ok(M.Logger.hasOwnProperty('error') , 'M.Logger.error is defined.');
    ok(M.Logger.hasOwnProperty('debug') , 'M.Logger.debug is defined.');
    ok(M.Logger.hasOwnProperty('time') , 'M.Logger.time is defined.');
    ok(M.Logger.hasOwnProperty('timeEnd') , 'M.Logger.timeEnd is defined.');
    ok(M.Logger.hasOwnProperty('count') , 'M.Logger.count is defined.');
    ok(M.Logger.hasOwnProperty('_print') , 'M.Logger._print is defined.');
    ok(M.Logger.hasOwnProperty('_time') , 'M.Logger._time is defined.');
    ok(M.Logger.hasOwnProperty('_timeEnd') , 'M.Logger._timeEnd is defined.');
    ok(M.Logger.hasOwnProperty('_count') , 'M.Logger._count is defined.');
    ok(M.Logger.hasOwnProperty('_appRunsInNotDebugMode') , 'M.Logger._appRunsInNotDebugMode is defined.');
    ok(M.Logger.hasOwnProperty('_preventPrintByTag') , 'M.Logger._preventPrintByTag is defined.');

    ok(typeof M.Logger.log === 'function', 'M.Logger.log is a function.');
    ok(typeof M.Logger.warn === 'function', 'M.Logger.warn is a function.');
    ok(typeof M.Logger.error === 'function', 'M.Logger.error is a function.');
    ok(typeof M.Logger.debug === 'function', 'M.Logger.debug is a function.');
    ok(typeof M.Logger.time === 'function', 'M.Logger.time is a function.');
    ok(typeof M.Logger.timeEnd === 'function', 'M.Logger.timeEnd is a function.');
    ok(typeof M.Logger.count === 'function', 'M.Logger.count is a function.');
    ok(typeof M.Logger._print === 'function', 'M.Logger._print is a function.');
    ok(typeof M.Logger._time === 'function', 'M.Logger._time is a function.');
    ok(typeof M.Logger._timeEnd === 'function', 'M.Logger._timeEnd is a function.');
    ok(typeof M.Logger._count === 'function', 'M.Logger._count is a function.');
    ok(typeof M.Logger._appRunsInNotDebugMode === 'function', 'M.Logger._appRunsInNotDebugMode is a function.');
    ok(typeof M.Logger._preventPrintByTag === 'function', 'M.Logger._preventPrintByTag is a function.');

});