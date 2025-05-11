'use strict';

import * as env from '../env.js';
import { generateError } from './helper/Hinting.js';

export class WeatherStation {

    /** @type {string} */
    static #location = '...';
    static get location() {
        return this.#location;
    }
    static set location(value) {
        this.#location = value;
        this.update();
    }

    /** @type {Record<any, any>} */
    static #weatherData = {};
    static get weatherData() {
        return this.#weatherData;
    }
    static set weatherData(value) {
        this.#weatherData = value;
        document.dispatchEvent(new CustomEvent('weather:updated', {
            detail: {
                data: this.weatherData
            }
        }));
    }

    static async update() {
        try {
            const response = await fetch(`http://api.weatherapi.com/v1/current.json?key=${env.WEATHER_API_KEY}&q=${this.location}&aqi=no`)
            const json = await response.json();
            if (json.error) {
                generateError(json.error.message);
                return;
            }
            this.weatherData = json;
            document.body.classList.toggle('extreme-temps', this.weatherData.current.temp_c > 35);
            document.querySelectorAll('x-mixer').forEach(mixer => {
                mixer.updateTooltip();
            })
        } catch (error) {
            generateError('Unable to get current weather for specified location. Check console for more details.');
            console.error('Unable to get current weather for specified location.', error);
        }

        // Update every weather 5 minutes
        setTimeout(this.update, 1000 * 60 * 5);
    }

}