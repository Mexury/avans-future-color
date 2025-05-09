/** @typedef {('GRAINY'|'COARSE_GRAINY'|'SMOOTH'|'VISCOUS')} IngredientTexture */

import { Color, HSLColor, RGBColor } from '../../js/inc/Color.js';

export default class Ingredient extends HTMLElement {

    /** @type {number} Minimum mixing time in milliseconds */
    #minMixingTime = 0;

    /** @type {number} Mixing speed */
    #mixingSpeed = 1;
    
    /** @type {Color} */
    #color;

    /** @type {IngredientTexture} */
    #texture;

    get minMixingTime() { return this.#minMixingTime; }
    get mixingSpeed() { return this.#mixingSpeed; }
    get color() { return this.#color; }
    get texture() { return this.#texture; }

    set minMixingTime(value) { this.#minMixingTime = value; }
    set mixingSpeed(value) { this.#mixingSpeed = value; }
    set color(value) {
        this.#color = value;
        this.style.setProperty('--background-color', `${value.colorspace}(${value})`);
    }
    set texture(value) {
        this.#texture = value;
        this.setAttribute('texture', value);
    }

    constructor() {
        super();
    }

    connectedCallback() {
        this.draggable = true;

        this.addEventListener('dragstart', e => {
            e.dataTransfer.setData(
                'future-color/ingredient',
                JSON.stringify(this.toJsonObject())
            );
        });
    }

    /**
     * Generate an object from the class values
     * @returns {Record<string, any>}
     */
    toJsonObject() {
        return {
            minMixingTime: this.minMixingTime,
            mixingSpeed: this.mixingSpeed,
            color: this.#color.toJsonObject(),
            colorspace: this.color.colorspace,
            texture: this.texture
        }
    }

    /**
     * Generate a class instance based on the supplied object
     * @param {Record<string, any>} object
     * @returns {Ingredient}
     */
    static fromJsonObject(object) {
        if (!object) return;
        
        const instance = new Ingredient();
        instance.minMixingTime = object.minMixingTime;
        instance.mixingSpeed = object.mixingSpeed;
        instance.color = object.colorspace === 'rgb' ? RGBColor.fromJsonObject(object.color) : HSLColor.fromJsonObject(object.color);
        instance.texture = object.texture;
        
        return instance;
    }

}

customElements.define('x-ingredient', Ingredient);