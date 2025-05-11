import { Color } from '../../js/inc/Color.js';
import { lists } from '../../js/inc/helper/Lists.js';
import { generateError, generateTooltip } from '../../js/inc/Tooltip.js';
import { WeatherStation } from '../../js/inc/WeatherStation.js';
import Bucket from '../x-bucket/index.js';
import Ingredient from '../x-ingredient/index.js';

export default class Mixer extends HTMLElement {

    /** @type {number} Minimum mixing time in milliseconds */
    #mixingTime = 0;

    /** @type {number} Mixing speed */
    #mixingSpeed = 1;

    /** @type {boolean} Is mixing? */
    #isMixing = false;

    /** @type {Bucket?} */
    #bucket;

    get mixingTime() { return this.#mixingTime; }
    get mixingSpeed() { return this.#mixingSpeed; }
    get isMixing() { return this.#isMixing; }

    set mixingTime(value) { this.#mixingTime = value; }
    set mixingSpeed(value) { this.#mixingSpeed = value; }
    set isMixing(value) {
        this.#isMixing = value;
        this.classList.toggle('is-mixing', value);
    }

    constructor() {
        super();
    }

    updateTooltip() {
        const tooltip = this.querySelector('.tooltip');
        if (tooltip) tooltip.remove();

        const data = [
            {
                title: 'Mixing time',
                icon: 'clock',
                values: `${this.mixingTime} ms`
            },
            {
                title: 'Mixing speed',
                icon: 'forward',
                values: this.mixingSpeed
            }
        ];

        if (WeatherStation.weatherData.current.condition.code >= 1150) {
            data.push({
                title: 'Bad weather conditions',
                icon: 'clock',
                values: `+10% mixing time`
            });
        }

        if (WeatherStation.weatherData.current.temp_c > 35 && this.getAttribute('mixer-index') != 1) {
            data.push({
                title: 'Extreme temperatures',
                icon: 'clock',
                values: `Mixer unavailable.`
            });
        } else
        if (WeatherStation.weatherData.current.temp_c < 10) {
            data.push({
                title: 'Low temperatures',
                icon: 'clock',
                values: `+15% mixing time`
            });
        }

        this.appendChild(generateTooltip([...data]));
    }


    #updateColors() {
        this.updateTooltip();
        this.style.setProperty('--color-one', this.#bucket?.ingredients[0] ? `${this.#bucket.ingredients[0].color.colorspace}(${this.#bucket.ingredients[0].color})` : 'transparent');
        this.style.setProperty('--color-two', this.#bucket?.ingredients[1] ? `${this.#bucket.ingredients[1].color.colorspace}(${this.#bucket.ingredients[1].color})` : 'transparent');
        this.style.setProperty('--color-three', this.#bucket?.ingredients[2] ? `${this.#bucket.ingredients[2].color.colorspace}(${this.#bucket.ingredients[2].color})` : 'transparent');
    }

    connectedCallback() {
        this.setAttribute('mixer-index', document.querySelectorAll('x-mixer').length);
        this.#updateColors();

        this.insertAdjacentHTML(
            'afterbegin',
            `<svg class="mixer-colors" width="414" height="450" viewBox="0 0 414 450" fill="none" xmlns="http://www.w3.org/2000/svg">
                <g class="mixer-colors-blob">
                    <path d="M206.999 330C243.968 330 262.594 312.542 279.233 281.928C286.675 268.237 291.569 259.204 290.947 243.411C290.419 230.011 286.114 221.009 279.018 208.703C261.217 177.829 235.355 154.662 202.449 164.152C162.237 175.75 149.497 175.079 133.851 202.621C125.801 216.791 123.578 230.011 123.05 243.411C122.428 259.204 127.633 269.911 135.892 284.264C152.817 313.678 170.029 330 206.999 330Z" fill="var(--color-one, 'transparent')"/>
                    <path d="M186.129 222.051C178.723 229.75 190.047 229.054 197.618 224.295C216.53 212.409 252.635 240.457 252.103 267.016C251.401 302.048 209.281 325.82 167.162 303.299C122.234 279.277 128.552 206.613 161.546 187.846C129.254 224.129 141.968 270.421 176.288 282.933C196.632 290.349 217.771 283.258 227.519 273.125C234.925 265.426 223.602 266.122 216.031 270.881C197.119 282.767 162.418 267.579 162.95 241.02C163.652 205.988 215.115 183.782 257.235 206.303C302.162 230.325 285.096 288.563 252.103 307.33C284.394 271.047 270.474 234.563 236.154 222.051C215.81 214.635 195.878 211.918 186.129 222.051Z" fill="var(--color-two, 'transparent')"/>
                    <path d="M179.872 267.082C188.05 273.986 187.31 263.43 182.255 256.372C169.628 238.741 185.763 206.391 213.978 206.887C251.194 207.541 282.152 252.229 258.227 291.495C232.707 333.379 150.787 317.233 143.534 290C194.76 303.15 231.257 308.251 244.549 276.257C252.428 257.291 244.058 247.65 233.294 238.562C225.115 231.658 223.252 250.443 228.307 257.501C240.935 275.132 228.238 289.187 200.022 288.691C162.806 288.036 130.942 246.153 154.867 206.887C180.387 165.004 250.53 174.82 270.467 205.578C217.88 189.028 182.743 187.327 169.452 219.321C161.573 238.287 169.107 257.994 179.872 267.082Z" fill="var(--color-three, 'transparent')"/>
                </g>
            </svg>
        `
        );

        this.addEventListener('dragover', e => {
            e.preventDefault();
        });
        const handleDrop = e => {
            e.preventDefault();
            if (this.#isMixing) {
                generateError('Unable to place bucket in mixer. Mixer is already active.');
                return;
            }

            const bucketData = e.dataTransfer.getData('future-color/bucket');
            if (bucketData) {
                const bucket = Bucket.fromJsonObject(JSON.parse(bucketData));

                if (bucket.ingredients.length < 2) {
                    return generateError('Mixers only accept buckets with 2 or more unprocessed ingredients.');
                }
                if (WeatherStation.weatherData.current.temp_c > 35 && this.getAttribute('mixer-index') != 1) {
                    return generateError('Mixer is unavailable due to extreme temperatures.');
                }
                this.#bucket = bucket;
                this.#updateColors();

                let duration = Math.max(
                    Ingredient.minMixingTime,
                    this.#bucket.getSlowestIngredient().mixingTime
                );

                let penalty = 0;
                if (WeatherStation.weatherData.current.temp_c < 10) {
                    penalty += .15;
                }
                
                if (WeatherStation.weatherData.current.condition.code >= 1150) {
                    // It's raining / storming or snowy.
                    penalty += .10;
                }

                duration *= 1 + penalty;

                this.style.setProperty('--duration', `${duration}ms`);
                this.isMixing = true;

                // Use a time out to dictate when the animation ends,
                // so that I can keep using the speed without changing the
                // duration easily.
                setTimeout(() => {
                    if (!this.isMixing) return;
                    this.isMixing = false;

                    if (!this.#bucket) return;
                    this.#bucket.isMixed = true;

                    lists.MIXED_BUCKETS.appendChild(this.#bucket);

                    this.#bucket = null;
                    this.#updateColors();
                }, duration);
            } else return generateError('Mixers only accept buckets with 2 or more unprocessed ingredients.');
        }
        this.addEventListener('drop', handleDrop.bind(this));
        // this.addEventListener('drop', e => {
        //     e.preventDefault();
        //     if (this.#isMixing) return;

        //     const bucketData = e.dataTransfer.getData('future-color/bucket');
        //     if (bucketData) {
        //         const bucket = Bucket.fromJsonObject(JSON.parse(bucketData));

        //         if (bucket.ingredients.length < 2) return;
        //         this.#bucket = bucket;
        //         this.#updateColors();

        //         const duration = Math.max(
        //             Ingredient.minMixingTime,
        //             this.#bucket.getSlowestIngredient().mixingTime
        //         );

        //         this.style.setProperty('--duration', `${duration}ms`);
        //         this.isMixing = true;
        //     }
        // });
        // this.addEventListener('animationend', e => {
        //     if (!this.isMixing) return;
        //     this.isMixing = false;

        //     if (!this.#bucket) return;
        //     this.#bucket.isMixed = true;

        //     lists.MIXED_BUCKETS.appendChild(this.#bucket);

        //     this.#bucket = null;
        //     this.#updateColors();
        // })
    }

}

customElements.define('x-mixer', Mixer);