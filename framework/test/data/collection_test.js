test('M.Collection', function() {

    ok(typeof M.Collection === 'object', 'M.Collection is defined');

    TEST.Developer = M.Model.create({
        config: {
            name:   'developer',
            key:    'id',
            fields:  {
                sureName:    { type: M.CONST.TYPE.STRING,  required: YES, index: true },
                firstName:   { type: M.CONST.TYPE.STRING,  length: 200 },
                age:         { type: M.CONST.TYPE.INTEGER }
            }
        }
    });

    ok(typeof TEST.Developer === 'object', 'Developer model successfully created.');

    TEST.DeveloperCollection = M.Collection.create(TEST.Developer);

    ok(typeof TEST.DeveloperCollection === 'object', 'Developer collection successfully created.');

    /**
     * TEST: Adding records
     */

    TEST.DeveloperCollection.add({
        sureName: 'Laubach',
        firstName: 'Dominik',
        age: 27
    }).add({
        sureName: 'Hanowski',
        firstName: 'Marco',
        age: 27
    }).add({
        sureName: 'Stierle',
        firstName: 'Frank',
        age: 43
    }).add({
        sureName: 'Werler',
        firstName: 'Sebastian',
        age: 30
    }).add({
        sureName: 'Buck',
        firstName: 'Stefan',
        age: 26
    });

    ok(TEST.DeveloperCollection.getCount() === 5, 'All records were added.');

    ok(M.Model.isPrototypeOf(TEST.DeveloperCollection.getAt(0)), 'Records successfully converted to model records.');


    /**
     * TEST: Sorting
     */

    TEST.DeveloperCollection.sortBy({
        property: 'sureName',
        order: M.CONST.ORDER.DESC
    });

    var p1 = TEST.DeveloperCollection.getAt(0);
    ok(p1.get('sureName') === 'Werler', 'Records correctly sorted descending by "sureName".');

    TEST.DeveloperCollection.sortBy(function(rec1, rec2) {
        return rec1.get('age') - rec2.get('age');
    });

    p2 = TEST.DeveloperCollection.getAt(0);
    ok(p2.get('sureName') === 'Buck', 'Records correctly sorted by passed in sort function');

    /**
     * TEST: Filtering
     */

    /* filter all devs older or equal to 26 */
    TEST.DeveloperCollection.filter(function(rec) {
        return rec.get('age') >= 26;
    });

    ok(TEST.DeveloperCollection.getCount() === 5, 'Records successfully filtered. Everyone is 26 or older.');

    /* filter all devs older than 26 */
    TEST.DeveloperCollection.filter(function(rec) {
        return rec.get('age') > 26;
    });

    ok(TEST.DeveloperCollection.getCount() === 4, 'Records successfully filtered. One dev is younger than 27.');


    /**
     * TEST: chaining sort and filter
     */

    /* get the two oldest devs, older than 26 */
    TEST.DeveloperCollection.sortBy({
        property: 'age',
        order: M.CONST.ORDER.DESC
    }).filter(function(rec) {
       return rec.get('age') > 26;
    }, {
        limit: 2
    });

    var oldPerson1 = TEST.DeveloperCollection.getAt(0);
    var oldPerson2 = TEST.DeveloperCollection.getAt(1);

    ok(TEST.DeveloperCollection.getCount() === 2, 'Filter correctly applied');
    ok(oldPerson1.get('firstName') === 'Frank' && oldPerson2.get('firstName') === 'Sebastian', 'Sorting correctly applied');

});