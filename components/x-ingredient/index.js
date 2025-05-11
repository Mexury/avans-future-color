/** @typedef {('GRAINY'|'COARSE_GRAINY'|'SMOOTH'|'VISCOUS')} IngredientTexture */

import { Color, HSLColor, RGBColor } from '../../js/inc/Color.js';
import { generateTooltip } from '../../js/inc/Tooltip.js';

export default class Ingredient extends HTMLElement {
    static minMixingTime = 1000;
    static minMixingSpeed = 0;

    /** @type {number} Mixing time in milliseconds */
    #mixingTime = 0;

    /** @type {number} Mixing speed */
    #mixingSpeed = 1;
    
    /** @type {Color} */
    #color;

    /** @type {IngredientTexture} */
    #texture;

    get mixingTime() { return this.#mixingTime; }
    get mixingSpeed() { return this.#mixingSpeed; }
    get color() { return this.#color; }
    get texture() { return this.#texture; }

    set mixingTime(value) { this.#mixingTime = value; }
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

        // Clear all child element nodes.
        while(this.lastChild) {
            this.lastChild.remove();
        }

        this.appendChild(generateTooltip([
            {
                title: 'Mixing time',
                icon: 'clock',
                values: `${this.mixingTime} ms`
            },
            {
                title: 'Mixing speed',
                icon: 'forward',
                values: this.mixingSpeed
            },
            {
                title: 'Color',
                icon: 'swatch',
                values: [
                    this.color.colorspace,
                    ...Object.values(this.color.toJsonObject())
                ]
            },
            {
                title: 'Texture',
                icon: 'photo',
                values: this.texture
            }
        ]));
    }

    /**
     * Generate an object from the class values
     * @returns {Record<string, any>}
     */
    toJsonObject() {
        return {
            mixingTime: this.mixingTime,
            mixingSpeed: this.mixingSpeed,
            color: this.color.toJsonObject(),
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
        instance.mixingTime = object.mixingTime;
        instance.mixingSpeed = object.mixingSpeed;
        instance.color = object.colorspace === 'rgb' ? RGBColor.fromJsonObject(object.color) : HSLColor.fromJsonObject(object.color);
        instance.texture = object.texture;
        
        return instance;
    }

}

customElements.define('x-ingredient', Ingredient);