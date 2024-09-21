// ==UserScript==
// @name         tomb-tool-utils-pkg-react18
// @namespace    react-bootstrap-tool
// @version      2024-09-21
// @description  useful pkg for jet tool
// @author       yangcfei
// @match        http://*/*
// @match        https://*/*
// @require      https://github.com/jiyahuja/helper_scripts/blob/main/tomb%20page%20main%20greate.user.js
// @require      https://github.com/jiyahuja/helper_scripts/blob/main/tool-table-fmt-web.user.js
// @icon         https://www.google.com/s2/favicons?sz=64&domain=amazon.dev
// @grant        GM_addStyle
// @grant        GM_xmlhttpRequest
// @connect      hooks.slack.com
// @connect      quip-amazon.com
// @connect      hooks.slack.com
// @run-at       document-idle
// ==/UserScript==

'use strict';
async function loadScript(src) {
    return new Promise((resolve) => {
        const script = document.createElement('script');
        script.src = src;
        script.crossorigin = 'anonymous'; // Add crossorigin attribute
        script.onload = resolve;
        document.head.appendChild(script);
    });
}

// https://cdn.jsdelivr.net/npm/bootstrap@5.1.1/dist/css/bootstrap.min.css
// https://cdn.jsdelivr.net/npm/bootstrap@5.1.1/dist/js/bootstrap.bundle.min.js
async function loadBootstrapCSS() {
    const style = document.createElement('style');
    style.textContent = `
        @import "https://cdn.jsdelivr.net/npm/bootstrap@5.1.1/dist/css/bootstrap.min.css";
    `;
    document.head.appendChild(style);
}


async function loadBootstrapJS(){
    await loadScript("https://cdn.jsdelivr.net/npm/bootstrap@5.1.1/dist/js/bootstrap.bundle.min.js");
}

async function loadReact() {
    await loadScript('https://unpkg.com/react@18/umd/react.development.js');
    await loadScript('https://unpkg.com/react-dom@18/umd/react-dom.development.js');
}

async function loadBabel() {
    await loadScript('https://unpkg.com/@babel/standalone@7.23.9/babel.min.js');
}

// Function to load React and Babel
async function initReactApp(boot=true) {
    await loadReact();
    await loadBabel();
    if(boot==true){
        await loadBootstrapCSS();
        await loadBootstrapJS();
    }
}

function htmlToReact(html, processAttributes) {
    const doc = new DOMParser().parseFromString(html, 'text/html');
    const rootElement = doc.body.firstChild;

    function traverse(element) {
        const reactChildren = [];
        element.childNodes.forEach(childNode => {
            if (childNode.nodeType === 1) {
                const reactChild = traverse(childNode);
                reactChildren.push(reactChild);
            } else if (childNode.nodeType === 3) {
                reactChildren.push(childNode.nodeValue);
            }
        });

        const elementType = element.tagName.toLowerCase();
        const attributes = {};
        for (const { name, value } of element.attributes) {
            attributes[name] = value;
        }

        if (processAttributes) {
            processAttributes(attributes, element);
        }

        return React.createElement(elementType, attributes, ...reactChildren);
    }

    return traverse(rootElement);
}

await initReactApp();

