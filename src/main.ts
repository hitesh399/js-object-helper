// eslint-disable-next-line no-useless-escape
const matchArrayKey = /^\[+([0-9a-z]+)+([\=\>\<]+)+(.+)\]$/i;

class JsObjectHelper {
    private getObjectFromArray(obj: Array<{ [key: string]: any }>, prop: string): any {
        const arrayKey = prop.match(matchArrayKey);
        if (arrayKey && this.isArray(obj)) {
            const key = arrayKey[1];
            const operator = arrayKey[2];
            const value = arrayKey[3];
            let item = null;
            obj.every(function (itm) {
                if (itm[key] !== undefined) {
                    const val = itm[key].toString();
                    if (
                        (operator === '=' && val == value) ||
                        (operator === '>=' && val >= value) ||
                        (operator === '>' && val > value) ||
                        (operator === '<' && val < value) ||
                        (operator === '<=' && val <= value) ||
                        ((operator === '<>' || operator === '!=') && val != value)
                    ) {
                        item = itm;
                        return false;
                    } else {
                        return true;
                    }
                }
                return true;
            });
            return item;
        }
        return null;
    }
    /*
	 |----------------------------------------------
	 | To get the value of key from the given object
	 |----------------------------------------------
	 * @param obj => Object
	 * @param props => String, Array, [Object key path],
	 * @param defaultValue => Any, If the key does not exists in object then return the default value.
	 */
    public getProp(obj: any, props: any, defaultValue: any = undefined): any {
        props = typeof props === 'string' ? props.split('.') : props;
        let prop = props.shift();
        const objInArray = this.getObjectFromArray(obj, prop);
        if (objInArray !== null) {
            obj = objInArray;
            prop = props.shift();
        }
        if (!obj || obj[prop] === undefined || !props.length) {
            return !obj || obj[prop] === undefined ? defaultValue : obj[prop];
        }
        return this.getProp(obj[prop], props, defaultValue);
    }
    /*
	 |------------------------------------------------
	 | To delete the key from the given object
	 |-----------------------------------------------
	 * @param obj => Object
	 * @param props => String, Array, [Object key path],
	 */

    public deleteProp(obj: any, props: any): void {
        props = typeof props === 'string' ? props.split('.') : props;

        const prop = props.shift();

        if (!obj[prop] && prop !== '*') {
            return;
        }

        if (prop === '*') {
            obj.forEach((val: any, index: number) => {
                this.deleteProp(obj, [index].concat(props));
            });
        } else {
            if (props.length === 1 && this.isInteger(props[0])) {
                obj[prop].splice(parseInt(props[0]), 1);
                Object.assign(obj, { [prop]: obj[prop].slice() });
                return;
            } else if (!props.length) {
                delete obj[prop];
                Object.assign(obj);
                return;
            }
            this.deleteProp(obj[prop], props);
        }
    }
    /*
	 |----------------------------------------------
	 | To set the value of key in the given object
	 |----------------------------------------------
	 * @param obj => Object
	 * @param props => String, Array, [Object key path],
	 * @param value => Any, [key value]
	 */
    public setProp(obj: any, props: any, value: any, replace: boolean = false): any {
        props = typeof props === 'string' ? props.split('.') : props;

        const prop = props.shift();

        if (!obj[prop]) {
            Object.assign(obj, { [prop]: props.length >= 1 && this.isInteger(props[0]) ? [] : {} });
        }
        if (!props.length) {
            if (this.isObject(value) && replace === false) {
                let preValue = obj[prop] ? obj[prop] : {};
                Object.assign(obj, { [prop]: Object.assign(preValue, value) });
            } else {
                // Vue.set(obj, prop, value);
                Object.assign(obj, { [prop]: value });
            }

            return;
        }
        this.setProp(obj[prop], props, value, replace);
    }

    private _arrUpdate(
        obj: any,
        props: any,
        value: any,
        listUniqueKeyName: string = '',
        updateIfExists: boolean = true,
        loosecomparison: boolean = true,
        addAction: string = 'push',
    ) {
        props = typeof props === 'string' ? props.split('.') : props;
        // Convert the value into Array
        value = !this.isArray(value) ? [value] : value;
        const prop = props.shift();

        if (!obj[prop]) {
            Object.assign(obj, {
                [prop]:
                    (props.length >= 1 && this.isInteger(props[0])) || props.length === 0 ? [] : {},
            });
        }
        if (!props.length) {
            let items = obj[prop];
            value.forEach(function (v: any) {
                let isAlreadyPresent = null;

                if (listUniqueKeyName) {
                    items.every((fi: any) => {
                        if (
                            (loosecomparison && fi[listUniqueKeyName] == v[listUniqueKeyName]) ||
                            (!loosecomparison && fi[listUniqueKeyName] === v[listUniqueKeyName])
                        ) {
                            isAlreadyPresent = true;
                            if (updateIfExists) {
                                Object.assign(fi, v);
                            }
                            return false;
                        }
                        return true;
                    });
                }

                if (isAlreadyPresent === null) {
                    if (addAction === 'push') {
                        items.push(v);
                    } else {
                        items.unshift(v);
                    }
                }
            });
            Object.assign(obj, {
                [prop]: items.slice(),
            });
            return;
        }

        this._arrUpdate(
            obj[prop],
            props,
            value,
            listUniqueKeyName,
            updateIfExists,
            loosecomparison,
            addAction,
        );
    }
    /*
	 |----------------------------------------------
	 | To push the value into the Array
	 |----------------------------------------------
	 * @param obj => Object
	 * @param props => String, Array, [Object key path],
	 * @param value => Array | Object | String,
	 * @param listUniqueKeyName => String, If you want to check the unique object before adding.
	 */
    public pushProp(
        obj: any,
        props: any,
        value: any,
        listUniqueKeyName: string = '',
        updateIfExists: boolean = false,
        loosecomparison: boolean = true,
    ): void {
        this._arrUpdate(
            obj,
            props,
            value,
            listUniqueKeyName,
            updateIfExists,
            loosecomparison,
            'push',
        );
    }
    /*
	 |----------------------------------------------
	 | To unshift the value into the Array
	 |----------------------------------------------
	 * @param obj => Object
	 * @param props => String, Array, [Object key path],
	 * @param value => Array | Object | String,
	 * @param listUniqueKeyName => String, If you want to check the unique object before adding.
	 */
    public unshiftProp(
        obj: any,
        props: any,
        value: any,
        listUniqueKeyName: string = '',
        updateIfExists: boolean = false,
        loosecomparison = true,
    ): void {
        this._arrUpdate(
            obj,
            props,
            value,
            listUniqueKeyName,
            updateIfExists,
            loosecomparison,
            'unshift',
        );
    }
    /*
	 |------------------
	 | To check the given object'constructor is array or not
	 |-----------------------------------------
	 * @param value => Object
	 */
    public isArray(value: any): boolean {
        return !!value && typeof value === 'object' && value.constructor === Array;
    }
    /*
	 |------------------
	 | To check the given object'constructor is Object or not
	 |-----------------------------------------
	 * @param value => Object
	 */
    public isObject(value: any): boolean {
        return !!value && typeof value === 'object' && value.constructor === Object;
    }
    public isEmptyObject(value: any) {
        return !this.isObject(value) || Object.keys(value).length === 0;
    }
    /*
	 |------------------
	 | To check the given string contains only number or not
	 |-----------------------------------------
	 * @param value => String
	 */
    public isInteger(value: any): boolean {
        let regex = new RegExp(/^[0-9]+$/);
        return regex.test(value);
    }
    /*
	 |------------------
	 | To check the given string contains a valid float number
	 |-----------------------------------------
	 * @param value => String
	 */
    public isFloat(value: any): boolean {
        let regex = new RegExp(/^-?\d*(\.\d+)$/);
        return regex.test(value);
    }
    /**
     * Covert Query string to Object
     */
    public queryStringToObject(url: string): object {
        let params: object = {};

        let parser = document.createElement('a');
        parser.href = url;
        let query = parser.search.substring(1);
        let vars = query.split('&');
        for (let i = 0; i < vars.length; i++) {
            let pair = vars[i].split('=');
            let key: string = decodeURIComponent(pair[0]);
            let value = decodeURIComponent(pair[1]);
            if (key.indexOf('[') !== -1) {
                key = key.split('[').join('.').split(']').join('.').split('..').join('.');
                const lastIndex = key.lastIndexOf('.');
                if (lastIndex !== -1) {
                    key = key.substr(0, lastIndex);
                    this.setProp(params, key, value);
                }
            } else {
                this.setProp(params, key, value, true);
            }
        }
        return params;
    }
    /**
     * Convert Query Object to Query String
     * @param obj
     * @param prefix
     */
    public objectToQueryString(obj: object, prefix: string = ''): string {
        let str = [],
            p;

        for (p in obj) {
            if (obj.hasOwnProperty(p.toString())) {
                let k = prefix ? prefix + '[' + p + ']' : p,
                    v = this.getProp(obj, p);
                str.push(
                    v !== null && typeof v === 'object'
                        ? this.objectToQueryString(v, k)
                        : encodeURIComponent(k) + '=' + encodeURIComponent(v ? v : ''),
                );
            }
        }
        return str.join('&');
    }
    /**
     * To Convert the Object into formData.
     * @param {Object} obj
     * @param {FormData} form
     * @param {String} namespace
     */
    public objectToFormData(
        obj: any,
        form: FormData | null = null,
        namespace: string = '',
    ): FormData {
        let fd = form || new FormData();
        let formKey;

        for (let property in obj) {
            if (obj.hasOwnProperty(property)) {
                if (namespace) {
                    formKey = namespace + '[' + property + ']';
                } else {
                    formKey = property;
                }

                // if the property is an object, but not a File, use recursivity.
                if (obj[property] instanceof Date) {
                    fd.append(formKey, obj[property].toISOString());
                } else if (
                    typeof obj[property] === 'object' &&
                    !(obj[property] instanceof File) &&
                    !(obj[property] instanceof Blob)
                ) {
                    this.objectToFormData(obj[property], fd, formKey);
                } else {
                    // if it's a string or a File object
                    if (obj[property] instanceof Blob && obj[property]) {
                        fd.append(formKey, obj[property], obj[property].name);
                    } else if (obj[property] !== undefined) {
                        fd.append(formKey, obj[property]);
                    }
                }
            }
        }

        return fd;
    }
    /**
     * This function mostly use to rearrange the  object's index base on the delete element
     * @param obj => Object
     * @param elementName => element name which is going to delete.
     */
    public reArrangeObjectIndex(obj: any, elementName: any): any {
        let errors = JSON.parse(JSON.stringify(obj));

        const errorKeys = Object.keys(errors);
        let hasChangedInError = false;

        let elementArr = elementName.split('.');
        let elementLastIndex = elementArr[elementArr.length - 1];
        let isLastIndexInteger = this.isInteger(elementLastIndex);
        let lastIndex = isLastIndexInteger ? parseInt(elementLastIndex) : null;
        let elementPath = elementArr.slice(0, -1).join('.');
        const regex = new RegExp('(' + elementPath + '.)+[0-9]+');

        errorKeys.forEach(function (item) {
            // If the Parent Element's error is deleting then deleting all the child element errors also.
            // If the element contains the number in end of name then search the child element index and process to deleting.
            if (item.indexOf(elementName) === 0) {
                delete errors[item];
                hasChangedInError = true;
            }

            //if deleting the Array element's Error then reArrange the errors indexing..
            let elementNextIndex: any = regex.exec(item);

            if (lastIndex !== null && elementNextIndex) {
                const elValueWithIndex = elementNextIndex[1];
                const elementNameWithKey = elementNextIndex[0];
                elementNextIndex[0].replace(elValueWithIndex, '');
                elementNextIndex = parseInt(elementNextIndex[0].replace(elementNextIndex[1], ''));
                if (elementNextIndex > lastIndex) {
                    const newIndex = elementNextIndex - 1;
                    const oldIndexVal = errors[item];
                    const newItemIndex = item.replace(
                        elementNameWithKey,
                        elValueWithIndex + newIndex,
                    );

                    delete errors[item];
                    errors[newItemIndex] = oldIndexVal;
                    hasChangedInError = true;
                }
            }
        });

        return hasChangedInError ? errors : null;
    }
}

/**
 * To the check the select file is an image.
 * @param {String} dataURL
 */
export function isImage(dataURL: string) {
    try {
        const mimeType = dataURL.split(',')[0].split(':')[1].split(';')[0];
        return !!mimeType.match('image.*');
    } catch (e) {
        return false;
    }
}
/**
 * To get the file extension.
 * @param {String} name
 */
export function getFileExt(name: string) {
    let nameArr = name.split('.');
    return nameArr[nameArr.length - 1];
}
/**
 * To verify the file Extensions
 * @param {Array} acceptedFiles
 * @param {File Instance} file
 */
export function checkFileExtensions(acceptedFiles: string[], file: File) {
    const fileName = file.name;
    const fileType = file.type;
    let isValid = false;
    acceptedFiles.forEach(function (requiredFileType) {
        if (requiredFileType.startsWith('.')) {
            let ext = getFileExt(fileName);
            let patt = new RegExp(requiredFileType.replace('.', ''), 'gmi');

            if (patt.test(ext) === true) {
                isValid = true;
            }
        } else {
            let matchWith = requiredFileType;
            let patt: RegExp;

            if (requiredFileType.endsWith('*')) {
                matchWith.slice(0, -1);
                patt = new RegExp('^' + matchWith, 'gmi');
            } else {
                patt = new RegExp(matchWith, 'gmi');
            }

            if (patt.test(fileType) === true) {
                isValid = true;
            }
        }
    });

    return isValid;
}

const jsObjectHelper = new JsObjectHelper();

export default jsObjectHelper;
