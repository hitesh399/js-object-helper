declare module 'js-object-helper' {
  export default JsObjectHelperInterface;
}

interface JsObjectHelperInterface {
  /**
   * To extract the value from a object or array
   *
   * @param object - Object to extract the properties in nth level
   * @param props - property name, can array['user', 'info', 'email'] or string (user.info.email)
   * @param defaultValue - if property does not exists then to assign the default value.
   */
  getProp(
    object: object | Array<any>,
    props: Array<string> | string,
    defaultValue: any
  ): any;

  /**
   * To delete a property from a object or array
   * @param object - Object to delete the properties in nth level
   * @param props  - property name, can array['user', 'info', 'email'] or string (user.info.email)
   */
  deleteProp(object: object | Array<any>, props: Array<string> | string): void;

  /**
   * To set property value inside a object. it does not matter, how much is it nested in a object
   *
   * @param object (require)   - Object to set the properties in nth level
   * @param props (require)   - property name, can array['user', 'info', 'email'] or string (user.info.email)
   * @param value (require)    - property value
   * @param replace (optional) (default=false)  - If property is already have a object, so the replace = true value will replace from new value otherwise value will merge with existing value
   */
  setProp(
    object: object | Array<any>,
    props: Array<string> | string,
    value: any,
    replace?: boolean
  ): any;

  /**
   *
   * @param object (require)  - Object|Array to push the value
   * @param props (require) - property name - where do you want to push the value, can array['user', 'info', 'email'] or string (user.info.email),
   * @param value (require)   - value
   * @param primaryKey (optional) (default='') - List Unique Id name:
   * @param updateIfExists (optional) (default=false)  - If property already has any match data with given primary key, then true to update and false = skip
   * @param loosecomparison (optional) (default=true) - to compare the primaryKey value in strict mode or not. if true then operator will == otherwise ===
   */
  pushProp(
    object: object | Array<any>,
    props: Array<string> | string,
    value: Array<string> | object,
    primaryKey?: string,
    updateIfExists?: boolean,
    loosecomparison?: boolean
  ): void;

  /**
   *
   * @param object (require)  - Object to prepend the value
   * @param props (require)  - property name - where do you want to prepend the value, can array['user', 'info', 'email'] or string (user.info.email),
   * @param value (require)  - value
   * @param primaryKey (optional) (default='')  - List Unique Id name:
   * @param updateIfExists (optional) (default=false) - If property already has any match data with given primary key, then true to update and false = skip
   * @param loosecomparison (optional) (default=true) - to compare the primaryKey value in strict mode or not. if true then operator will == otherwise ===
   */
  unshiftProp(
    object: object | Array<any>,
    props: Array<string> | string,
    value: Array<string> | object,
    primaryKey?: string,
    updateIfExists?: boolean,
    loosecomparison?: boolean
  ): void;

  /**
   * To check the variable is array or not, It does not metter what value is  given in param
   *
   * @param value - any value
   */
  isArray(value: any): boolean;
  /**
   * To check the variable is object or not, It does not metter what value is  given in param
   *
   * @param value any value
   */
  isObject(value: any): boolean;

  /**
   * To check the variable is a empty object or not, It does not metter what value is given in param
   *
   * @param value - any value
   */
  isEmptyObject(value: any): boolean;

  /**
   * To check the variable is integer or not.
   *
   * @param value - any value
   */
  isInteger(value: any): boolean;

  /**
   * To check the veraible is float or not.
   *
   * @param value - any value
   */
  isFloat(value: any): boolean;

  /**
   * To convert the url's query string data into object
   *
   * @param url - full url
   */
  queryStringToObject(url: string): object;

  /**
   * To convert the object into query string
   *
   * @param value - object to convert into query string.
   */
  objectToQueryString(value: object): string;

  /**
   * To convert the object into FormData
   *
   * @param value (require) - object to conver into form data
   * @param formData (optional) (default=null) - If want to merge  your formdata veriable you can pass it otherwise leave it null
   * @param namespace (optional) (default=) - To add prefix before every key.
   */
  objectToFormData(
    value: object,
    formData?: FormData | null,
    namespace?: string
  ): FormData;
}
