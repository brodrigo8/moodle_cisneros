// This file is part of Moodle - http://moodle.org/
//
// Moodle is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// Moodle is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with Moodle.  If not, see <http://www.gnu.org/licenses/>.

/**
 * Keyboard initialization for a given html node.
 *
 * @module     core/keyboard_navigation
 * @copyright  2021 Moodle
 * @author     Mathew May <mathew.solutions>
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

import {space, enter, arrowRight, arrowLeft, arrowDown, arrowUp, home, end} from 'core/key_codes';

const SELECTORS = {
    'menuitem': '[role="menuitem"]',
    'menu': '[role="menu"]',
    'tab': '[role="tab"]',
};

let openDropdownNode = null;

/**
 * Small helper function to check if a given node is null or not.
 *
 * @param {HTMLElement|null} item The node that we want to compare.
 * @param {HTMLElement} fallback Either the first node or final node that can be focused on.
 * @return {HTMLElement}
 */
const clickErrorHandler = (item, fallback) => {
    if (item !== null) {
        return item;
    } else {
        return fallback;
    }
};

/**
 * Control classes etc of the selected dropdown item and its' parent <a>
 *
 * @param {HTMLElement} src The node within the dropdown the user selected.
 */
const menuItemHelper = src => {
    let parent;

    // Handling for dropdown escapes.
    // A bulk of the handling is already done by aria.js just add polish.
    if (src.classList.contains('dropdown-item')) {
        parent = src.closest('.dropdown-menu');
        const dropDownToggle = document.getElementById(parent.getAttribute('aria-labelledby'));
        dropDownToggle.classList.add('active');
        dropDownToggle.setAttribute('tabindex', 0);
    } else {
        parent = src.parentElement.parentElement.querySelector('.dropdown-menu');
    }
    // Remove active class from any other dropdown elements.
    Array.prototype.forEach.call(parent.children, node => {
        const menuItem = node.querySelector(SELECTORS.menuitem);
        if (menuItem !== null) {
            menuItem.classList.remove('active');
            // Remove aria selection states (aria-selected for tab roles, aria-current for menuitem roles).
            menuItem.removeAttribute('aria-selected');
            menuItem.removeAttribute('aria-current');
        }
    });
    // Set the applicable element's selection state.
    if (src.getAttribute('role') === 'tab') {
        src.setAttribute('aria-selected', 'true');
    } else {
        src.setAttribute('aria-current', 'true');
    }
};

/**
 * Defined keyboard event handling so we can remove listeners on nodes on resize etc.
 *
 * @param {event} e The triggering element and key presses etc.
 */
const keyboardListenerEvents = e => {
    const src = e.srcElement;
    const firstNode = e.currentTarget.firstElementChild;
    const lastNode = findUsableLastNode(e.currentTarget);

    // Handling for dropdown escapes.
    // A bulk of the handling is already done by aria.js just add polish.
    if (src.classList.contains('dropdown-item')) {
        if (e.keyCode === arrowRight ||
            e.keyCode === arrowLeft) {
            e.preventDefault();
            if (openDropdownNode !== null) {
                openDropdownNode.parentElement.click();
            }
        }
        if (e.keyCode === space ||
            e.keyCode === enter) {
            e.preventDefault();

            menuItemHelper(src);

            if (!src.parentElement.classList.contains('dropdown')) {
                src.click();
            }
        }
    } else if (src.getAttribute('role') === 'menuitem') {
        // Handle keyboard navigation if the element is rendered as a menu item.
        if (e.keyCode === arrowRight) {
            e.preventDefault();
            setFocusNext(src, firstNode);
        }
        if (e.keyCode === arrowLeft) {
            e.preventDefault();
            setFocusPrev(src, lastNode);
        }
        // Let aria.js handle the dropdowns.
        if (e.keyCode === arrowUp ||
            e.keyCode === arrowDown) {
            openDropdownNode = src;
            e.preventDefault();
        }
        if (e.keyCode === home) {
            e.preventDefault();
            setFocusHomeEnd(firstNode);
        }
        if (e.keyCode === end) {
            e.preventDefault();
            setFocusHomeEnd(lastNode);
        }
        if (e.keyCode === space ||
            e.keyCode === enter) {
            e.preventDefault();
            // Aria.js handles dropdowns etc.
            if (!src.parentElement.classList.contains('dropdown')) {
                src.click();
            }
        }
    }
};

/**
 * Defined click event handling so we can remove listeners on nodes on resize etc.
 *
 * @param {event} e The triggering element and key presses etc.
 */
const clickListenerEvents = e => {
    const src = e.srcElement;
    menuItemHelper(src);
};

/**
 * The initial entry point that a given module can pass a HTMLElement.
 *
 * @param {HTMLElement} elementRoot The menu to add handlers upon.
 */
export default elementRoot => {
    // Remove any and all instances of old listeners on the passed element.
    elementRoot.removeEventListener('keydown', keyboardListenerEvents);
    elementRoot.removeEventListener('click', clickListenerEvents);
    // (Re)apply our event listeners to the passed element.
    elementRoot.addEventListener('keydown', keyboardListenerEvents);
    elementRoot.addEventListener('click', clickListenerEvents);
};

/**
 * Handle the focusing to the next element in the dropdown.
 *
 * @param {HTMLElement|null} currentNode The node that we want to take action on.
 * @param {HTMLElement} firstNode The backup node to focus as a last resort.
 */
const setFocusNext = (currentNode, firstNode) => {
    const listElement = currentNode.parentElement;
    const nextListItem = listElement.nextElementSibling;
    const nodeToSelect = clickErrorHandler(nextListItem, firstNode);
    const parent = listElement.parentElement;
    const isTabList = parent.getAttribute('role') === 'tablist';
    const itemSelector = isTabList ? SELECTORS.tab : SELECTORS.menuitem;
    const menuItem = nodeToSelect.querySelector(itemSelector);
    menuItem.focus();
};

/**
 * Handle the focusing to the previous element in the dropdown.
 *
 * @param {HTMLElement|null} currentNode The node that we want to take action on.
 * @param {HTMLElement} lastNode The backup node to focus as a last resort.
 */
const setFocusPrev = (currentNode, lastNode) => {
    const listElement = currentNode.parentElement;
    const nextListItem = listElement.previousElementSibling;
    const nodeToSelect = clickErrorHandler(nextListItem, lastNode);
    const parent = listElement.parentElement;
    const isTabList = parent.getAttribute('role') === 'tablist';
    const itemSelector = isTabList ? SELECTORS.tab : SELECTORS.menuitem;
    const menuItem = nodeToSelect.querySelector(itemSelector);
    menuItem.focus();
};

/**
 * Focus on either the start or end of a nav list.
 *
 * @param {HTMLElement} node The element to focus on.
 */
const setFocusHomeEnd = node => {
    node.querySelector(SELECTORS.menuitem).focus();
};

/**
 * We need to look within the menu to find a last node we can add focus to.
 *
 * @param {HTMLElement} elementRoot Menu to find a final child node within.
 * @return {HTMLElement}
 */
const findUsableLastNode = elementRoot => {
    const lastNode = elementRoot.lastElementChild;

    // An example is the more menu existing but hidden on the page for the time being.
    if (!lastNode.classList.contains('d-none')) {
        return elementRoot.lastElementChild;
    } else {
        // Cast the HTMLCollection & reverse it.
        const extractedNodes = Array.prototype.map.call(elementRoot.children, node => {
            return node;
        }).reverse();

        // Get rid of any nodes we can not set focus on.
        const nodesToUse = extractedNodes.filter((node => {
            if (!node.classList.contains('d-none')) {
                return node;
            }
        }));

        // If we find no elements we can set focus on, fall back to the absolute first element.
        if (nodesToUse.length !== 0) {
            return nodesToUse[0];
        } else {
            return elementRoot.firstElementChild;
        }
    }
};
