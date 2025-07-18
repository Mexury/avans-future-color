export default class ComponentRegistry {
	static #components = new Set();

	/**
	 * Add a component to the registry
	 * Returns the script so events can be added to it
	 * @param {string} name
	 * @returns {HTMLScriptElement|void}
	 */
	static register(name) {
		if (!this.#components.has(name)) {
			this.#components.add(name);

			const link = document.createElement('link');
			link.href = `/components/${name}/style.css`;
			link.id = `component-style-${name}`;
			link.rel = 'stylesheet';
			document.head.append(link);

			const script = document.createElement('script');
			script.src = `/components/${name}/index.js`;
			script.id = `component-script-${name}`;
			script.type = 'module';
			document.head.append(script);

			return script;
		}
	}

	/**
	 * Remove a component from the registry
	 * @param {string} name
	 */
	static unregister(name) {
		if (this.#components.has(name)) {
			this.#components.delete(name);

			const link = document.getElementById(`component-style-${name}`);
			const script = document.getElementById(`component-script-${name}`);

			if (link) {
				link.remove();
			}
			if (script) {
				script.remove();
			}
		}
	}

}
