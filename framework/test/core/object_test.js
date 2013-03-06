test('callFromSuper implementation', function() {

    /* This usage of callFromSuper is good because you say call the super function of me in my context */

    M.Person = M.Object.extend({
        firstName: 'firstNamePerson',
        lastName: 'lastNamePerson',
        getAttributeString: function() {
            return this.firstName + '_' + this.lastName;
        }
    });

    M.Student = M.Person.extend({
        firstName: 'firstNameStudent',
        lastName: 'lastNameStudent',
        id: 'idStudent'
    });

    M.Lecturer = M.Student.extend({
        firstName: 'firstNameLecturer',
        lastName: 'lastNameLecturer',
        id: 'idLecturer',
        workingId: 'workingIdDLecturer'
    });

    //M.Student.getAttributeString(); //"firstNameStudent_lastNameStudent_idStudent"
    ok(M.Student.getAttributeString() === 'firstNameStudent_lastNameStudent', 'calling implicit the super implementation without own implementation');

    //M.Lecturer.getAttributeString(); //"firstNameLecturer_lastNameLecturer_idLecturer_workingIdDLecturer"
    ok(M.Lecturer.getAttributeString() === 'firstNameLecturer_lastNameLecturer', 'calling implicit  the super super implementation without own implementation');

    M.Person = M.Object.extend({
        firstName: 'firstNamePerson',
        lastName: 'lastNamePerson',
        getAttributeString: function() {
            return this.firstName + '_' + this.lastName;
        }
    });

    M.Student = M.Person.extend({
        firstName: 'firstNameStudent',
        lastName: 'lastNameStudent',
        id: 'idStudent'
    });

    M.Lecturer = M.Student.extend({
        firstName: 'firstNameLecturer',
        lastName: 'lastNameLecturer',
        id: 'idLecturer',
        workingId: 'workingIdDLecturer',
        getAttributeString: function() {
            var s = this.callFromSuper('getAttributeString');
            return s + '_' + this.workingId;
        }
    });

    //M.Person.getAttributeString(); //"firstNamePerson_lastNamePerson"
    ok(M.Person.getAttributeString() === 'firstNamePerson_lastNamePerson', 'normal function call');

    //M.Student.getAttributeString(); //"firstNameStudent_lastNameStudent_idStudent"
    ok(M.Student.getAttributeString() === 'firstNameStudent_lastNameStudent', 'routing the implementation to the super one');

    //M.Lecturer.getAttributeString(); //"firstNameLecturer_lastNameLecturer_idLecturer_workingIdDLecturer"
    ok(M.Lecturer.getAttributeString() === 'firstNameLecturer_lastNameLecturer_workingIdDLecturer', 'calling the own implementation, then the super and the super super one');

    M.Student = M.Person.extend({
        firstName: 'firstNameStudent',
        lastName: 'lastNameStudent',
        id: 'idStudent',
        getAttributeString: function() {
            var s = this.callFromSuper('getAttributeString');
            return s + '_' + this.id.toString();
        }
    });

    M.Lecturer = M.Student.extend({
        firstName: 'firstNameLecturer',
        lastName: 'lastNameLecturer',
        id: 'idLecturer',
        workingId: 'workingIdDLecturer',
        getAttributeString: function() {
            var s = this.callFromSuper('getAttributeString');
            return s + '_' + this.workingId;
        }
    });

    //M.Person.getAttributeString(); //"firstNamePerson_lastNamePerson"
    ok(M.Person.getAttributeString() === 'firstNamePerson_lastNamePerson', 'normal function call');

    //M.Student.getAttributeString(); //"firstNameStudent_lastNameStudent_idStudent"
    ok(M.Student.getAttributeString() === 'firstNameStudent_lastNameStudent_idStudent', 'calling the own implementation, then the super one');

    //M.Lecturer.getAttributeString(); //"firstNameLecturer_lastNameLecturer_idLecturer_workingIdDLecturer"
    ok(M.Lecturer.getAttributeString() === 'firstNameLecturer_lastNameLecturer_idLecturer_workingIdDLecturer', 'calling the own implementation, then the super and the super super one');

    /* cleanup */
    M.Person = null;
    M.Student = null;
    M.Lecturer = null;
});

test('init implementation', function() {

    ok(M.Object.hasOwnProperty('init'), 'M.Object.init is defined.');

    ok(typeof M.Object.init === 'function', 'M.Object.init() is a function.');

    M.NewObject = M.Object.extend({
        LEFT: 1,
        RIGHT: 2,
        default: null,
        init: function() {
            this.default = this.RIGHT;
        }
    });

    ok(M.NewObject.default === 2, 'init() was successfully called out of extend().');

    M.NewObject = M.Object.extend({
        LEFT: 1,
        RIGHT: 2
    });

    ok(M.NewObject && typeof M.NewObject === 'object', 'no init() specified but object successfully created.');

    ok(!M.NewObject.hasOwnProperty('init'), 'no init() specified.');

    ok(Object.getPrototypeOf(M.NewObject).hasOwnProperty('init'), 'init() available via prototype.');

    /* cleanup */
    M.NewObject = null;
});

test('handleCallback implementation', function() {

    ok(M.Object.hasOwnProperty('handleCallback'), 'M.Object.handleCallback is defined.');

    ok(typeof M.Object.handleCallback === 'function', 'M.Object.handleCallback() is a function.');

    throws(M.Object.handleCallback({
        target: M.Object,
        action: 'init'
    }, [1, 2, {}, 4]), 'target is an object, action is a string, arguments is an array.');

    throws(M.Object.handleCallback({
        target: M.Object,
        action: 'init'
    }, null), 'target is an object, action is a string, arguments is null.');

    throws(M.Object.handleCallback({
        target: M.Object,
        action: 'init'
    }), 'target is an object, action is a string, arguments is undefined.');

    throws(M.Object.handleCallback({
        target: M.Object,
        action: function() {
        }
    }, [1, 2, {}, 4]), 'target is an object, action is a function, arguments is an array.');

    throws(M.Object.handleCallback({
        target: M.Object,
        action: function() {
        }
    }, null), 'target is an object, action is a function, arguments is null.');

    throws(M.Object.handleCallback({
        target: M.Object,
        action: function() {
        }
    }), 'target is an object, action is a function, arguments is undefined.');

    throws(M.Object.handleCallback({
        action: function() {
        }
    }, [1, 2, {}, 4]), 'target is undefined, action is a function, arguments is an array.');

    throws(M.Object.handleCallback({
        action: function() {
        }
    }, [1, 2, {}, 4]), 'target is undefined, action is a function, arguments is an array.');

    throws(M.Object.handleCallback({
        action: function() {
        }
    }, null), 'target is undefined, action is a function, arguments is null.');

    throws(M.Object.handleCallback({
        action: function() {
        }
    }), 'target is undefined, action is a function, arguments is undefined.');

    throws(M.Object.handleCallback({
        target: M.Object,
        action: 'undefinedMethod'
    }, [1, 2, {}, 4]), 'target is an object, action is a string (but the method is not available), arguments is an array.');

    throws(M.Object.handleCallback({
        target: M.Object,
        action: 'undefinedMethod'
    }, null), 'target is an object, action is a string (but the method is not available), arguments is null.');

    throws(M.Object.handleCallback({
        target: M.Object,
        action: 'undefinedMethod'
    }), 'target is an object, action is a string (but the method is not available), arguments is undefined.');

    throws(M.Object.handleCallback({
        target: M.UndefinedObject,
        action: 'init'
    }, [1, 2, {}, 4]), 'target is undefined, action is a string, arguments is an array.');

    throws(M.Object.handleCallback({
        target: M.UndefinedObject,
        action: 'init'
    }, null), 'target is undefined, action is a string, arguments is null.');

    throws(M.Object.handleCallback({
        target: M.UndefinedObject,
        action: 'init'
    }), 'target is undefined, action is a string, arguments is undefined.');

    throws(M.Object.handleCallback({
        target: M.UndefinedObject,
        action: 'undefinedMethod'
    }, [1, 2, {}, 4]), 'target is undefined, action is a string (but the method is not available), arguments is an array.');

    throws(M.Object.handleCallback({
        target: M.UndefinedObject,
        action: 'undefinedMethod'
    }, null), 'target is undefined, action is a string (but the method is not available), arguments is null.');

    throws(M.Object.handleCallback({
        target: M.UndefinedObject,
        action: 'undefinedMethod'
    }), 'target is undefined, action is a string (but the method is not available), arguments is undefined.');

    throws(M.Object.handleCallback(), 'No parameters given.');

    throws(M.Object.handleCallback(function() {
    }, [1, 2, 3], 'test', {test: 'yes'}), 'Stupid parameters given (function, array, string, object).');

    throws(M.Object.handleCallback({
        target: M.Object,
        action: 'type'
    }, null), 'action is a property of target, but no a function.');

    throws(M.Object.handleCallback({
        target: M.Object,
        property: 'type'
    }, null), 'action is called property.');

    throws(M.Object.handleCallback({
        prop1: M.Object,
        prop2: 'type'
    }, null), 'target/action are called prop1/prop2.');

    M.NewObject = M.Object.extend({
        test: function( a, b, c ) {
            ok((a + b + c) === 6, 'action is properly called (check within the called function).');
        }
    });
    M.Object.handleCallback({
        target: M.NewObject,
        action: 'test'
    }, 1, 2, 3);

    M.NewObject = M.Object.extend({
        test: function( a, b, c ) {
            return a + b + c;
        }
    });
    ok(M.Object.handleCallback({
        target: M.NewObject,
        action: 'test'
    }, 1, 2, 3) === 6, 'action is property called (check the return value).');

    /* cleanup */
    M.NewObject = null;
});

test('bindToCaller implementation', function() {

    ok(M.Object.hasOwnProperty('bindToCaller'), 'M.Object.bindToCaller is defined.');

    ok(typeof M.Object.bindToCaller === 'function', 'M.Object.bindToCaller() is a function.');

    M.NewObject = M.Object.extend({
        testProperty: 123,
        testMethod: function() {
            return this.testProperty
        }
    });

    ok(M.Object.bindToCaller(M.NewObject, M.NewObject.testMethod, null)() === 123, 'M.Object.bindToCaller() binds the method call properly.');

    throws(M.Object.bindToCaller(M.NewObject, 'testMethod', null), /^M.Exception.INVALID_INPUT_PARAMETER$/, M.Exception.INVALID_INPUT_PARAMETER.message);

    throws(M.Object.bindToCaller('test', M.NewObject.testMethod, null), /^M.Exception.INVALID_INPUT_PARAMETER$/, M.Exception.INVALID_INPUT_PARAMETER.message);

    throws(M.Object.bindToCaller(), /^M.Exception.INVALID_INPUT_PARAMETER$/, M.Exception.INVALID_INPUT_PARAMETER.message);

});

test('M.Object properties', function() {

    ok(M.Object.hasOwnProperty('type'), 'M.Object.type is defined.');

    ok(M.Object.type === 'M.Object', 'M.Object.type is M.Object.');

    ok(M.Object.hasOwnProperty('_lastThis'), 'M.Object._lastThis is defined.');

    ok(typeof M.Object._lastThis === 'object', 'M.Object._lastThis is an object.');
});

test('create implementation', function() {

    ok(M.Object.hasOwnProperty('create'), 'M.Object.create is defined.');

    ok(typeof M.Object.create === 'function', 'M.Object.create is a function.');

    M.TestObject = M.Object.create();

    ok(M.TestObject, 'Successfully created a Testobject');

    ok(typeof M.TestObject === 'object', 'The Testobject is an object');

    M.TestObject = M.Object.create(M.Object);

    ok(Object.getPrototypeOf(M.TestObject) === M.Object, 'The prototype of Testobject is the paramter');

    ok(M.TestObject = M.Object.create('test'), 'The prototype parameter is a string');

    ok(M.TestObject = M.Object.create([]), 'The prototype parameter is an array');

    ok(M.TestObject = M.Object.create(null), 'The prototype parameter is null');

    ok(M.TestObject = M.Object.create(undefined), 'The prototype parameter is undefined');

    M.TestObject = M.Object.create({test: 'test'});

    ok(M.TestObject.test, 'The Testobject can access the property');

    ok(!M.TestObject.hasOwnProperty(test), 'The Testobject does not the property as its own');

    M.TestObject = M.Object.create({test: function( param ) {
        ok(param === true, 'The Testobject can call a prototype function')
    }});

    M.TestObject.test(true);

    /* cleanup */
    M.TestObject = null;

});

test('defineHiddenProperty implementation', function() {

    ok(M.Object.hasOwnProperty('defineHiddenProperty'), 'M.Object.defineHiddenProperty is defined.');

    ok(typeof M.Object.defineHiddenProperty === 'function', 'M.Object.defineHiddenProperty is a function.');

    M.Object.defineHiddenProperty('hidden', 'pong');

    ok(M.Object.hasOwnProperty('hidden'), 'The test property has been created.');

    ok(!M.Object.propertyIsEnumerable('hidden'), 'The test property is not enumerable.');

    ok(M.Object.hidden === 'pong', 'The test property holds the given value.');

    M.Object.hidden = 23;

    ok(M.Object.hidden === 23, 'The test property can be changed to an other value and type.');

    M.TestObject = M.Object.extend({
        prop1: 'prop1'
    });

    ok(M.TestObject.hidden === 23, 'The test property is available in extended object.');

    ok(!M.Object.propertyIsEnumerable('hidden'), 'The test property is still not enumerable in extended object.');

    delete M.Object['hidden'];

    ok(!M.Object.hasOwnProperty('hidden'), 'The test property can be deleted.');

    M.Object.defineHiddenProperty('hidden');

    ok(M.Object.hasOwnProperty('hidden') && typeof M.Object.hidden === 'undefined', 'The test property can be undefined.');

    /* cleanup */
    delete M.Object['hidden'];
    M.TestObject = null;

});

test('defineReadonlyProperty implementation', function() {

    ok(M.Object.hasOwnProperty('defineReadonlyProperty'), 'M.Object.defineReadonlyProperty is defined.');

    ok(typeof M.Object.defineReadonlyProperty === 'function', 'M.Object.defineReadonlyProperty is a function.');

    M.Object.defineReadonlyProperty('readonly', 'pong');

    ok(M.Object.hasOwnProperty('readonly'), 'The test property has been created.');

    ok(M.Object.propertyIsEnumerable('readonly'), 'The test property is enumerable.');

    ok(M.Object.readonly === 'pong', 'The test property holds the given value.');

    M.Object.readonly = 'ping';

    ok(M.Object.readonly === 'pong', 'The test property can not be changed.');

    M.TestObject = M.Object.extend({
        prop1: 'prop1'
    });

    ok(M.TestObject.readonly === 'pong', 'The test property is available in extended object.');

    M.TestObject.readonly = 'ping';

    ok(M.TestObject.readonly === 'pong', 'The test property can still not be changed in extended object.');

    delete M.Object['readonly'];

    ok(!M.Object.hasOwnProperty('readonly'), 'The test property can be deleted.');

    M.Object.defineReadonlyProperty('readonly');

    ok(M.Object.hasOwnProperty('readonly') && typeof M.Object.hidden === 'undefined', 'The test property can be undefined.');

    /* cleanup */
    delete M.Object['readonly'];
    M.TestObject = null;

});

test('defineProperty implementation', function() {
    ok(M.Object.hasOwnProperty('defineProperty'), 'M.Object.defineProperty is defined.');

    ok(typeof M.Object.defineProperty === 'function', 'M.Object.defineProperty is a function.');

    M.Object.defineProperty('normal', 'pong');

    ok(M.Object.hasOwnProperty('normal'), 'The test property has been created.');

    ok(M.Object.propertyIsEnumerable('normal'), 'The test property is enumerable.');

    M.Object.defineProperty('readonly', 'pong', {writable: NO});

    ok(M.Object.readonly === 'pong', 'The test property holds the given value.');

    M.Object.readonly = 'ping';

    ok(M.Object.readonly === 'pong', 'The test property can not be changed.');

    M.Object.defineProperty('allNo', 'pong', {writable: NO, configurable: NO, enumerable: NO});

    ok(M.Object.allNo === 'pong', 'The test property can not be changed.');

    ok(M.Object.propertyIsEnumerable('allNo'), 'The test property is enumerable.');

    M.Object.allNo = 'ping';

    ok(M.Object.allNo === 'pong', 'The test property can not be changed.');

    var obj = M.Object.extend({
        marco: 1,
        dom: 2
    });
    obj.defineHiddenProperty('basti', 3);
    var allright = YES;
    Object.keys(obj).forEach(function(prop) {
       if(!(prop === 'marco' || prop === 'dom')) {
           allright = NO;
       }
    });
    ok(Object.keys(obj).length === ['marco', 'dom'].length && allright, 'basti is defined as a hidden property.');


    /* cleanup */
    delete M.Object['readonly'];
    delete M.Object['normal'];
    M.TestObject = null;
    obj = null;
    allright = null;
});

test('include implementation', function() {

    ok(M.Object.hasOwnProperty('include'), 'M.Object.include is defined.');

    ok(typeof M.Object.include === 'function', 'M.Object.include is a function.');

    M.Object.include({ping: 'pong'});

    ok(typeof M.Object.ping === 'string' && M.Object.ping === 'pong', 'M.Object.include included a Testobject.');

    delete M.Object.ping;

    throws(function() {
        M.Object.include({include: function() {
        }});
    }, /^M.Exception.RESERVED_WORD$/, M.Exception.RESERVED_WORD.message);

});

test('extend implementation', function() {

    ok(M.Object.hasOwnProperty('extend'), 'M.Object.extend is defined.');

    ok(typeof M.Object.extend === 'function', 'M.Object.extend is a function.');

    M.TestObject = M.Object.extend({
        prop1: 'prop1'
    });

    ok(M.TestObject.hasOwnProperty('prop1'), 'Testobject was created with own property.');

    ok(Object.getPrototypeOf(M.TestObject) === M.Object, 'The Prototype of Testobject is M.Object.');

    M.TestObject = M.Object.extend({
        prop1: 'prop1',
        init: function() {
            ok(this.prop1 === 'prop1', 'init of the testobject was called')
        }
    });

    M.TestObject = M.Object.extend({
        prop1: 'prop1',
        func: function() {
            ok(this.prop1 === 'prop1', 'Testobject has own function implementation')
        },
        init: function() {
            this.func();
        }
    });

    /* cleanup */
    M.TestObject = null;
});

