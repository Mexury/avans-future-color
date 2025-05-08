'use strict';

/**
 * @template T
 * @extends Array<T>
 * */
export default class LimitedArray extends Array {

    /** @type {number} */
    #limit = 1;

    /**
     * @param {number} limit Maximum amount of items allowed.
     * @param {Array<T>?} values
     */
    constructor(limit, ...values) {
        super(...values);
        if (!Number.isInteger(limit) || limit <= 0) {
            throw new Error('Limit must be a positive integer');
        }
        this.#limit = limit;
        this.#silentlyEnforceLimit();
    }

    /**
     * Silently (without throwing an error) enforce the limit by shifting until the limit is satisfied.
     */
    #silentlyEnforceLimit() {
        while (this.length > this.#limit) {
            this.shift();
        }
    }

    /**
     * Throw an error if the limit is reached.
     */
    #enforceLimit() {
        if (this.length >= this.#limit) {
            throw new Error('Could not add entry to array. The array is full.');
        }
    }

    /**
     * Appends new elements to the end of an array, and returns the new length of the array.
     * @param {Array<T>} values New elements to add to the array.
     * @returns {number}
     * @throws Will throw an error if the array is full.
     */
    push(...values) {
        this.#enforceLimit();
        return super.push(...values);
    }

    /**
     * Inserts new elements at the start of an array, and returns the new length of the array.
     * @param {Array<T>} values Elements to insert at the start of the array.
     * @returns {number}
     * @throws Will throw an error if the array is full.
     */
    unshift(...values) {
        this.#enforceLimit();
        return super.unshift(...values);
    }

    static get [Symbol.species]() {
        return Array;
    }
}