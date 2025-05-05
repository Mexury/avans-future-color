'use strict';

export default class Ingredient extends HTMLElement {
    minMixingTimeMs;
    mixingSpeed;
    color;
    texture;

    constructor() {
        super();
    }

    connectedCallback() {
        console.log(this, 'connected');
    }
    disconnectedCallback() {
        console.log(this, 'disconnected');
    }
}