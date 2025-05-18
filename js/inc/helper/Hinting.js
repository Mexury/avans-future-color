import { lists } from './Lists.js';

/** @typedef {{ title: string, icon: string, values: string|Array<any>}} InfoGroup */

/**
 * Generate a tooltip based on the supplied info groups
 * @param {Array<InfoGroup>} infoGroups
 * @returns {HTMLDivElement}
 */
export const generateTooltip = (infoGroups) => {
	const tooltip = document.createElement('div');
	tooltip.classList.add('tooltip');

	infoGroups.forEach(infoGroup => {
		const groupElement = document.createElement('div');
		const iconElement = document.createElement('img');
		const contentElement = document.createElement('div');
		const titleElement = document.createElement('h4');
		const textElement = document.createElement('p');

		groupElement.classList.add('info-group');
		iconElement.classList.add('info-icon');
		contentElement.classList.add('info-content');
		titleElement.classList.add('info-title');
		textElement.classList.add('info-text');

		iconElement.src = `/assets/svg/icons/${infoGroup.icon}.svg`;
		titleElement.textContent = infoGroup.title;
		textElement.textContent = Array.isArray(infoGroup.values) ? infoGroup.values.join(', ') : infoGroup.values;

		contentElement.append(titleElement, textElement);
		groupElement.append(iconElement, contentElement);
		tooltip.appendChild(groupElement);
	});

	return tooltip;
};

/**
 * Generate a user-friendly error popup
 * @param {string} message
 */
export const generateError = (message) => {
	const error = document.createElement('div');
	error.classList.add('error');
	error.textContent = message;

	lists.ERRORS.appendChild(error);

	/**
	 * Offset each error to make up for changes
	 */
	const updateErrorPositions = () => {
		let offset = 0;
		Array.from(lists.ERRORS.children).forEach(element => {
			element.style.bottom = `${offset}px`;
			offset += element.getBoundingClientRect().height + 8;
		});
	};

	requestAnimationFrame(() => {
		updateErrorPositions();
	});

	setTimeout(() => {
		error.classList.add('fading-out');
		error.addEventListener('animationend', () => {
			error.remove();
			updateErrorPositions();
		});
	}, 3000);
};
