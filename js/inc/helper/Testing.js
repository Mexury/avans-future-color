'use strict';

import { isBetween } from './Math.js';

/**
 * Check whether or not a numeric value is within the specified range.
 * @param {string} name
 * @param {number} value 
 * @param {number} min 
 * @param {number} max 
 */
export function expectBetween(name, value, min, max) {
    if (!isBetween(value, min, max)) {
        throw new Error(`Invalid value for ${name}. Expected a numeric value between ${min} and ${max}, got ${value}`)
    }
}

/**
 * Throw an error if the type is not as expected.
 * @param {string} name
 * @param {any} value 
 * @param {string} expectedType
 * @throws {Error}
 */
export function expectType(name, value, expectedType) {
    if (typeof value !== expectedType) {
        throw new Error(`Invalid type for ${name}. Expected ${expectType}, got ${typeof value}`)
    }
}