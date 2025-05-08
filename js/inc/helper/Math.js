'use strict';

/**
 * Check whether or not the specified value is within the specified range.
 * @param {number} value 
 * @param {number} min 
 * @param {number} max 
 */
export function isBetween(value, min, max) {
    return value >= min && value <= max;
}

/**
 * Convert a color from RGB color space to HSL color space.
 * @param {number} red 
 * @param {number} green 
 * @param {number} blue 
 * @returns {{
*      hue: number,
*      saturation: number,
*      lightness: number
* }}
*/
export function RGBToHSL(red, green, blue) {
    red /= 255;
    green /= 255;
    blue /= 255;

    let cmin = Math.min(red, green, blue),
        cmax = Math.max(red, green, blue),
        delta = cmax - cmin,
        hue = 0,
        saturation = 0,
        lightness = 0;

    if (delta === 0) {
        hue = 0;
    } else {
        switch (cmax) {
            case red:
                hue = ((green - blue) / delta) % 6;
                break;
            case green:
                hue = (blue - red) / delta + 2;
                break;
            case blue:
                hue = (red - green) / delta + 4;
                break;
        }

        hue = Math.round(hue * 60);

        if (hue < 0) hue += 360;
    }

    lightness = (cmax + cmin) / 2;
    saturation = delta === 0 ? 0 : delta / (1 - Math.abs(2 * lightness - 1));

    saturation = +(saturation * 100).toFixed(1);
    lightness = +(lightness * 100).toFixed(1);

    return { hue, saturation, lightness };
}

/**
 * Convert a color from HSL color space to RGB color space.
 * @param {number} hue 
 * @param {number} saturation 
 * @param {number} lightness
 * @returns {{
*      red: number,
*      green: number,
*      blue: number
* }}
*/
export function HSLToRGB(hue, saturation, lightness) {
    saturation /= 100;
    lightness /= 100;

    let c = (1 - Math.abs(2 * lightness - 1)) * saturation,
        x = c * (1 - Math.abs((hue / 60) % 2 - 1)),
        m = lightness - c / 2,
        red = 0,
        green = 0,
        blue = 0;

    if (hue >= 0 && hue < 60) [red, green, blue] = [c, x, 0];
    else if (hue >= 60 && hue < 120) [red, green, blue] = [x, c, 0];
    else if (hue >= 120 && hue < 180) [red, green, blue] = [0, c, x];
    else if (hue >= 180 && hue < 240) [red, green, blue] = [0, x, c];
    else if (hue >= 240 && hue < 300) [red, green, blue] = [x, 0, c];
    else if (hue >= 300 && hue < 360) [red, green, blue] = [c, 0, x];

    red = Math.round((red + m) * 255);
    green = Math.round((green + m) * 255);
    blue = Math.round((blue + m) * 255);

    return { red, green, blue };
}