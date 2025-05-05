'use strict';

import Ingredient from './inc/Ingredient.js';
customElements.define('x-ingredient', Ingredient);

const forms = {
    INGREDIENT: document.querySelector('form#create-ingredient')
}
const lists = {
    INGREDIENTS: document.querySelector('#list-ingredients') 
}

Object.values(forms).forEach(form => {
    if (form instanceof HTMLFormElement) {
        form.addEventListener('submit', e => e.preventDefault())
    }
})

/** @type {Map<Ingredient, HTMLElement>} */
const ingredients = new Map();

forms.INGREDIENT.addEventListener('submit', e => {
    const {
        minMixingTimeMs,
        mixingSpeed,
        colorspace,
        red, green, blue,
        hue, saturation, lightness,
        texture
    } = e.currentTarget.elements;

    const color = (colorspace.value === 'rgb' ? [red, green, blue] : [hue, saturation, lightness]).map(entry => entry.value);
    const colorString = `${colorspace.value}(${color.join(' ')})`;

    console.log(minMixingTimeMs.value);
    console.log(mixingSpeed.value);
    console.log(colorspace.value, color);
    console.log(texture.value);

    const ingredientElement = document.createElement('x-ingredient');
    ingredientElement.innerHTML = texture.value;

    ingredientElement.style.setProperty('--background-color', `${colorString}`)
    ingredientElement.classList.add(`texture-${texture.value}`)

    lists.INGREDIENTS.appendChild(ingredientElement);
})