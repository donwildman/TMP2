test('M.Bootstrap', function() {

    ok(M.Bootstrap, 'M.Bootstrap is defined');

    //Test initialisation
    ok(M.Bootstrap.hasOwnProperty('startPage'), 'M.Bootstrap.startPage is defined');
    ok(M.Bootstrap.jsList, 'M.Bootstrap.jsList is defined');

});

asyncTest('M.Bootstrap initialLoad Test', 3, function() {
    M.Bootstrap.startPage = 'bootstrapping/test_page1.js';
    M.Bootstrap.jsList = ['../../modules/core/object.js'];
    M.Bootstrap.pageList = ['bootstrapping/test_page2.js', 'bootstrapping/test_page3.js'];
    document.addEventListener('applicationdidload', function(){
        ok(window.bootstrapping.test_page2.wasInterpreted === 1, "page2 was interpreted");
        ok(window.bootstrapping.test_page1.wasInterpreted === 1, "page1 was interpreted");
        ok(window.bootstrapping.test_page3.wasInterpreted === 1, "page3 was interpreted");
        start();
    });
    M.Bootstrap.initialLoad();
});

asyncTest("M.Bootstrap.loadScript Test", 2, function() {

    M.Bootstrap.loadScript('bootstrapping/test_page2.js', false, function() {
        ok(window.bootstrapping.test_page2.wasInterpreted === 1, "success callback: test_page2.js did load and was interpreted");
        start();
    });

    M.Bootstrap.loadScript('__test_page2.js', false, function( event ) {
        ok(false, "__test_page2.js did load, but shouldn't");
        start();
    }, function( event ) {
        ok(true, "error callback: __test_page2.js didn't load");
        start();
    });
});