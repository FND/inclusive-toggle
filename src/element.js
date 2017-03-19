/* eslint-env browser */
import { dispatchEvent } from "uitil/dom/events";

const BTN = "button"; // poor man's symbol/atom

// NB: unfortunately, subclassing native elements (i.e. `HTMLButtonElement` /
//     `<button is="toggle-button">`) is contentious and not universally
//     supported, so we need to rely on an otherwise pointless container element
//     to serve as proxy for the actual button
export default class ToggleButton extends HTMLElement {
	connectedCallback() {
		if(this.querySelector(BTN)) { // ensure idempotence
			return;
		}

		let btn = document.createElement(BTN);
		btn.type = BTN;
		// TODO: rename attribute? (initial state only; not sync'd)
		btn.setAttribute("aria-pressed", `${this.hasAttribute("pressed")}`);
		btn.textContent = this.textContent;

		this.innerHTML = "";
		this.appendChild(btn);

		btn.addEventListener("click", this.toggle.bind(this));
	}

	toggle(ev) {
		let btn = this.button;
		let pressed = !this.pressed; // XXX: inefficient; repeated `#button` invocation
		btn.setAttribute("aria-pressed", `${pressed}`);

		dispatchEvent(this.emitter, "toggle", { pressed }); // TODO: rename?
	}

	// TODO: memoize getters? would require `MutationObserver` to reset cache

	get pressed() {
		return this.button.getAttribute("aria-pressed") === "true";
	}

	get emitter() {
		// default to relative selector (i.e. prefer ancestors over global selectors)
		let selector = this.getAttribute("emitter");
		if(selector) {
			return this.closest(selector);
		}

		selector = this.getAttribute("global-emitter"); // TODO: support multiple?
		return document.querySelector(selector) || this;
	}

	get button() {
		return this.querySelector(BTN);
	}
}
