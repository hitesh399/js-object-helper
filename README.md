# js-object-helper


A sample Object class that contains some useful methods.

## npm
https://www.npmjs.com/package/js-object-helper

## Installation
```bash
$ npm install --save js-object-helper
OR
$ yarn add js-object-helper
```
### Getting started
```js
import helper from 'js-object-helper'
OR 
const helper = require('js-object-helper')
```

#### Get property value inside a object. 
```getProp(object: object | Array<any>, path: Array<string> | string, defaultValue: any)```

| param          | type                    |default        | description                                                                                 
|----------------|-------------------------|---------------|------------------------------------------------
| obj            |object/Array<any>        | Required      | To extract the property value inside it       
| path           | Array<string>/string    | Required      | Value can be array like ['user', 'info', 'email'] or string (user.info.email)
| defaultValue   | any                     | undefined     | if property does not exists then return the default value

##### Examples
```js
const arr = [{ id: 1, name: 'Test' }, { id: 2, name: 'Test 2' }];
helper.getProp(arr, '[id=1].name') // output -> Test
helper.getProp(arr, '[id>1].name') // output -> Test 2
helper.getProp(arr, '[id>=1].name') // output -> Test
helper.getProp(arr, '[id<2].name') // output -> Test
helper.getProp(arr, '[id<=2].name') // output -> Test
helper.getProp(_arr, '[id<>2].name') // output -> Test
```
```js
const arr = {
  name: 'User Name'
  info: [
          { id: 1, name: 'Test' }, 
          { id: 2, name: 'Test 2' }
        ]
 };
 helper.getProp(arr, 'info.0.id.name') // output -> Test
 helper.getProp(arr, 'info.0.id.email') // output -> undefined
 helper.getProp(arr, 'info.0.id.email', 'test@gmail.com') // output -> test@gmail.com
 helper.getProp(arr, 'info.[id==2].name') // output -> Test 2
```
#### Set property values inside object. 
```setProp(object: object | Array<any>, path: Array<string> | string, defaultValue: any, value: any, replace?: boolean)```

| param          | type                    |default        | description                                                                                 
|----------------|-------------------------|---------------|------------------------------------------------
| obj            |object/Array<any>        | Required      | To set property value in given object      
| path           | Array<string>/string    | Required      | Value can be array like ['user', 'info', 'email'] or string (user.info.email)
| value          | any                     | Required      | Value, what do you want to set at given path
| replace        | boolean                 | false         | If path existing value is object, so the replace = true  will replace from new value otherwise value will merge in existing value.

##### Examples
```js
const obj = { 
  id: 1, 
  name: 'V1', 
  children: [
              { id: 2, name: 'V11' }, 
              { id: 3, name: 'V12' }
            ]
  }
helper.setProp(obj, 'name', 'Hello')
//output ->
// {
//   id: 1,
//   name: 'Hello', // change is here
//   children: [
//         { id: 2, name: 'V11'
//         },
//         { id: 3, name: 'V12'
//         },
//     ],
// }

helper.setProp(obj, 'test', 'Hello Testing')
//output ->
// {
//   id: 1,
//   name: 'Hello',
//   test: 'Hello Testing', // change is here
//   children: [
//         { id: 2, name: 'V11'
//         },
//         { id: 3, name: 'V12'
//         },
//     ],
// }

helper.setProp(obj, '_test.0', 'Test to create array')
//output ->
// {
//   id: 1,
//   name: 'Hello',
//   _test: ['Test to create array'], // Change is here
//   test: 'Hello Testing',
//   children: [
//         { id: 2, name: 'V11'
//         },
//         { id: 3, name: 'V12'
//         },
//     ],
// }


helper.setProp(obj, 'children.0.name', 'Test Data')
//output ->
// {
//   id: 1,
//   name: 'Hello',
//   _test: ['Test to create array'],
//   test: 'Hello Testing',
//   children: [
//         { id: 2, name: 'Test Data' // Change is here
//         },
//         { id: 3, name: 'V12'
//         },
//     ],
// }

helper.setProp(obj, 'children.0', {id: 5}, true)
//output ->
// {
//   id: 1,
//   name: 'Hello',
//   _test: ['Test to create array'],
//   test: 'Hello Testing',
//   children: [
//         { id: 5}, // change is here
//         { id: 3, name: 'V12'},
//     ],
// }

helper.setProp(obj, 'children.1', {id: 6}, false)
//output ->
// {
//   id: 1,
//   name: 'Hello',
//   _test: ['Test to create array'],
//   test: 'Hello Testing',
//   children: [
//         { id: 5},
//         { id: 6, name: 'V12'}, // change is here
//     ],
// }
```
#### Delete property from a object. 
```deleteProp(object: object | Array<any>, props: Array<string> | string)```

| param          | type                    |default        | description                                                                                 
|----------------|-------------------------|---------------|------------------------------------------------
| obj            |object/Array<any>        | Required      | To delete property from given object      
| path           | Array<string>/string    | Required      | Value can be array like ['user', 'info', 'email'] or string (user.info.email)
```js
  
const obj = { 
 id: 1, 
 name: 'V1', 
 children: [
             { id: 2, name: 'V11' }, 
             { id: 3, name: 'V12' }
           ]
 }
helper.deleteProp(obj, 'children.*.name');
//output ->
// {
//   id: 1,
//   name: 'Hello',
//   children: [
//         { id: 2}, // change is here
//         { id: 3} // change is here
//     ],
// }
helper.deleteProp(obj, 'name');
//output ->
// {
//   id: 1,
//   children: [
//         { id: 2},
//         { id: 3} 
//     ],
// }

helper.deleteProp(obj, 'children');
//output ->
// {
//   id: 1
// }


helper.deleteProp(obj, 'test_not_object');
//output ->
// {
//   id: 1
// }
```

