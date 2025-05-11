'use strict';

import { expectBetween, expectType } from './helper/Testing.js';
import { HSLToRGB, RGBToHSL } from './helper/Math.js';

/** @abstract */
export class Color {
    get colorspace() { return null; }

    constructor() {
        if (this.constructor === Color) {
            throw new Error('Abstract classes can\'t be instantiated.');
        }
    }

    static getAverage(...colors) {
        let red = 0,
            green = 0,
            blue = 0;

        colors.forEach(color => {
            let rgbColor;
            
            if (color instanceof RGBColor) {
                rgbColor = color;
            } else
            if (color instanceof HSLColor) {
                rgbColor = color.toRGB();
            }
            if (!rgbColor) return;
            red += rgbColor.red;
            green += rgbColor.green;
            blue += rgbColor.blue;
        })

        red /= colors.length;
        green /= colors.length;
        blue /= colors.length;
        
        return new RGBColor(
            Math.floor(red),
            Math.floor(green),
            Math.floor(blue)
        );
    }

    toString() {
        throw new Error('Method not implemented.');
    }

}

export class RGBColor extends Color {
    get colorspace() { return 'rgb'; }

    /** @type {number} */
    #red = 0;

    /** @type {number} */
    #green = 0;

    /** @type {number} */
    #blue = 0;

    get red() { return this.#red; }
    get green() { return this.#green; }
    get blue() { return this.#blue; }

    /**
     * Define a color based on the RGB format.
     * @param {number} red Number from 0-255 (default: 0)
     * @param {number} green Number from 0-255 (default: 0)
     * @param {number} blue Number from 0-255 (default: 0)
     */
    constructor(red, green, blue) {
        super();
        expectType('red', red, 'number');
        expectType('green', green, 'number');
        expectType('blue', blue, 'number');
        expectBetween('red', red, 0, 255);
        expectBetween('green', green, 0, 255);
        expectBetween('blue', blue, 0, 255);

        this.#red = red;
        this.#green = green;
        this.#blue = blue;
    }

    toString() {
        return `${this.red}, ${this.green}, ${this.blue}`;
    }

    /**
     * Convert a color from RGB color space to HSL color space.
     * @returns {HSLColor}
     */
    toHSL() {
        const { hue, saturation, lightness } = RGBToHSL(this.red, this.green, this.blue);
        return new HSLColor(hue, saturation, lightness);
    }

    /**
     * Generate an object from the class values
     * @returns {Record<string, any>}
     */
    toJsonObject() {
        return {
            red: this.red,
            green: this.green,
            blue: this.blue
        }
    }

    /**
     * Generate a class instance based on the supplied object
     * @param {Record<string, any>} object
     * @returns {RGBColor}
     */
    static fromJsonObject(object) {
        if (!object) return;
        return new RGBColor(object.red, object.green, object.blue);
    }

}

export class HSLColor extends Color {
    get colorspace() { return 'hsl'; }

    /** @type {number} */
    #hue = 0;

    /** @type {number} */
    #saturation = 0;

    /** @type {number} */
    #lightness = 0;

    get hue() { return this.#hue; }
    get saturation() { return this.#saturation; }
    get lightness() { return this.#lightness; }

    /**
     * Define a color based on the HSL format.
     * @param {number} hue Number from 0-180 (default: 0)
     * @param {number} saturation Number from 0-100 (default: 0)
     * @param {number} lightness Number from 0-100 (default: 0)
     */
    constructor(hue, saturation, lightness) {
        super();
        expectType('hue', hue, 'number');
        expectType('saturation', saturation, 'number');
        expectType('lightness', lightness, 'number');
        expectBetween('hue', hue, 0, 360);
        expectBetween('saturation', saturation, 0, 100);
        expectBetween('lightness', lightness, 0, 100);

        this.#hue = hue;
        this.#saturation = saturation;
        this.#lightness = lightness;
    }

    toString() {
        return `${this.hue} ${this.saturation} ${this.lightness}`;
    }

    /**
     * Convert a color from HSL color space to RGB color space.
     * @returns {RGBColor}
     */
    toRGB() {
        const { red, green, blue } = HSLToRGB(this.hue, this.saturation, this.lightness);
        return new RGBColor(red, green, blue);
    }

    /**
     * Get triadic colors based on the current color.
     * @returns {HSLColor[]}
     */
    getTriadicColors() {
        return [
            this,
            new HSLColor((this.hue + 120) % 360, this.saturation, this.lightness),
            new HSLColor((this.hue + 240) % 360, this.saturation, this.lightness)
        ];
    }

    /**
     * Generate an object from the class values
     * @returns {Record<string, any>}
     */
    toJsonObject() {
        return {
            hue: this.hue,
            saturation: this.saturation,
            lightness: this.lightness
        }
    }

    /**
     * Generate a class instance based on the supplied object
     * @param {Record<string, any>} object
     * @returns {HSLColor}
     */
    static fromJsonObject(object) {
        if (!object) return;
        return new HSLColor(object.hue, object.saturation, object.lightness);
    }

}