'use strict';

import Bucket from '../../components/x-bucket/index.js';
import { HSLColor, RGBColor } from './Color.js';

export default class TestingWorkspace {

    /** @type {Bucket?} */
    static #activeMixedBucket;

    static get activeMixedBucket() {
        return this.#activeMixedBucket;
    }
    static set activeMixedBucket(value) {
        if (this.#activeMixedBucket) this.#activeMixedBucket.isActive = false;
        this.#activeMixedBucket = value;
        if (this.#activeMixedBucket) this.#activeMixedBucket.isActive = true;
    }

    static generateGrid() {
        const testingGrid = document.getElementById('testing-grid');
        for (let y = 0; y < 4; y++) {
            for (let x = 0; x < 6; x++) {
                const tile = document.createElement('div');
                tile.classList.add('tile');
                tile.addEventListener('click', e => {
                    if (this.activeMixedBucket) {
                        const avgColor = this.activeMixedBucket.getAverageColor();

                        tile.style.setProperty(
                            '--background-color',
                            `${avgColor.colorspace}(${avgColor})`
                        );
                        this.activeMixedBucket = null;
                    } else {
                        const colorProperty = tile.style.getPropertyValue('--background-color');
                        if (!colorProperty) return;
                        const colorspace = colorProperty.split('(')[0];
                        const values = colorProperty.replace(',', '')
                                            .split('(')[1]
                                            .split(')')[0]
                                            .split(' ')
                                            .map(value => parseInt(value));
                        const color = colorspace === 'rgb' ? new RGBColor(...values).toHSL() : new HSLColor(...values);
                        const triadicColors = color.getTriadicColors();
                        
                        const modal = document.getElementById('triadic-dialog');
                        modal.close();
                        const content = modal.querySelector('.triadic-content');

                        while (content.lastChild) {
                            content.lastChild.remove();
                        }

                        triadicColors.forEach(color => {
                            const rgbColor = color.toRGB();

                            const card = document.createElement('div');
                            const colorPreview = document.createElement('div');
                            const info = document.createElement('div');
                            const rgbInfoHeader = document.createElement('p');
                            const hslInfoHeader = document.createElement('p');
                            const rgbInfo = document.createElement('p');
                            const hslInfo = document.createElement('p');

                            card.classList.add('color-card');
                            colorPreview.classList.add('color-preview');
                            info.classList.add('color-info');
                            rgbInfoHeader.classList.add('info-header');
                            hslInfoHeader.classList.add('info-header');
                            rgbInfo.classList.add('info-text');
                            hslInfo.classList.add('info-text');

                            rgbInfoHeader.textContent = 'RGB';
                            rgbInfo.textContent = rgbColor.toString();
                            hslInfoHeader.textContent = 'HSL';
                            hslInfo.textContent = color.toString();

                            colorPreview.style.setProperty('--background-color', `hsl(${color})`);
                            
                            info.append(rgbInfoHeader, rgbInfo, hslInfoHeader, hslInfo);
                            card.append(colorPreview, info);
                            content.append(card);
                        });

                        const rects = {
                            tile: tile.getBoundingClientRect(),
                            modal: modal.getBoundingClientRect()
                        };

                        let x = rects.tile.left + rects.tile.width / 2;
                        let y = rects.tile.top + rects.tile.height / 2;

                        if (x + rects.modal.width > window.innerWidth) {
                            x = rects.tile.right - rects.modal.width;
                            if (x < 0) x = 0;
                        }
                        if (y + rects.modal.height > window.innerHeight) {
                            y = rects.tile.bottom - rects.modal.height;
                            if (y < 0) y = 0;
                        }

                        modal.style.setProperty('--top', `${y}px`);
                        modal.style.setProperty('--left', `${x}px`);
                        modal.show();
                    }
                });
                testingGrid.append(tile);
            }
        }
    }

}