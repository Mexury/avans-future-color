'use strict';

import Bucket from '../components/x-bucket/index.js';
import Hall from '../components/x-hall/index.js';
import Ingredient from '../components/x-ingredient/index.js';
import View from '../components/x-view/index.js';
import { RGBColor, HSLColor } from './inc/Color.js';

const forms = {
    INGREDIENT: document.querySelector('form#create-ingredient')
};
export const lists = {
    INGREDIENTS: document.getElementById('list-ingredients'),
    BUCKETS: document.getElementById('list-buckets'),
    MIXED_BUCKETS: document.getElementById('list-mixed-buckets'),
};

Object.values(forms).forEach(form => {
    if (form instanceof HTMLFormElement) {
        form.addEventListener('submit', e => e.preventDefault());
    }
});

forms.INGREDIENT.addEventListener('submit', e => {
    const {
        minMixingTimeMs,
        mixingSpeed,
        colorspace,
        red, green, blue,
        hue, saturation, lightness,
        texture
    } = e.currentTarget.elements;

    const color = {
        red: parseInt(red.value),
        green: parseInt(green.value),
        blue: parseInt(blue.value),
        hue: parseInt(hue.value),
        saturation: parseInt(saturation.value),
        lightness: parseInt(lightness.value)
    };

    const ingredientElement = new Ingredient();
    ingredientElement.color = colorspace.value === 'rgb' ? new RGBColor(color.red, color.green, color.blue) : new HSLColor(color.hue, color.saturation, color.lightness);
    ingredientElement.texture = texture.value;

    lists.INGREDIENTS.appendChild(ingredientElement);
});

document.getElementById('create-bucket').addEventListener('click', e => {
    const bucketElement = new Bucket();
    lists.BUCKETS.appendChild(bucketElement);
})

const showHallOneButton = document.getElementById('show-hall-1');
const showHallTwoButton = document.getElementById('show-hall-2');
/** @type {Hall?} */
const hallOne = document.querySelector('x-hall[name="hall-1"]')
const halls = document.querySelectorAll('x-hall');

showHallOneButton.addEventListener('click', e => showHall(1));
showHallTwoButton.addEventListener('click', e => showHall(2));

const hideHalls = () => {
    halls.forEach(
        /** @param {Hall} hall */
        hall => hall.hide()
    );
}
const showHall = (index) => {
    hideHalls();
    document.querySelector(`x-hall[name="hall-${index}"]`).show();

    if (!hallOne.visible) {
        document.getElementById('ingredients-popover').hidePopover();
    }
    document.getElementById('open-ingredients-popover').toggleAttribute('disabled', !hallOne.visible);
}
