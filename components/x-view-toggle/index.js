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
        this.#view = document.querySelector(`:is(x-view, x-hall)[name=${this.for}][group=${this.group}]`);
        this.#groupContents = this.group ? document.querySelectorAll(`:is(x-view, x-hall)[group=${this.group}]`) : [];
        this.addEventListener('click', this.#onClick.bind(this));
    }

    disconnectedCallback() {
        this.removeEventListener('click', this.#onClick.bind(this));
    }

    #onClick(event) {
        document.querySelectorAll(`:is(x-view-toggle,button[is=x-view-toggle])[group=${this.group}]`).forEach(toggle => toggle.removeAttribute('disabled'));
        this.toggleAttribute('disabled', true);
        this.#groupContents.forEach(view => view.hide());
        this.#view.show();
    }

}

customElements.define('x-view-toggle', ViewToggle, { extends: 'button' });