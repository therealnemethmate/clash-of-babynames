import { WatchCallback } from 'vue';

type StringValueOfObject = Extract<keyof object, string>;

/**
 * Checks if the given property is a string value of the given object.
 * @param property The property to check.
 * @returns True if the given property is a string value of the given object.
 */
function isStringValueOfObject(property: string): property is StringValueOfObject {
    return !!(property as StringValueOfObject);
}

/**
 * Checks if the given value is a string.
 * @param value The value to check.
 * @returns True if the given value is a string.
 */
export function isString(value: unknown): value is string {
    return typeof value === 'string';
}

/**
 * Creates a watcher that saves the given value to the local storage.
 * @param localStorageKey The key to use for the local storage.
 * @param key The key of the value to save.
 * @returns A watcher that saves the given value to the local storage.
 */
export function createLocalStorageWatcher(localStorageKey: string, key?: string): WatchCallback<object, object> {
    return (value?: object) => {
        if (isString(value)) {
            localStorage.setItem(localStorageKey, value);
        } else if (key && value && isStringValueOfObject(key)) {
            localStorage.setItem(localStorageKey, value[key]);
        } else if (value) {
            localStorage.setItem(localStorageKey, JSON.stringify(value));
        } else {
            localStorage.removeItem(localStorageKey);
        }
    };
}
