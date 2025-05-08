import { Color, HSLColor, RGBColor } from '../../js/inc/Color.js';
import LimitedArray from '../../js/inc/LimitedArray.js';
import Ingredient from '../x-ingredient/index.js';

export default class Bucket extends HTMLElement {

    /** @type {LimitedArray<Ingredient>} */
    #ingredients = new LimitedArray(3);

    /** @type {boolean} */
    #isMixed = false;

    get ingredients() { return this.#ingredients }
    get isMixed() {
        return this.#isMixed;
    }
    set isMixed(value) {
        this.#isMixed = value;
        this.#updateColors();
    }

    constructor() {
        super();
    }

    /**
     * Returns the average color based on the ingredients.
     * Returns null if no ingredients are found.
     * @returns {Color}
     */
    getAverageColor() {
        if (this.ingredients.length < 1) return null;
        if (this.ingredients.length === 1) return this.ingredients[0].color;
        return Color.getAverage(...this.ingredients.map(ingredient => ingredient.color));
    }

    /**
     * Get the ingredient with the highest minimum mixing time.
     * If none are found, null is returned.
     * @returns {Ingredient?}
     */
    getSlowestIngredient() {
        if (this.#ingredients.length < 1) return null;

        /** @type {Ingredient?} */
        const slowestIngredient = null;

        for (const ingredient of this.#ingredients) {
            slowestIngredient = Math.max(slowestIngredient, ingredient.minMixingTime);
            if (ingredient.minMixingTime > slowestIngredient.minMixingTime || !slowestIngredient) {
                slowestIngredient = ingredient;
            } else continue;
        }
        return slowestIngredient;
    }

    /**
     * Adds an ingredient to the pot.
     * @param {Ingredient} ingredient 
     * @returns {boolean}
     */
    addIngredient(ingredient) {
        if (this.isMixed) return;
        try {
            const mixingSpeed = this.#ingredients[0]?.mixingSpeed;

            if (!mixingSpeed) {
                this.#ingredients.push(ingredient);
                this.#updateColors();
                return true;
            }

            if (ingredient.mixingSpeed === mixingSpeed) {
                this.#ingredients.push(ingredient);
                this.#updateColors();
                return true;
            }

            // Mixing speeds do not match.
            console.log(`Mixing speeds do not match. Expected ${mixingSpeed}, got ${ingredient.mixingSpeed}.`);
            return false;

        } catch (error) {
            // Bucket is full, display error state.
            console.error('Error: ', error.message)
        }
    }

    #updateColors() {
        if (this.isMixed) {
            const avgColor = this.getAverageColor();
            this.style.setProperty('--color-one', avgColor ? `${avgColor.colorspace}(${avgColor})` : 'transparent');
            this.style.setProperty('--color-two', avgColor ? `${avgColor.colorspace}(${avgColor})` : 'transparent');
            this.style.setProperty('--color-three', avgColor ? `${avgColor.colorspace}(${avgColor})` : 'transparent');
            return;
        }
        this.style.setProperty('--color-one', this.#ingredients[0] ? `${this.#ingredients[0].color.colorspace}(${this.#ingredients[0].color})` : 'transparent');
        this.style.setProperty('--color-two', this.#ingredients[1] ? `${this.#ingredients[1].color.colorspace}(${this.#ingredients[1].color})` : 'transparent');
        this.style.setProperty('--color-three', this.#ingredients[2] ? `${this.#ingredients[2].color.colorspace}(${this.#ingredients[2].color})` : 'transparent');
    }

    connectedCallback() {
        this.draggable = true;
        this.#updateColors();

        this.insertAdjacentHTML('afterbegin', `
            <svg width="216" height="256" viewBox="0 0 216 256" fill="none" xmlns="http://www.w3.org/2000/svg">
                <g clip-path="url(#clip0_1_2)">
                    <path
                        d="M108 90.3529C66.535 90.3529 40.4653 84.5655 24.2844 76.3542C8.23129 68.2077 0.482161 56.6996 0.243965 45.6998L0.237846 45.1765C0.237846 45.1765 -3.74794 185.066 20.9131 220.863C43.8428 254.146 97.2375 256 108 256C118.763 256 172.157 254.146 195.087 220.863C219.748 185.066 215.762 45.1765 215.762 45.1765L215.756 45.6998C215.518 56.6996 207.769 68.2077 191.716 76.3542C175.535 84.5655 149.465 90.3529 108 90.3529Z"
                        fill="url(#paint0_linear_1_2)" />
                    <g filter="url(#filter0_d_1_2)">
                        <path
                            d="M108 6.43262C148.369 6.43262 173.135 12.0016 188.099 19.3818L188.804 19.7344C203.318 27.0999 208.978 36.6463 209.313 44.4238L209.325 44.792L209.329 45.1768L209.325 45.5605C209.158 53.2808 203.723 62.832 189.489 70.2656L188.804 70.6182C173.917 78.173 149.01 83.9209 108 83.9209L106.09 83.917C66.8466 83.7439 42.6269 78.234 27.9001 70.9707L27.195 70.6182C12.6815 63.2529 7.02162 53.707 6.68623 45.9297L6.67451 45.5605L6.66962 45.1768L6.67451 44.792C6.84188 37.0719 12.2773 27.5204 26.5104 20.0869L27.195 19.7344C41.8497 12.2975 66.2141 6.61238 106.09 6.43652L108 6.43262Z"
                            stroke="url(#paint1_radial_1_2)" stroke-width="12.8643" shape-rendering="crispEdges" />
                    </g>
                    <g filter="url(#filter1_i_1_2)">
                        <path
                            d="M108.001 77.8043C148.581 77.8043 172.389 72.0943 186.052 65.1608L187.291 64.515C195.296 60.215 199.546 55.5085 201.592 51.4508C202.738 49.1778 203.193 47.1083 203.229 45.4279L203.232 45.1767L203.229 44.9254L203.209 44.4634C202.903 39.7499 199.378 32.3308 187.291 25.8383L186.052 25.1925C172.816 18.4756 150.059 12.9076 111.756 12.5662L108.001 12.549C68.688 12.549 45.1162 17.908 31.2595 24.5466L29.9489 25.1925C16.4406 32.0476 12.8766 40.0943 12.772 44.9254L12.7683 45.1767L12.772 45.4279L12.7916 45.8899C12.8951 47.4818 13.3659 49.3824 14.4097 51.4516C16.5594 55.7133 21.1397 60.6904 29.9489 65.1608L31.2595 65.8067C45.1162 72.4453 68.688 77.8043 108.001 77.8043Z"
                            fill="url(#paint2_linear_1_2)" />
                    </g>
                    <path fill-rule="evenodd" clip-rule="evenodd"
                        d="M186.052 65.1608C172.389 72.0943 148.581 77.8042 108.001 77.8042C68.6879 77.8042 45.1161 72.4452 31.2594 65.8066L29.9489 65.1608C21.1397 60.6904 16.5594 55.7132 14.4097 51.4515C16.559 47.1897 21.1392 42.2122 29.9489 37.7415L31.2594 37.0956C45.1161 30.457 68.6879 25.098 108.001 25.098C150.063 25.4395 172.816 31.0246 186.052 37.7415L187.291 38.3873C195.296 42.6871 199.545 47.3932 201.592 51.4507C199.546 55.5084 195.296 60.2149 187.291 64.5149L186.052 65.1608Z"
                        class="color-one" />
                    <path
                        d="M83.289 43.4779C74.4455 45.9281 87.9666 45.7066 97.007 44.1921C119.59 40.4089 161.026 45.2431 160.39 53.6963C159.552 64.8462 109.258 72.4123 58.9636 65.2444C5.31653 57.5988 14.5371 38.5643 53.9342 32.5911C15.3754 44.1392 30.5568 58.8731 71.5372 62.8552C95.8299 65.2157 121.072 62.9586 132.712 59.7335C141.556 57.2833 128.034 57.5048 118.994 59.0193C96.4113 62.8025 54.9753 57.9683 55.6107 49.5151C56.4489 38.3652 106.743 30.7991 157.037 37.967C210.684 45.6126 201.464 64.6471 162.067 70.6203C200.626 59.0722 185.444 44.3383 144.464 40.3562C120.171 37.9957 94.9292 40.2528 83.289 43.4779Z"
                        class="color-three" />
                    <path
                        d="M30.3111 62.2817C54.5193 75.7673 131.663 76.7875 162.649 63.5505C185.747 53.6837 171.095 43.8169 141.407 40.0836C118.08 38.1865 94.4417 40.3879 83.289 43.4779C74.4455 45.9281 87.9666 45.7066 97.007 44.1921C119.59 40.4089 161.026 45.2431 160.39 53.6963C160.198 56.253 157.406 58.6212 152.609 60.6666C135.964 70.6132 76.7751 75.4916 30.3111 62.2817Z"
                        class="color-two" />
                    <path
                        d="M184.437 40.6205C160.229 27.1349 83.085 26.1147 52.0985 39.3517C27.5749 49.8278 45.6066 60.3039 79.0073 63.4386C100.852 64.7438 122.263 62.6286 132.712 59.7335C141.556 57.2833 128.034 57.5048 118.994 59.0193C96.4113 62.8025 54.9753 57.9683 55.6107 49.5151C55.7287 47.9456 56.8265 46.4472 58.7663 45.0509C59.4119 44.1876 60.4023 43.3184 61.7818 42.4541C77.9206 32.3425 137.634 27.3418 184.437 40.6205Z"
                        class="color-two" />
                </g>
                <defs>
                    <filter id="filter0_d_1_2" x="0.237984" y="0" width="215.524" height="90.3529" filterUnits="userSpaceOnUse"
                        color-interpolation-filters="sRGB">
                        <feFlood flood-opacity="0" result="BackgroundImageFix" />
                        <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                            result="hardAlpha" />
                        <feOffset />
                        <feComposite in2="hardAlpha" operator="out" />
                        <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0" />
                        <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_1_2" />
                        <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_1_2" result="shape" />
                    </filter>
                    <filter id="filter1_i_1_2" x="12.7683" y="12.549" width="190.463" height="70.401"
                        filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
                        <feFlood flood-opacity="0" result="BackgroundImageFix" />
                        <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
                        <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                            result="hardAlpha" />
                        <feOffset dy="5.14573" />
                        <feGaussianBlur stdDeviation="2.57286" />
                        <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1" />
                        <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.12 0" />
                        <feBlend mode="normal" in2="shape" result="effect1_innerShadow_1_2" />
                    </filter>
                    <linearGradient id="paint0_linear_1_2" x1="216" y1="128" x2="0" y2="128" gradientUnits="userSpaceOnUse">
                        <stop stop-color="#909090" />
                        <stop offset="0.33" stop-color="#C7C7C7" />
                        <stop offset="0.5" stop-color="#F0F0F0" />
                        <stop offset="0.66" stop-color="#C7C7C7" />
                        <stop offset="1" stop-color="#909090" />
                    </linearGradient>
                    <radialGradient id="paint1_radial_1_2" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse"
                        gradientTransform="translate(108 45.1764) rotate(90) scale(47.6862 113.813)">
                        <stop stop-color="white" />
                        <stop offset="0.524038" stop-color="#ADADAD" />
                        <stop offset="0.889423" stop-color="#C7C7C7" />
                        <stop offset="1" stop-color="#DBDBDB" />
                    </radialGradient>
                    <linearGradient id="paint2_linear_1_2" x1="203.232" y1="45.1766" x2="12.7683" y2="45.1766"
                        gradientUnits="userSpaceOnUse">
                        <stop stop-color="#808080" />
                        <stop offset="0.15" stop-color="#C7C7C7" />
                        <stop offset="0.5" stop-color="#909090" />
                        <stop offset="0.85" stop-color="#C7C7C7" />
                        <stop offset="1" stop-color="#808080" />
                    </linearGradient>
                    <clipPath id="clip0_1_2">
                        <rect width="216" height="256" fill="white" />
                    </clipPath>
                </defs>
            </svg>
        `);

        this.addEventListener('dragstart', e => {
            e.dataTransfer.setData('future-color/bucket', JSON.stringify(this.toJsonObject()));
        });
        this.addEventListener('dragover', e => {
            e.preventDefault();
        });
        this.addEventListener('drop', e => {
            e.preventDefault();

            const ingredientData = e.dataTransfer.getData('future-color/ingredient');
            if (ingredientData) {
                const ingredient = Ingredient.fromJsonObject(
                    JSON.parse(ingredientData)
                );
                this.addIngredient(ingredient);
            }
        });
    }

    /**
     * Generate an object from the class values
     * @returns {Record<string, any>}
     */
    toJsonObject() {
        return {
            ingredients: this.ingredients.map(ingredient => ingredient.toJsonObject())
        }
    }

    /**
     * Generate a class instance based on the supplied object
     * @param {Record<string, any>} object
     * @returns {Bucket}
     */
    static fromJsonObject(object) {
        if (!object) return;

        const instance = new Bucket();
        const ingredients = object.ingredients.map(ingredient => Ingredient.fromJsonObject(ingredient));
        ingredients.forEach(ingredient => {
            instance.addIngredient(ingredient);
        })
        return instance;
    }

}

customElements.define('x-bucket', Bucket);