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

/* This usage of callFromSuper isn't good because you say: call my context(this) in the super(prototype) scope
 assuming: M.Object had getInheritance: function(console.log(this.type))
 M.View = {};

 M.View = M.Object.extend({
 type: 'M.View',
 name: 'test',
 getInheritance: function() {
 console.log(this.type);
 if(this._super) {
 this.callFromSuper('getInheritance');
 }
 }
 });

 M.ButtonView = M.View.extend({
 type: 'M.ButtonView'
 });

 M.MyButtonView = M.ButtonView.extend({
 type: 'M.MyButtonView'
 });
 */