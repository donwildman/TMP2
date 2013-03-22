test('M.Model', function() {

    ok(typeof M.Model === 'object', 'M.Model is defined.');

    var testModel = M.Model.create({
        config: {
            name:   'name',
            key:    'id',
            fields:  {
                id:        { type: M.TYPE_INTEGER, length: 255 },
                title:     { type: M.TYPE_STRING, length: 255 },
                content:   { type: M.TYPE_TEXT },
                date:      { type: M.TYPE_DATE,    default: new Date() },
                published: { type: M.TYPE_BOOLEAN, default: false, index: true }
            }
        }
    });

    ok(typeof testModel === 'object', 'testModel could be created.');

});