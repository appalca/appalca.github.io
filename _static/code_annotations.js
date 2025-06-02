const regex = /#\(\d+\)!/g;

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
    icon.setAttribute('src', '../_static/plus.svg');
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

    icon.setAttribute('src', '../_static/cross.svg');
    icon.style.zIndex = "2";

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
    const icon = document.createElement("img");
    icon.setAttribute('src', '../_static/plus.svg');
    icon.setAttribute('height', '16');
    icon.setAttribute('width', '16');
    icon.setAttribute('class', 'code-annotation-icon');
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