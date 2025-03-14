const regex = /#\(\d+\)!/g;
            
const plus_icon = '<path d="M8 0a8 8 0 1 1 0 16A8 8 0 0 1 8 0Zm1.062 4.312a1 1 0 1 0-2 0v2.75h-2.75a1 1 0 0 0 0 2h2.75v2.75a1 1 0 1 0 2 0v-2.75h2.75a1 1 0 1 0 0-2h-2.75Z"></path>';
const cross_icon = '<path d="M2.343 13.657A8 8 0 1 1 13.658 2.343 8 8 0 0 1 2.343 13.657ZM6.03 4.97a.751.751 0 0 0-1.042.018.751.751 0 0 0-.018 1.042L6.94 8 4.97 9.97a.749.749 0 0 0 .326 1.275.749.749 0 0 0 .734-.215L8 9.06l1.97 1.97a.749.749 0 0 0 1.275-.326.749.749 0 0 0-.215-.734L9.06 8l1.97-1.97a.749.749 0 0 0-.326-1.275.749.749 0 0 0-.734.215L8 6.94Z"></path>';

const icon_elem = '<svg version="1.1" width="1.0em" height="1.0em" class="sd-octicon sd-octicon-feed-plus sd-text-info code-annotation-icon" viewBox="0 0 16 16" aria-hidden="true">' + plus_icon + '</svg>';

var selectedAnnotation = {
    "icon": null,
    "text": null
}

var selected_icon = null;
var selected_text = null;

/**
 * Returns true if an annotation is selected, else false.
 */
function areSelectedAnnotation() {
    return selectedAnnotation != null;
}

/**
 * Update the selected annotation.
 */
function selectAnnotation(icon, text) {
    selectedAnnotation["icon"] = icon;
    selectedAnnotation["text"] = text;
}

/**
 * Hide and unselect the selected code annotation if there is one, if not do nothing.
 *
 */
function hideSelectedAnnotation() {
    if(areSelectedAnnotation()) {
        hideAnnotation(selected_icon, selected_text);
        selectedAnnotation["icon"] = null;
        selectedAnnotation["text"] = null;
    }
}

/**
 * Hide a code annotation.
 */
function hideAnnotation(annotation) {
    const {icon, text} = annotation;
    icon.innerHTML = plus_icon;
    icon.classList.remove("sd-octicon-feed-plus");
    icon.classList.add("sd-octicon-x-circle-fill");
    icon.style.zIndex = "0";
    text.style.display = "none";
    text.style.left = "var(--code-annotation-offset)";
}

/**
 * Show a code annotation.
 */
function show_annotation(annotation) {
    hideSelectedAnnotation();
    const {icon, text} = annotation;

    icon.classList.remove("sd-octicon-feed-plus");
    icon.classList.add("sd-octicon-x-circle-fill");
    icon.style.zIndex = "2";
    icon.innerHTML = cross_icon;

    text.style.display = "block";
    adjustTextPosition(icon, text);
    
    selectAnnotation(icon, text);
}

function adjustTextPosition(icon, text) {
    const iconRect = icon.getBoundingClientRect();
    const offsetX = iconRect.left + 'px';
    const offsetY = (iconRect.top + window.scrollY) + 'px';
    text.style.left = 'calc(' + offsetX + ' + var(--code-annotation-offset))';
    text.style.top = 'calc(' + offsetY + ' + var(--code-annotation-offset))';
}

function findAssociatedList(block) {
    let nextElement = block.nextSibling;

    while(nextElement && nextElement.nodeName != "OL") {
        nextElement = nextElement.nextSibling;
    }

    return nextElement;
}

function createAnnotation(id, text) {
    const annotation = document.createElement('span');

    // Creation of the annotation's icon
    const icon = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    icon.setAttribute('version', '1.1');
    icon.setAttribute('width', '1.0em');
    icon.setAttribute('height', '1.0em');
    icon.setAttribute('class', 'sd-octicon sd-octicon-feed-plus sd-text-info code-annotation-icon');
    icon.setAttribute('viewBox', '0 0 16 16');
    icon.setAttribute('aria-hidden', 'true');
    icon.setAttributeNS("http://www.w3.org/2000/xmlns/", "xmlns:xlink", "http://www.w3.org/1999/xlink");
    icon.innerHTML = plus_icon;
    icon.id = 'code-annotation-icon-' + id;
    
    annotation.appendChild(icon);

    // Creation of the annotation's text block
    const textElem = document.createElement('p');
    textElem.classList.add("code-annotation-text");
    textElem.innerHTML = text;
    textElem.id = "code-annotation-text-" + id;

    const mainContainer = document.querySelector('.bd-container');
    mainContainer.appendChild(textElem);
    textElem.style.display = "none";

    icon.addEventListener('click', function() {
        onClickAnnotation(id);
    });

    annotation.classList.add("code-annotation");
    return annotation;
}

function onClickAnnotation(id) {
    const icon = document.getElementById('code-annotation-icon-' + id);
    const text = document.getElementById('code-annotation-text-' + id);

    if(text.style.display == "none") {
        show_annotation(icon, text);
    } else {
        hideAnnotation(icon, text);
    }
}

document.addEventListener("DOMContentLoaded", function() {
    const blocks = document.querySelectorAll('.literal-block-wrapper');

    let id = 0;
    for(let i = 0; i < blocks.length; i++) {
        const block = blocks[i];
        const list = findAssociatedList(block);

        if(list != null) {
            const spans = block.querySelectorAll('span.c1');
            const lis = list.querySelectorAll('li');
            for(let j = 0; j < spans.length; j++) {
                const span = spans[j];
                const annotation = createAnnotation(id, lis[j].children[0].innerHTML);
                span.parentNode.replaceChild(annotation, span);
                id++;
            }

            list.remove();
        }

    }
});

window.addEventListener('resize', function() {
    if(selected_icon != null && selected_text != null) {
        adjustTextPosition(selected_icon, selected_text);
    } 
});