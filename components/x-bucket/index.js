import { Color } from '../../js/inc/Color.js';
import LimitedArray from '../../js/inc/LimitedArray.js';
import TestingWorkspace from '../../js/inc/TestingWorkspace.js';
import { generateError, generateTooltip } from '../../js/inc/helper/Hinting.js';
import Ingredient from '../x-ingredient/index.js';

export default class Bucket extends HTMLElement {

    /** @type {LimitedArray<Ingredient>} */
    #ingredients = new LimitedArray(3);

    /** @type {boolean} */
    #isMixed = false;

    /** @type {boolean} */
    #isActive = false;

    get ingredients() { return this.#ingredients }

    get isMixed() {
        return this.#isMixed;
    }
    set isMixed(value) {
        this.#isMixed = value;
        const toggleActive = () => TestingWorkspace.activeMixedBucket = this;
        
        if (value) {
            this.addEventListener('click', toggleActive);
        } else {
            this.removeEventListener('click', toggleActive);
        }
        this.#updateColors();
    }

    get isActive() {
        return this.#isActive;
    }
    set isActive(value) {
        this.classList.toggle('active', value);
        this.#isActive = value;
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
        let slowestIngredient = null;
        /** @type {number} */
        let slowestTime = 0;

        for (const ingredient of this.#ingredients) {
            slowestTime = Math.max(slowestTime, ingredient.mixingTime);
            if (ingredient.mixingTime > slowestTime || !slowestIngredient) {
                slowestIngredient = ingredient;
                slowestTime = ingredient.mixingTime;
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
        if (this.#isMixed) return;
        try {
            const mixingSpeed = this.#ingredients[0]?.mixingSpeed;

            if (!mixingSpeed) {
                this.#ingredients.push(ingredient);
                this.#updateColors();
                return true;
            }

            if (ingredient.mixingSpeed == mixingSpeed) {
                this.#ingredients.push(ingredient);
                this.#updateColors();
                return true;
            }

            generateError('Unable to add ingredient to bucket. Mixing speeds do not match.');
            return false;
        } catch (error) {
            generateError('Unable to add ingredient to bucket. Bucket is full.');
        }
    }

    #updateTooltip() {
        const tooltip = this.querySelector('.tooltip');
        if (tooltip) tooltip.remove();

        const data = [];
        if (this.#isMixed) {
            data.push(
                {
                    title: `Color`,
                    icon: 'swatch',
                    values: [
                        'rgb',
                        ...Object.values(this.getAverageColor().toJsonObject())
                    ]
                },
                {
                    title: `Color`,
                    icon: 'swatch',
                    values: [
                        'hsl',
                        ...Object.values(this.getAverageColor().toHSL().toJsonObject())
                    ]
                }
            );
        } else {
            for (let i = 0; i < 3; i++) {
                if (this.#ingredients[i]) {
                    data.push(
                        {
                            title: `Color #${i + 1}`,
                            icon: 'swatch',
                            values: [
                                this.#ingredients[i].color.colorspace,
                                ...Object.values(this.#ingredients[i].color.toJsonObject())
                            ]
                        },
                        {
                            title: `Texture #${i + 1}`,
                            icon: 'photo',
                            values: this.#ingredients[i].texture
                        }
                    );
                }
            }
            if (this.#ingredients.length >= 1) {
                data.push({
                    title: `Slowest speed`,
                    icon: 'forward',
                    values: this.getSlowestIngredient().mixingSpeed
                });
            }
        }
        if (this.#ingredients.length < 1 && !this.#isMixed) return;
        this.appendChild(generateTooltip([...data]));
    }

    #updateColors() {
        this.#updateTooltip();
        if (this.#isMixed) {
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

        this.insertAdjacentHTML(
            'afterbegin',
            `<svg width="216" height="248" viewBox="0 0 216 248" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M108 70C148.482 70 172.232 64.3139 185.862 57.4092L187.098 56.7661C193.541 53.3111 197.546 49.5926 199.924 46.1626C197.747 43.4279 194.108 40.473 188.098 37.2506L186.862 36.6074C173.658 29.9186 149.956 26.3571 111.746 26.0171L108 26L104.254 26.0171C66.0436 26.3571 42.3418 29.9186 29.1377 36.6074L27.9023 37.2506C21.8924 40.473 18.2528 43.4279 16.0758 46.1626C18.4544 49.5926 22.4587 53.3111 28.9023 56.7661L30.1377 57.4092C43.7678 64.3139 67.5181 70 108 70Z" fill="var(--color-one, 'transparent')"/>
                <path d="M85.4208 40.4471C77.3405 42.5733 89.6948 42.381 97.9551 41.0668C118.589 37.7839 156.45 41.9788 155.869 49.3141C155.103 58.9895 109.149 65.555 63.1946 59.3351C14.1768 52.7005 22.6017 36.1832 58.5991 31C23.3676 41.0209 37.239 53.8063 74.6832 57.2618C96.8796 59.3102 119.943 57.3515 130.579 54.5529C138.659 52.4267 126.305 52.619 118.045 53.9332C97.4108 57.2161 59.5504 53.0212 60.131 45.6859C60.8968 36.0105 106.851 29.445 152.805 35.6649C201.823 42.2995 193.398 58.8168 157.401 64C192.632 53.9791 178.761 41.1937 141.317 37.7382C119.12 35.6898 96.0567 37.6485 85.4208 40.4471Z" fill="var(--color-two, 'transparent')"/>
                <path d="M78.0786 52.7875C87.0987 54.6798 86.2832 51.7867 80.7077 49.8523C66.7803 45.0203 84.5767 36.1542 115.696 36.2902C156.743 36.4695 184.597 47.231 158.209 57.9924C130.063 69.4713 59.9895 67.4983 38 59.0686C80.5131 67.319 134.754 64.0706 149.414 55.302C158.104 50.1041 149.794 44.7031 137.921 42.2125C128.901 40.3202 129.717 43.2134 135.292 45.1477C149.22 49.9797 131.423 58.8458 100.304 58.7098C59.2565 58.5305 31.4031 47.769 57.7906 37.0076C85.9371 25.5287 156.01 27.5017 178 35.9314C135.487 27.681 81.2461 30.9294 66.5864 39.698C57.8963 44.8959 66.2058 50.2969 78.0786 52.7875Z" fill="var(--color-three, 'transparent')"/>
            </svg>`
        );

        this.addEventListener('dragstart', e => {
            if (this.isMixed) return e.preventDefault();
            e.dataTransfer.setData('future-color/bucket', JSON.stringify(this.toJsonObject()));
        });
        this.addEventListener('dragover', e => {
            e.preventDefault();
        });
        this.addEventListener('drop', e => {
            e.preventDefault();
            if (this.isMixed) {
                generateError('This bucket was already mixed.');
            };

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