import main, { getFileExt, checkFileExtensions, isImage } from '../../dist/index';

test('find key in array[test getProp]', () => {
    const _arr = [
        { id: 1, name: 'Hitesh' },
        { id: 2, name: 'Hitesh Kumar' },
    ];
    const test1 = main.getProp(_arr, '[id=1].name');
    expect(test1).toBe('Hitesh');

    const test2 = main.getProp(_arr, '[id>1].name');
    expect(test2).toBe('Hitesh Kumar');
    const test3 = main.getProp(_arr, '[id>=1].name');
    expect(test3).toBe('Hitesh');

    const test4 = main.getProp(_arr, '[id<2].name');
    expect(test4).toBe('Hitesh');

    const test5 = main.getProp(_arr, '[id<=2].name');
    expect(test5).toBe('Hitesh');

    const test6 = main.getProp(_arr, '[id<>2].name');
    expect(test6).toBe('Hitesh');

    const _arr1 = {
        name: 'Hitesh Kumar',
        test1: _arr,
    };

    const test7 = main.getProp(_arr1, 'test1.[id=1].name');
    expect(test7).toBe('Hitesh');

    const test8 = main.getProp(_arr1, 'test1.1.name');
    expect(test8).toBe('Hitesh Kumar');

    const test9 = main.getProp(_arr, '[id>2].name');
    expect(test9).toBeUndefined();

    const _arr2 = ['Hitesh', { id: 2, name: 'Hitesh Kumar' }];
    const test10 = main.getProp(_arr2, '[id=2].name');
    expect(test10).toBe('Hitesh Kumar');
});

test('Set Value in Object[test setProp]', () => {
    let test_collection1 = {
        id: 1,
        name: 'Hitesh',
        child: [
            { id: 2, name: 'Hitesh2' },
            { id: 3, name: 'Hitesh3' },
        ],
    };

    main.setProp(test_collection1, 'name', 'Helllo');
    expect(test_collection1.name).toBe('Helllo');

    // If try to Assign a prop value and prop in not exist in collection
    main.setProp(test_collection1, 'test', 'Helllo');
    expect(test_collection1.test).toBe('Helllo');

    // Assign a value in array and array element does'nt exists

    main.setProp(test_collection1, '_test.0', 'Helllo');
    expect(test_collection1._test[0]).toBe('Helllo');

    // Assign a Relace object Value
    main.setProp(test_collection1, 'child.0', { test: 'Test1' }, true);
    expect(test_collection1.child[0].test).toBe('Test1');
    expect(test_collection1.child[0].name).toBe(undefined);

    // Assign  a object Value and merging
    main.setProp(test_collection1, 'child.1', { test: 'Test1' });
    expect(test_collection1.child[1].test).toBe('Test1');
    expect(typeof test_collection1.child[1].name).toBe('string');

    // Assign a object into key but key does'nt exists in Object
    main.setProp(test_collection1, 'child2', { test: 'Test1' });
    expect(test_collection1.child2.test).toBe('Test1');

    // Preset value not object
    main.setProp(test_collection1, 'name', { test: 'Test1' }, true);
    expect(typeof test_collection1.name).toBe('object');
    expect(test_collection1.name.test).toBe('Test1');
});

test('Set Value in Object[test setProp]', () => {
    let test_collection = {
        id: 1,
        name: 'Hitesh',
        child: [
            { id: 2, name: 'Hitesh2' },
            { id: 3, name: 'Hitesh3' },
        ],
    };
    main.deleteProp(test_collection, 'child.*');
    expect(test_collection.child[0]).toBe(undefined);
    expect(test_collection.child[1]).toBe(undefined);

    let test_collection1 = {
        id: 1,
        name: 'Hitesh',
        child: [
            { id: 2, name: 'Hitesh2' },
            { id: 3, name: 'Hitesh3' },
        ],
    };
    main.deleteProp(test_collection1, 'child.*.name');
    expect(test_collection1.child[0].name).toBe(undefined);
    expect(test_collection1.child[1].name).toBe(undefined);

    let test_collection2 = {
        id: 1,
        name: 'Hitesh',
        child: [
            { id: 2, name: 'Hitesh2' },
            { id: 3, name: 'Hitesh3' },
        ],
    };
    main.deleteProp(test_collection2, 'child.1');
    expect(test_collection2.child[1]).toBe(undefined);

    let test_collection3 = {
        id: 1,
        name: 'Hitesh',
        child: [
            { id: 2, name: 'Hitesh2' },
            { id: 3, name: 'Hitesh3' },
        ],
    };
    main.deleteProp(test_collection3, '_child');
    expect(test_collection3).toBe(test_collection3);
});

test('Test [pushProp]', () => {
    let test_collection = {
        id: 1,
        name: 'Hitesh',
        nasted: {
            child: [
                { id: 1, name: 'Hitesh2' },
                { id: 2, name: 'Hitesh3' },
            ],
        },
    };
    main.pushProp(test_collection, 'nasted.child', { id: 3, name: 'Hitesh Kumar' });
    expect(test_collection.nasted.child.length).toBe(3);
    expect(test_collection.nasted.child[2].id).toBe(3);

    // When Object Already in Collection then skip
    main.pushProp(test_collection, 'nasted.child', { id: 3, name: 'Hitesh Kumar 2' }, 'id');
    expect(test_collection.nasted.child.length).toBe(3);
    expect(test_collection.nasted.child[2].name).toBe('Hitesh Kumar');

    // When Object Already in Collection then Update the Object
    main.pushProp(test_collection, 'nasted.child', { id: 3, name: 'Hitesh Kumar 2' }, 'id', true);
    expect(test_collection.nasted.child.length).toBe(3);
    expect(test_collection.nasted.child[2].name).toBe('Hitesh Kumar 2');

    // When Object Already but Data type is diffrent
    main.pushProp(
        test_collection,
        'nasted.child',
        { id: '3', name: 'Hitesh Kumar 3' },
        'id',
        true,
        false,
    );
    expect(test_collection.nasted.child.length).toBe(4);
    expect(test_collection.nasted.child[3].name).toBe('Hitesh Kumar 3');

    // Push when Index does'nt exists in object.
    main.pushProp(test_collection, 'nasted.children', { id: 1, name: 'Hitesh Kumar 3' });
    expect(test_collection.nasted.children.length).toBe(1);
    expect(test_collection.nasted.children[0].name).toBe('Hitesh Kumar 3');
});

test('Test [unshiftProp]', () => {
    let test_collection = {
        id: 1,
        name: 'Hitesh',
        nasted: {
            child: [
                { id: 1, name: 'Hitesh2' },
                { id: 2, name: 'Hitesh3' },
            ],
        },
    };
    main.unshiftProp(test_collection, 'nasted.child', { id: 3, name: 'Hitesh Kumar' });
    expect(test_collection.nasted.child.length).toBe(3);
    expect(test_collection.nasted.child[0].id).toBe(3);

    // When Object Already in Collection then skip
    main.unshiftProp(test_collection, 'nasted.child', { id: 3, name: 'Hitesh Kumar 2' }, 'id');
    expect(test_collection.nasted.child.length).toBe(3);
    expect(test_collection.nasted.child[0].name).toBe('Hitesh Kumar');

    // When Object Already in Collection then Update the Object
    main.unshiftProp(
        test_collection,
        'nasted.child',
        { id: 3, name: 'Hitesh Kumar 2' },
        'id',
        true,
    );
    expect(test_collection.nasted.child.length).toBe(3);
    expect(test_collection.nasted.child[0].name).toBe('Hitesh Kumar 2');

    // When Object Already but Data type is diffrent
    main.unshiftProp(
        test_collection,
        'nasted.child',
        { id: '3', name: 'Hitesh Kumar 3' },
        'id',
        true,
        false,
    );
    expect(test_collection.nasted.child.length).toBe(4);
    expect(test_collection.nasted.child[0].name).toBe('Hitesh Kumar 3');

    // Push when Index does'nt exists in object.
    main.unshiftProp(test_collection, 'nasted.children', { id: 1, name: 'Hitesh Kumar 3' });
    expect(test_collection.nasted.children.length).toBe(1);
    expect(test_collection.nasted.children[0].name).toBe('Hitesh Kumar 3');
});
test('Test [isArray]', () => {
    expect(main.isArray(undefined)).toBe(false);
    expect(main.isArray(null)).toBe(false);
    expect(main.isArray('')).toBe(false);
    expect(main.isArray([])).toBe(true);
    expect(main.isArray({})).toBe(false);
});

test('Test [isObject]', () => {
    expect(main.isObject(undefined)).toBe(false);
    expect(main.isObject('')).toBe(false);
    expect(main.isObject(null)).toBe(false);
    expect(main.isObject({})).toBe(true);
    expect(main.isObject([])).toBe(false);
});

test('Test [isEmptyObject]', () => {
    expect(main.isEmptyObject(undefined)).toBe(true);
    expect(main.isEmptyObject('')).toBe(true);
    expect(main.isEmptyObject(null)).toBe(true);
    expect(main.isEmptyObject({})).toBe(true);
    expect(main.isEmptyObject([])).toBe(true);
});

test('Test [isInteger]', () => {
    expect(main.isInteger(1)).toBe(true);
    expect(main.isInteger('1')).toBe(true);
    expect(main.isInteger('1.23')).toBe(false);
    expect(main.isInteger(1.23)).toBe(false);
    expect(main.isInteger('1e')).toBe(false);
});

test('Test [isFloat]', () => {
    expect(main.isFloat(1)).toBe(false);
    expect(main.isFloat('1')).toBe(false);
    expect(main.isFloat('1.23')).toBe(true);
    expect(main.isFloat('1.23.232.24')).toBe(false);
    expect(main.isFloat(1.23)).toBe(true);
    expect(main.isFloat(1.00424324)).toBe(true);
    expect(main.isFloat(0.00424324)).toBe(true);
    expect(main.isFloat(-0.00424324)).toBe(true);
    expect(main.isFloat('1e')).toBe(false);
});
test('Test Query String', () => {
    //queryStringToObject
    let test_collection = {
        id: 1,
        name: 'Hi[te].*sh',
        child: [
            { id: 1, name: 'Hite%6&2[sh2' },
            { id: 2, name: 'Hitesh3' },
        ],
    };
    const query = 'http://localhost?' + main.objectToQueryString(test_collection);
    const output = main.queryStringToObject(query);

    expect(output.id == test_collection.id).toBe(true);
    expect(output.name == test_collection.name).toBe(true);
    expect(output.child[0].id == test_collection.child[0].id).toBe(true);
    expect(output.child[0].name == test_collection.child[0].name).toBe(true);

    expect(output.child[1].id == test_collection.child[1].id).toBe(true);
    expect(output.child[1].name == test_collection.child[1].name).toBe(true);
});

test('test objectToFormData', () => {
    let test_collection = {
        id: 1,
        name: 'Hi[te].*sh',
        date: new Date(),
        fileblob: new Blob(),
        file: new File([new Blob()], 'asda.png'),
        child: [
            { id: 1, name: 'Hite%6&2[sh2' },
            { id: 2, name: 'Hitesh3' },
        ],
    };
    const formData = main.objectToFormData(test_collection);
    formData.forEach((value, key) => {
        let originalValue = main.getProp(test_collection, makeNastedKey(key));
        if (originalValue instanceof Date) {
            originalValue = originalValue.toISOString();
        }
        if (!(originalValue instanceof File || originalValue instanceof Blob)) {
            expect(originalValue == value).toBe(true);
        }
    });
});

// { 'address.0.name': 'Address1' }
test('test reArrangeObjectIndex', () => {
    const obj = {
        'address.0.name': 'Address1',
        'address.0.line1': 'Address1',

        'address.1.name': 'Address2',
        'address.1.line1': 'Address2',
        'address.2.name': 'Address3',
        'address.2.line1': 'Address3',
    };
    expect(main.reArrangeObjectIndex(obj, 'address.5')).toBe(null);

    const output = main.reArrangeObjectIndex(obj, 'address.1');
    expect(Object.keys(output).length).toBe(4);

    expect(output[Object.keys(output)[2]]).toBe('Address3');
    expect(output[Object.keys(output)[3]]).toBe('Address3');
    expect(Object.keys(output)[2]).toBe('address.1.name');
    expect(Object.keys(output)[3]).toBe('address.1.line1');
});

test('Test File Ext', () => {
    expect(getFileExt('sjhfsd.fdsfsd.png')).toBe('png');
    expect(getFileExt('sjhfsd.png')).toBe('png');
});
test('Test [checkFileExtensions]', () => {
    expect(checkFileExtensions(['image/*', '.png', 'image/jpeg'], fakeFile())).toBe(true);
});

test('Test isImage', () => {
    expect(isImage('asdasadad')).toBe(false);
    expect(
        isImage(
            'data:image/gif;base64,R0lGODlhDwAPAKECAAAAzMzM/////wAAACwAAAAADwAPAAACIISPeQHsrZ5ModrLlN48CXF8m2iQ3YmmKqVlRtW4MLwWACH+H09wdGltaXplZCBieSBVbGVhZCBTbWFydFNhdmVyIQAAOw==',
        ),
    ).toBe(true);
});

function makeNastedKey(key) {
    if (key.indexOf('[') !== -1) {
        key = key.split('[').join('.').split(']').join('.').split('..').join('.');
        const lastIndex = key.lastIndexOf('.');
        if (lastIndex !== -1) {
            key = key.substr(0, lastIndex);
        }
    }
    return key;
}

function fakeBlob() {
    return new Blob(
        [
            'data:image/gif;base64,R0lGODlhDwAPAKECAAAAzMzM/////wAAACwAAAAADwAPAAACIISPeQHsrZ5ModrLlN48CXF8m2iQ3YmmKqVlRtW4MLwWACH+H09wdGltaXplZCBieSBVbGVhZCBTbWFydFNhdmVyIQAAOw==',
        ],
        { type: 'image/jpeg' },
    );
}

function fakeFile() {
    return new File([fakeBlob()], 'test.png', { type: 'image/jpeg' });
}
