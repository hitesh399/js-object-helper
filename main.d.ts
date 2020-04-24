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
    getProp(object: object | Array<any>, props: Array<string> | string, defaultValue: any): any;

    /**
     * To delete a property from a object or array
     * @param object - Object to delete the properties in nth level
     * @param props  - property name, can array['user', 'info', 'email'] or string (user.info.email)
     */
    deleteProp(object: object | Array<any>, props: Array<string> | string): void;

    /**
     * To set property value inside a object. it does not matter, how much is it nested in a object
     *
     * @param object   - Object to set the properties in nth level
     * @param props    - property name, can array['user', 'info', 'email'] or string (user.info.email)
     * @param value    - property value
     * @param replace  - If property is already have a object, so the replace = true value will replace from new value otherwise value will merge with existing value
     */
    setProp(
        object: object | Array<any>,
        props: Array<string> | string,
        value: any,
        replace: boolean = false,
    ): any;

    /**
     *
     * @param object  - Object|Array to push the value
     * @param props   - property name - where do you want to push the value, can array['user', 'info', 'email'] or string (user.info.email),
     * @param value   - value
     * @param primaryKey - List Unique Id name:
     * @param updateIfExists - If property already has any match data with given primary key, then true to update and false = skip
     * @param loosecomparison - to compare the primaryKey value in strict mode or not. if true then operator will == otherwise ===
     */
    pushProp(
        object: object | Array<any>,
        props: Array<string> | string,
        value: Array<string> | object,
        primaryKey: string = '',
        updateIfExists: boolean = false,
        loosecomparison: boolean = true,
    ): void;

    /**
     *
     * @param object  - Object to prepend the value
     * @param props   - property name - where do you want to prepend the value, can array['user', 'info', 'email'] or string (user.info.email),
     * @param value   - value
     * @param primaryKey - List Unique Id name:
     * @param updateIfExists - If property already has any match data with given primary key, then true to update and false = skip
     * @param loosecomparison - to compare the primaryKey value in strict mode or not. if true then operator will == otherwise ===
     */
    unshiftProp(
        object: object | Array<any>,
        props: Array<string> | string,
        value: Array<string> | object,
        primaryKey: string = '',
        updateIfExists: boolean = false,
        loosecomparison: boolean = true,
    ): void;

    /**
     * To check the variable is array or not, It does not metter what value are you given in param
     *
     * @param value - any value
     */
    isArray(value: any): boolean;
    /**
     * To check the variable is object or not, It does not metter what value are you given in param
     *
     * @param value any value
     */
    isObject(value: any): boolean;

    /**
     * To check the variable is a empty object or not, It does not metter what value are you given in param
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
     * @param value - object to conver into form data
     * @param formData If want to merge  your formdata veriable you can pass it otherwise leave it null
     * @param namespace To the prefix before every key.
     */
    objectToFormData(value: object, formData: FormData | null, namespace: string = ''): FormData;
}
