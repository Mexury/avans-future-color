import { Color } from '../../js/inc/Color.js';
import { lists } from '../../js/main.js';
import Bucket from '../x-bucket/index.js';

export default class Mixer extends HTMLElement {

    /** @type {number} Minimum mixing time in milliseconds */
    #minMixingTime = 0;

    /** @type {number} Mixing speed */
    #mixingSpeed = 1;
    
    /** @type {boolean} Is mixing? */
    #isMixing = false;

    /** @type {Bucket?} */
    #bucket;

    get minMixingTime() { return this.#minMixingTime; }
    get mixingSpeed() { return this.#mixingSpeed; }
    get isMixing() { return this.#isMixing; }

    set minMixingTime(value) { this.#minMixingTime = value; }
    set mixingSpeed(value) { this.#mixingSpeed = value; }
    set isMixing(value) { 
        this.#isMixing = value;
        this.classList.toggle('is-mixing', value);
    }

    constructor() {
        super();
    }

    connectedCallback() {
        this.addEventListener('dragover', e => {
            e.preventDefault();
        });
        this.addEventListener('drop', e => {
            e.preventDefault();
            if (this.#isMixing) return;

            const bucketData = e.dataTransfer.getData('future-color/bucket');
            if (bucketData) {
                const bucket = Bucket.fromJsonObject(JSON.parse(bucketData));

                if (bucket.ingredients.length < 2) return;
                this.#bucket = bucket;

                // Bucket contains at least 2 ingredients.
                this.isMixing = true;
            }
        });
        this.addEventListener('animationend', e => {
            if (!this.isMixing) return;
            this.isMixing = false;
            if (!this.#bucket) return;
            this.#bucket.isMixed = true;
            lists.MIXED_BUCKETS.appendChild(this.#bucket);
        })
    }

}

customElements.define('x-mixer', Mixer);