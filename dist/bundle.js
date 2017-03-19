(function () {
'use strict';

/* eslint-env browser */

// generates custom events
// `emitter` is a DOM node
// `options` is passed through to `CustomEvent` (cf.
// https://developer.mozilla.org/en-US/docs/Web/API/Event/Event#Values)
function dispatchEvent(emitter, name, payload, options = {}) {
	if(payload) {
		options.detail = payload;
	}
	let ev = new CustomEvent(name, options);
	emitter.dispatchEvent(ev);
}

var classCallCheck = function (instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
};

var createClass = function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);
    if (staticProps) defineProperties(Constructor, staticProps);
    return Constructor;
  };
}();









var inherits = function (subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
  }

  subClass.prototype = Object.create(superClass && superClass.prototype, {
    constructor: {
      value: subClass,
      enumerable: false,
      writable: true,
      configurable: true
    }
  });
  if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
};











var possibleConstructorReturn = function (self, call) {
  if (!self) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }

  return call && (typeof call === "object" || typeof call === "function") ? call : self;
};

/* eslint-env browser */
var BTN = "button"; // poor man's symbol/atom

// NB: unfortunately, subclassing native elements (i.e. `HTMLButtonElement` /
//     `<button is="toggle-button">`) is contentious and not universally
//     supported, so we need to rely on an otherwise pointless container element
//     to serve as proxy for the actual button

var ToggleButton = function (_HTMLElement) {
	inherits(ToggleButton, _HTMLElement);

	function ToggleButton() {
		classCallCheck(this, ToggleButton);
		return possibleConstructorReturn(this, (ToggleButton.__proto__ || Object.getPrototypeOf(ToggleButton)).apply(this, arguments));
	}

	createClass(ToggleButton, [{
		key: "connectedCallback",
		value: function connectedCallback() {
			if (this.querySelector(BTN)) {
				// ensure idempotence
				return;
			}

			var btn = document.createElement(BTN);
			btn.type = BTN;
			// TODO: rename attribute? (initial state only; not sync'd)
			btn.setAttribute("aria-pressed", "" + this.hasAttribute("pressed"));
			btn.textContent = this.textContent;

			this.innerHTML = "";
			this.appendChild(btn);

			btn.addEventListener("click", this.toggle.bind(this));
		}
	}, {
		key: "toggle",
		value: function toggle(ev) {
			var btn = this.button;
			var pressed = !this.pressed; // XXX: inefficient; repeated `#button` invocation
			btn.setAttribute("aria-pressed", "" + pressed);

			dispatchEvent(this.emitter, "toggle", { pressed: pressed }); // TODO: rename?
		}

		// TODO: memoize getters? would require `MutationObserver` to reset cache

	}, {
		key: "pressed",
		get: function get$$1() {
			return this.button.getAttribute("aria-pressed") === "true";
		}
	}, {
		key: "emitter",
		get: function get$$1() {
			// default to relative selector (i.e. prefer ancestors over global selectors)
			var selector = this.getAttribute("emitter");
			if (selector) {
				return this.closest(selector);
			}

			selector = this.getAttribute("global-emitter"); // TODO: support multiple?
			return document.querySelector(selector) || this;
		}
	}, {
		key: "button",
		get: function get$$1() {
			return this.querySelector(BTN);
		}
	}]);
	return ToggleButton;
}(HTMLElement);

/* eslint-env browser */
customElements.define("toggle-button", ToggleButton);

}());
