export default class View extends HTMLElement {

	/** @type {boolean} */
	#visible = false;

	get visible() {
		return this.#visible;
	}

	set visible(value) {
		this.#visible = value;
		this.setAttribute('visible', value);
		this.setAttribute('aria-hidden', !value);
	}

	// eslint-disable-next-line jsdoc/require-jsdoc
	constructor() {
		super();
	}

	// eslint-disable-next-line jsdoc/require-jsdoc
	show() {
		this.visible = true;
	}

	// eslint-disable-next-line jsdoc/require-jsdoc
	hide() {
		this.visible = false;
	}

	// eslint-disable-next-line jsdoc/require-jsdoc
	connectedCallback() {
		this.visible = [ 'true', 'false' ].includes(this.getAttribute('visible')?.toLowerCase()) ? this.getAttribute('visible').toLowerCase() : false;
	}
}

customElements.define('x-view', View);
