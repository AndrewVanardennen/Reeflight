'use strict';
/**
 * @extends HTMLElement
 */
export default class ReefView extends HTMLElement {
  /**
   * Attributes to observer
   * @return {Array} ['no-shadow']
   */
  static get observedAttributes() {
    return ['no-shadow'];
  }

  /**
   * Creates shadowRoot & binds methods
   */
  constructor() {
    super();
    this.root = this.attachShadow({mode: 'open'});
		// @template
    this._onResize = this._onResize.bind(this);
    this.maxWidthChange = this.maxWidthChange.bind(this);
    this.widthChange = this.widthChange.bind(this);
  }

  /**
   * @return {HTMLElement} .shadow
   */
  get _shadow() {
    return this.root.querySelector('.shadow');
  }

  /**
   * @param {Boolean} value add's the 'no-shadow' class when true,
   * removes the 'no-shadow' class when false
   */
  set noShadow(value) {
    if (this.hasNoShadow) {
      this._shadow.classList.add('no-shadow');
    } else {
      this._shadow.classList.remove('no-shadow');
    }
  }

  /**
   * @return {Boolean}
   */
  get hasNoShadow() {
    return this.hasAttribute('no-shadow');
  }

  /**
   * Stamps innerHTML, add's eventListeners, runs _onResize
   */
  connectedCallback() {
    window.addEventListener('resize', this._onResize);
    this._onResize();
  }

  /**
   * @param {Object} mq
   */
  widthChange(mq) {
    if (mq.matches) {
      this._shadow.style.width = '72.2%';
      this._shadow.style.paddingTop = '8px 16px';
    }
  }

  /**
   * @param {Object} mq
   */
  maxWidthChange(mq) {
    if (mq.matches) {
      this._shadow.style.width = '100%';
    }
  }

  /**
   * Runs everytime the window resizes
   */
  _onResize() {
    if (matchMedia) {
      let mq = window.matchMedia( '(min-width: 680px)');
      let mqMax = window.matchMedia('(max-width: 679px)');
      mq.addListener(this.widthChange);
      this.widthChange(mq);
      mqMax.addListener(this.maxWidthChange);
      this.maxWidthChange(mqMax);
    }
  }

  /**
   * Runs whenever attribute changes are detected
   * @param {string} name The name of the attribute that changed.
   * @param {string|object|array} oldValue
   * @param {string|object|array} newValue
   */
  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue !== newValue) {
      this[this._toJsProp(name)] = newValue;
    }
  }

  /**
   * @param {String} string
   * @return {String}
   */
  _toJsProp(string) {
    let parts = string.split('-');
    if (parts.length > 1) {
      let upper = parts[1].charAt(0).toUpperCase();
      string = parts[0] + upper + parts[1].slice(1).toLowerCase();
    }
    return string;
  }
}
customElements.define('reef-view', ReefView);
