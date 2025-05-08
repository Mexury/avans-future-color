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

    constructor() {
        super();
    }

    show() {
        this.visible = true;
    }

    hide() {
        this.visible = false;
    }

    connectedCallback() {
        this.visible = ['true', 'false'].includes(this.getAttribute('visible')?.toLowerCase()) ? this.getAttribute('visible').toLowerCase() : false;
    }

    disconnectedCallback() {

    }
    
}

customElements.define('x-view', View);