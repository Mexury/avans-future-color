'use strict';

import Bucket from '../components/x-bucket/index.js';
import Ingredient from '../components/x-ingredient/index.js';
import Mixer from '../components/x-mixer/index.js';
import { forms } from './inc/helper/Forms.js';
import { lists } from './inc/helper/Lists.js';
import TestingWorkspace from './inc/TestingWorkspace.js';
import { generateError } from './inc/helper/Hinting.js';
import { WeatherStation } from './inc/WeatherStation.js';

document.addEventListener('weather:updated', e => {
    const { data } = e.detail;
    if (data.error) return;

    const weatherStation = document.getElementById('weather-station');
    const conditionImage = document.getElementById('weather-condition-image');
    const conditionText = document.getElementById('weather-condition-text');
    const celciusView = weatherStation.querySelector('x-view[name=celcius][group=temperature]');
    const fahrenheitView = weatherStation.querySelector('x-view[name=fahrenheit][group=temperature]');
    const locationText = document.getElementById('weather-location');
    const locationSubText = document.getElementById('weather-location-subtext');

    const {
        temp_c: tempC,
        temp_f: tempF,
        condition
    } = data.current;

    const { location } = data;

    conditionImage.src = `https:${condition.icon}`;
    conditionImage.alt = condition.text;
    conditionText.textContent = condition.text;
    celciusView.innerHTML = `${tempC} &deg;C`;
    fahrenheitView.innerHTML = `${tempF} &deg;F`;
    locationText.textContent = `${location.name}`;
    locationSubText.textContent = `${location.region}, ${location.country}`;
})
WeatherStation.location = '\'s-Hertogenbosch';

const showHallOneButton = document.getElementById('show-hall-1');
const showHallTwoButton = document.getElementById('show-hall-2');
const createBucketButton = document.getElementById('create-bucket');
const halls = document.querySelectorAll('x-hall');

const toggleIngredientCreation = (show) => {
    document.getElementById('open-ingredients-popover').toggleAttribute('disabled', show);
}
const createBucket = () => {
    const bucketElement = new Bucket();
    lists.BUCKETS.appendChild(bucketElement);
}

showHallOneButton.addEventListener('click', () => toggleIngredientCreation(false));
showHallTwoButton.addEventListener('click', () => toggleIngredientCreation(true));
createBucketButton.addEventListener('click', createBucket);

Object.values(forms).forEach(form => {
    if (form instanceof HTMLFormElement) {
        form.addEventListener('submit', e => e.preventDefault());
    }
});

forms.WEATHER_SETTINGS.addEventListener('submit', e => {
    const { location } = e.currentTarget.elements;
    WeatherStation.location = location.value;
});

forms.GLOBAL_SETTINGS.addEventListener('submit', e => {
    const { minMixingTime, minMixingSpeed } = e.currentTarget.elements;

    if (Ingredient.minMixingTime != minMixingTime.value) {
        Ingredient.minMixingTime = minMixingTime.value;
    }
    if (Ingredient.minMixingSpeed != minMixingSpeed.value) {
        Ingredient.minMixingSpeed = minMixingSpeed.value;
    }
});

forms.INGREDIENT.addEventListener('submit', e => {
    const {
        mixingTime,
        mixingSpeed,
        colorspace,
        red, green, blue,
        hue, saturation, lightness,
        texture
    } = e.currentTarget.elements;

    const color = colorspace.value === 'rgb' ? {
        red: parseInt(red.value),
        green: parseInt(green.value),
        blue: parseInt(blue.value),
    } : {
        hue: parseInt(hue.value),
        saturation: parseInt(saturation.value),
        lightness: parseInt(lightness.value)
    };

    const ingredient = Ingredient.fromJsonObject({
        mixingTime: mixingTime.value,
        mixingSpeed: mixingSpeed.value,
        colorspace: colorspace.value,
        color: color,
        texture: texture.value
    });

    lists.INGREDIENTS.appendChild(ingredient);
});

forms.MIXER.addEventListener('submit', e => {
    const {
        mixingTime,
        mixingSpeed,
        hall
    } = e.currentTarget.elements;

    if (halls.length >= hall.value) {
        if (lists[`HALL_${hall.value}_MIXERS`].childElementCount >= 5) {
            return generateError('Each hall can only have 5 mixers at a time.');
        }
        const mixer = new Mixer();
        mixer.mixingTime = mixingTime.value;
        mixer.mixingSpeed = mixingSpeed.value;
        lists[`HALL_${hall.value}_MIXERS`].appendChild(mixer);
    }
});

const generateStartingIngredients = () => {
    const mixingSpeeds = [5, 25, 12];
    const mixingTimes = [1000, 5000, 300];
    const colors = [[255, 0, 0], [0, 255, 0], [0, 0, 255]];
    const textures = ['grainy', 'coarse_grainy', 'smooth'];

    for (let i = 0; i < 3; i++) {
        const ingredient = Ingredient.fromJsonObject({
            mixingSpeed: mixingSpeeds[i],
            mixingTime: mixingTimes[i],
            color: {
                red: colors[i][0],
                green: colors[i][1],
                blue: colors[i][2]
            },
            colorspace: 'rgb',
            texture: textures[i]
        });
        lists.INGREDIENTS.appendChild(ingredient);
    }

}
const generateStartingBuckets = () => {
    for (let i = 0; i < 3; i++) {
        const bucket = new Bucket();
        lists.BUCKETS.appendChild(bucket);
    }
}

generateStartingIngredients();
generateStartingBuckets();

TestingWorkspace.generateGrid();