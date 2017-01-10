'use strict';
class ReefProfileOptionItem extends HTMLElement {
	static get observedAttributes() {
		return ['name'];
	}
	constructor() {
		super();
		this.root = this.attachShadow({mode: 'open'});
		// @template
	}
	attributeChangedCallback(name, oldVal, newVal) {
		if (oldVal !== newVal) {
			this[name] = newVal;
		}
	}
	get titleElement() {
		return this.root.querySelector('.title');
	}
	get name() {
		return this._name;
	}
	set name(value) {
		this._name = value;
		this.titleElement.innerHTML = value;
	}
}
customElements.define('reef-profile-option-item', ReefProfileOptionItem);
