'use strict';
class ReefProfileOption extends HTMLElement {

	constructor() {
		super();
		this.root = this.attachShadow({mode: 'open'});
		// @template
	}
}
customElements.define('reef-profile-option', ReefProfileOption);
