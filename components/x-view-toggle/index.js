import View from '../x-view/index.js';

export default class ViewToggle extends HTMLButtonElement {

    /** @type {View?} */
    #view;

    /** @type {View[]} */
    #groupContents;

    get for() {
        return this.getAttribute('for') || '';
    }

    get group() {
        return this.getAttribute('group');
    }

    constructor() {
        super();
    }

    connectedCallback() {
        this.tabIndex = 0;
        this.#view = document.querySelector(`x-view[name=${this.for}][group=${this.group}]`);
        this.#groupContents = this.group ? document.querySelectorAll(`x-view[group=${this.group}]`) : [];
        this.addEventListener('click', this.#onClick.bind(this));
    }

    disconnectedCallback() {
        this.removeEventListener('click', this.#onClick.bind(this));
    }

    #onClick(event) {
        this.#groupContents.forEach(view => view.hide());
        this.#view.show();
    }

}

customElements.define('x-view-toggle', ViewToggle, { extends: 'button' });