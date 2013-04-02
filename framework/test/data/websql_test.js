
TEST.Person = M.Model.create({
    config: {
        name:   'person',
        key:    'id',
        fields:  {
            id:          { type: M.CONST.TYPE.INTEGER, required: YES },
            sureName:    { type: M.CONST.TYPE.STRING,  required: YES, index: true },
            firstName:   { type: M.CONST.TYPE.STRING,  length: 200 },
            birthDate:   { type: M.CONST.TYPE.DATE   },
            bmi:         { type: M.CONST.TYPE.FLOAT,   default: 1.0},
            notes:       { type: M.CONST.TYPE.TEXT   },
            address:     { type: M.CONST.TYPE.OBJECT },
            displayName: { type: M.CONST.TYPE.STRING, persistent: NO }
        }
    }
});

TEST.WebSql = M.WebSqlConnector.create({
    config: {
        name: 'test',
        tables: {
            // name of the table
            person: {
                // take key and field configuration from Person model
                model: TEST.Person,
                // overrides to model config
                fields: {
                    sureName:    { name: 'sure_name'  },
                    firstName:   { name: 'first_name' },
                    bmi:         { type: M.CONST.TYPE.STRING }
                }
            }
        }
    }
});

asyncTest('M.WebSqlConnector basics', function () {

    var person = TEST.Person.createRecord({
        id: 1,
        firstName: 'The',
        sureName: 'M-Project',
        birthDate: '03.12.2011',
        bmi: 27.8,
        notes: 'Best HTML5 framework ever!',
        address: { street: 'Leitzstraße', house_nr: 45, zip: '70469', city: 'Stuttgart' },
        displayName: 'The M-Project'
    });

    var testDrop = function () {
        TEST.WebSql.drop({
            model: person,
            onSuccess: function() { ok(true,  'drop table person succeeded.' ); },
            onError: function()   { ok(false, 'error dropping table person.' ); start(); },
            onFinish: function()  { ok(true,  'drop table person finished.' ); testCreateTable(); }
        });
    };

    var testCreateTable = function () {
        TEST.WebSql.createTable({
            model: person,
            onSuccess: function() { ok(true,  'save person model succeeded' ); },
            onError: function()   { ok(false, 'error saving person model' ); start(); },
            onFinish: function()  { ok(true,  'save person model finished' ); testSave(); }
        });
    };

    var testSave = function () {
        TEST.WebSql.save({
            model: person,
            onSuccess: function() { ok(true,  'save person model succeeded' ); },
            onError: function()   { ok(false, 'error saving person model' ); start(); },
            onFinish: function()  { ok(true,  'save person model finished' ); testFind(); }
        });
    };

    var testFind = function (bmi) {
        TEST.WebSql.find({
            table: 'person',
            onSuccess: function(result) {
                ok(true,  'find person model succeeded' );
                testResult(result);
            },
            onError: function()   { ok(false, 'error find person model' ); start(); },
            onFinish: function()  { ok(true,  'find person model finished' ); testUpdate(); }
        });
    };

    var testResult = function(result) {

        ok(typeof result === 'object', 'Find has a response object.');

        ok(M.Collection.getObjectType() === result.getObjectType(), 'The response is a M.Collection.');

        ok(result.getCount() === 1, 'The response holds one record.');

        // get first person record
        var data = result.getAt(0);

        ok(data.sureName === 'M-Project', 'Field "sureName" has correct value.');

        ok(data.bmi === person.get('bmi'), 'Field "bmi" has correct value.');

        ok(data.notes === 'Best HTML5 framework ever!', 'Field "note" has correct value.');

        ok(data.id === 1, 'Field "id" has correct value.');

        ok(data.address.street === 'Leitzstraße', 'Field "address" has correct value.');

        var p = TEST.Person.createRecord(data);

        ok(p.get('sureName') === 'M-Project', 'Field "sureName" has correct value.');

        ok(p.get('bmi') === person.get('bmi'), 'Field "bmi" has correct value.');

        ok(p.get('notes') === 'Best HTML5 framework ever!', 'Field "note" has correct value.');

        ok(p.get('id') === 1, 'Field "id" has correct value.');

        ok(p.get('address').street === 'Leitzstraße', 'Field "address" has correct value.');
    };

    var testUpdate = function () {

        person.set('bmi', 26.1);

        TEST.WebSql.save({
            model: person,
            onSuccess: function() { ok(true,  'update person model succeeded' );
                TEST.WebSql.find({
                    table: 'person',
                    onSuccess: function(result) {
                        ok(result.getAt(0).bmi === person.get('bmi'), 'Field "bmi" has correct updated value.');
                    },
                    onError: function()   { ok(false, 'error find updated person model.' ); start(); },
                    onFinish: function()  { ok(true,  'find updated person model finished.' ); testDel(); }
                });
            },
            onError: function()  { ok(false, 'error updating person model.' ); start(); },
            onFinish: function() { ok(true,  'update person model finished.' ); }
        });
    };

    var testDel = function () {

        TEST.WebSql.del({
            model: person,
            onSuccess: function() {
                ok(true,  'del person model succeeded.' );
                TEST.WebSql.find({
                    table: 'person',
                    onSuccess: function(result) {
                        ok(result.getCount() === 0, 'record has been deleted.');
                    },
                    onError: function()   { ok(false, 'error find updated person model.' ); start(); },
                    onFinish: function()  { ok(true,  'find updated person model finished.' ); start(); }
                });
            },
            onError: function()  { ok(false, 'error deleting person model.' ); start(); },
            onFinish: function() { ok(true,  'del person model finished.' ); }
        });
    };


    testDrop();
});

asyncTest('M.WebSqlConnector with collection', function () {

    var persons = M.Collection.create([
        { sureName: 'Stierle' },
        { sureName: 'Werler' }
    ]);

    var testSave = function () {
        TEST.WebSql.save({
            table: 'person',
            data: persons,
            onSuccess: function() { ok(true,  'save persons collection succeeded.' ); },
            onError: function()   { ok(false, 'error save persons collection.' ); start(); },
            onFinish: function()  { ok(true,  'save persons collection finished.' ); testFind(); }
        });
    };

    var testFind = function (bmi) {
        TEST.WebSql.find({
            order: 'id',
            table: 'person',
            onSuccess: function(result) {
                ok(true,  'find persons succeeded.' );
                testResult(result);
            },
            onError: function()   { ok(false, 'error find persons.' ); start(); },
            onFinish: function()  { ok(true,  'find persons finished.'); start(); }
        });
    };

    var testResult = function(result) {

        ok(typeof result === 'object', 'Find has a response object.');

        ok(M.Collection.getObjectType() === result.getObjectType(), 'The response is a M.Collection.');

        ok(result.getCount() === 2, 'The response holds 3 records.');

        // get second person record
        var data = result.getAt(0);

        ok(data.sureName === 'Stierle', 'Field "sureName" of second record has correct value.');

        // get second person record
        var data = result.getAt(1);

        ok(data.sureName === 'Werler', 'Field "sureName" of third record has correct value.');
    };


    testSave();
});

