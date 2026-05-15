function createElement(tag, className = '', attributes = {}) {
    const element = document.createElement(tag);
    if (className) {
        element.className = className;
    }
    for (const key in attributes) {
        element.setAttribute(key, attributes[key]);
    }
    return element;
}

function appendChildren(parent, children) {
    children.forEach(child => {
        parent.appendChild(child);
    });
}

function updateContent(element, content) {
    element.innerHTML = content;
}

function removeElement(element) {
    if (element && element.parentNode) {
        element.parentNode.removeChild(element);
    }
}

export { createElement, appendChildren, updateContent, removeElement };