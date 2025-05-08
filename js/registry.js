'use strict'

import ComponentRegistry from './inc/ComponentRegistry.js';

ComponentRegistry.register('x-ingredient');
ComponentRegistry.register('x-view');
ComponentRegistry.register('x-hall');
ComponentRegistry.register('x-view-toggle');
ComponentRegistry.register('x-bucket');
ComponentRegistry.register('x-mixer')?.addEventListener('load', e => {
    const loader = document.getElementById('loader');
    loader.classList.toggle('fading-out', true);
    
    loader.addEventListener('animationend', e => {
        loader.classList.remove('fading-out');
        loader.classList.toggle('finished-loading', true);
    })
});