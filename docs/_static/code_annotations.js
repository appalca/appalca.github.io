const regex = /#\(\d+\)!/g;
            
const plusIcon = '<path d="M8 0a8 8 0 1 1 0 16A8 8 0 0 1 8 0Zm1.062 4.312a1 1 0 1 0-2 0v2.75h-2.75a1 1 0 0 0 0 2h2.75v2.75a1 1 0 1 0 2 0v-2.75h2.75a1 1 0 1 0 0-2h-2.75Z"></path>';
const crossIcon = '<path d="M2.343 13.657A8 8 0 1 1 13.658 2.343 8 8 0 0 1 2.343 13.657ZM6.03 4.97a.751.751 0 0 0-1.042.018.751.751 0 0 0-.018 1.042L6.94 8 4.97 9.97a.749.749 0 0 0 .326 1.275.749.749 0 0 0 .734-.215L8 9.06l1.97 1.97a.749.749 0 0 0 1.275-.326.749.749 0 0 0-.215-.734L9.06 8l1.97-1.97a.749.749 0 0 0-.326-1.275.749.749 0 0 0-.734.215L8 6.94Z"></path>';

const iconTag = '<svg version="1.1" width="1.0em" height="1.0em" class="sd-octicon sd-octicon-feed-plus sd-text-info code-annotation-icon" viewBox="0 0 16 16" aria-hidden="true">' + plusIcon + '</svg>';

var selectedAnnotation = null;

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
    selectedAnnotation = {icon, text};
}

/**
 * Hide and unselect the selected code annotation if there is one, if not do nothing.
 *
 */
function hideSelectedAnnotation() {
    if(areSelectedAnnotation()) {
        hideAnnotation(selectedAnnotation);
        selectedAnnotation = null;
    }
}

/**
 * Hide a code annotation.
 */
function hideAnnotation(annotation) {
    const {icon, text} = annotation;
    icon.innerHTML = plusIcon;
    icon.classList.remove("sd-octicon-feed-plus");
    icon.classList.add("sd-octicon-x-circle-fill");
    icon.style.zIndex = "0";
    text.style.display = "none";
    text.style.left = "var(--code-annotation-offset)";
}

/**
 * Show a code annotation.
 */
function showAnnotation(annotation) {
    hideSelectedAnnotation();
    const {icon, text} = annotation;

    icon.classList.remove("sd-octicon-feed-plus");
    icon.classList.add("sd-octicon-x-circle-fill");
    icon.style.zIndex = "2";
    icon.innerHTML = crossIcon;

    text.style.display = "block";
    adjustTextPosition(icon, text);

    const pre = icon.closest("pre");
    pre.addEventListener("scroll", function() {
        adjustTextPosition(icon, text);
    });
    
    selectAnnotation(icon, text);
}

function adjustTextPosition(icon, text) {
    const iconRect = icon.getBoundingClientRect();
    const textRect = text.getBoundingClientRect();
    let offsetX = iconRect.left;
    let offsetY = (iconRect.top + window.scrollY);

    if(iconRect.left + textRect.width > window.innerWidth) {
        offsetX = iconRect.left - (iconRect.left + textRect.width - window.innerWidth + 50);
    }

    text.style.left = 'calc(' + offsetX + 'px + var(--code-annotation-offset))';
    text.style.top = 'calc(' + offsetY + 'px + var(--code-annotation-offset))';
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
    icon.innerHTML = plusIcon;
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
        showAnnotation({icon, text});
    } else {
        hideAnnotation({icon, text});
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
    if(areSelectedAnnotation()) {
        const {icon, text} = selectedAnnotation;
        adjustTextPosition(icon, text);
    } 
});