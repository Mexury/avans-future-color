'use strict';

const urlPageTitle = 'FutureColor';

document.addEventListener('click', event => {
    const { target } = event;
    if (!target.matches('a[route-link]')) return;
    event.preventDefault();
    urlRoute();
})

const urlRoutes = {
    '404': {
        view: '404',
        title: `404 | ${urlPageTitle}`,
        description: 'Page not found.'
    },
    '/': {
        view: 'index',
        title: `Home | ${urlPageTitle}`,
        description: 'This is the home page'
    },
    '/halls': {
        view: 'halls',
        title: `Halls | ${urlPageTitle}`,
        description: 'This is the halls page'
    }
};

const urlRoute = (event) => {
    event = event || window.event;
    event.preventDefault();
    window.history.pushState({}, "", event.target.href);
    urlLocationHandler();
};

const urlLocationHandler = async () => {
    let location = window.location.pathname;
    if (location.length == 0) location = '/';
    const route = urlRoutes[location] || urlRoutes['404'];

    const uri = `/views/${route.view}.html`;
    console.log(uri)
    const response = await fetch(uri);
    const html = await response.text();

    const tempElement = document.createElement('div');
    tempElement.innerHTML = html;

    const body = document.getElementById('content');

    while (body.lastChild) {
        body.lastChild.remove();
    }
    [...tempElement.children].forEach(element => {
        if (element.tagName.toLowerCase() !== 'script') {
            body.appendChild(element.cloneNode(true));
        }
    })

    const scripts = tempElement.querySelectorAll('script');
    scripts.forEach(script => {
        if (script.getAttribute('data-id') === 'five-server') return;
        const newScript = document.createElement('script');
        script.getAttributeNames().forEach(attribute => {
            // console.log(attribute, '=', script.getAttribute(attribute))
            newScript.setAttribute(attribute, script.getAttribute(attribute))
            console.log(newScript)
        })
        if (script.src) {
            newScript.src = script.src;
        } else {
            newScript.textContent = script.textContent;
        }
        body.appendChild(newScript);
    })


    document.title = route.title;
    const description = document.querySelector('meta[name="description"]');
    description?.setAttribute('content', route.description);

    customElements.upgrade(document.body);
};

window.addEventListener('popstate', urlLocationHandler);
window.route = urlRoute;

urlLocationHandler();

class ComponentRegistry {
    static #components = new Set();

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
        }
    }

    static unregister(name) {
        if (this.#components.has(name)) {
            this.#components.delete(name);

            const link = document.getElementById(`component-style-${name}`);
            const script = document.getElementById(`component-script-${name}`);

            if (link) link.remove();
            if (script) script.remove();
        }
    }

}

const componentsRegistry = new ComponentRegistry();
componentsRegistry.register('x-ball');

setTimeout(() => {
    const component = document.createElement('x-ball');
    document.body.append(component);
}, 5000);

// function createComponent(name, root = document.body) {
//     const linkId = `component-style-${name}`;
//     const scriptId = `component-script-${name}`;

//     if (!document.getElementById(linkId)) {
//         const link = document.createElement('link');
//         link.href = `/components/${name}/style.css`;
//         link.id = linkId;
//         link.rel = 'stylesheet';
//         document.head.append(link);
//     }

//     if (!document.getElementById(scriptId)) {
//         const script = document.createElement('script');
//         script.src = `/components/${name}/index.js`;
//         script.id = scriptId;
//         script.type = 'module';
//         document.head.append(script);
//     }

//     const component = document.createElement(name);
//     root.append(component);
// }

// createComponent('x-ball');