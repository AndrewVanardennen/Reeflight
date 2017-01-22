import ReefButton from './reef-button.js';
/**
 * ReefIconButton
 * @extends ReefButton
 */
export default class ReefIconButton extends ReefButton {
	/**
	 * Attributes to observer
	 * @return {Array} ['icon']
	 */
	static get observedAttributes() {
		return ['icon', 'no-shadow'];
	}
	/**
	 * Create icon-button
	 * @param {object} opts Default options
	 * @param {number} opts.width The desired height for the svg.
	 * @param {number} opts.height The desired width for the svg.
	 * @param {string} opts.color The color to fill.
	 * @param {string} opts.stroke The stroke color.
	 */
	constructor(opts={width: 40, height: 40, color: '#FFF', stroke: 'none'}) {
		super();

		this.noShadow = false;
		this._onIconsetAdded = this._onIconsetAdded.bind(this);
		window.addEventListener('svg-iconset-added', this._onIconsetAdded);
		let style = document.createElement('style');
		style.innerHTML = `
	:host {
		width: var(--reef-icon-button-size, ${opts.width}px);
		height: var(--reef-icon-button-size, ${opts.height}px);
		fill: var(--reef-icon-button-color, ${opts.color});
		stroke: var(--reef-icon-button-stroke-color, ${opts.stroke});
		--reef-button-radius: 50%;
		--reef-button-padding: var(--reef-icon-button-padding);
	}
	:host([toggled]) {
		--reef-icon-button-color: var(--reef-icon-button-toggled, #0097A7);
	}`;
		this.root.appendChild(style);
	}
	/**
	 * @return {Boolean}
	 */
	get toggles() {
		return this.hasAttribute('toggles');
	}
  /**
   * @param {Boolean} value
   */
  set toggled(value) {
   if (value) {
     this.setAttribute('toggled', '');
   } else {
     this.removeAttribute('toggled', '');
   }
   this._toggled = value;
  }
  /**
   * @return {Boolean}
   */
  get toggled() {
		return this._toggled || false;
  }
	/**
	 * Toggles the state of toggled
	 * @param {Object} event
	 */
	onMouseClick(event) {
		super.onMouseClick(event);
		if (this.toggles === true) {
			let toggled = this.toggled;
			if (toggled === false) {
				toggled = true;
			} else {
				toggled = false;
			}
			this.toggled = toggled;
			document.dispatchEvent(new CustomEvent('reef-icon-button-toggle', {
				detail: {target: this, value: toggled}
			}));
		}
	}
	/**
	 * Iconset
	 * @return {object} window.svgIconSet
	 * [checkout](svg-iconset.html) for more info.
	 */
	get iconset() {
		return window.svgIconset;
	}
	/**
	 * icon
	 * @param {string} value The desired icon.
	 * optional: you can create multiple iconsets
	 * by setting a different name on svg-iconset.
	 *
	 * **example:** ```html
	 * <svg-iconset name="my-icons">
	 *   <g id="menu">....</g>
	 * </svg-iconset>
	 * ```
	 * This means we can ask for the icon using a prefix
	 * **example:** ```html
	 * <reef-icon-button icon="my-icons::menu"></reef-icon-button>
	 * ```
	 */
	set icon(value) {
		if (value && this.iconset) {
			let parts = value.split('::');
			if (parts.length === 1) {
				this.iconset['icons'].host.applyIcon(this, value);
			} else {
				this.iconset[parts[0]].host.applyIcon(this, parts[1]);
			}
		} else if (!value && this.iconset) {
			let parts = this._icon.split('::');
			if (parts.length === 1) {
				this.iconset['icons'].host.removeIcon(this);
			} else {
				this.iconset[parts[0]].host.removeIcon(this);
			}
		}
		this._icon = value;
	}
	/**
	 * Applies the icon after iconset is added
	 */
	_onIconsetAdded() {
		if (this.hasAttribute('icon')) {
			this.icon = this.getAttribute('icon');
		}
	}
	/**
	 * Runs when attribute changes.
	 * @param {string} name The name of the attribute that changed.
	 * @param {string|object|array} oldValue
	 * @param {string|object|array} newValue
	 */
	attributeChangedCallback(name, oldValue, newValue) {
		if (oldValue !== newValue) this[name] = newValue;
	}
}
customElements.define('reef-icon-button', ReefIconButton);
