'use strict';
/**
 * @extends HTMLElement
 */
class ReefView extends HTMLElement {
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
    // Create shadow Dom
    this._root = this.attachShadow({mode: 'open'});

    this._onResize = this._onResize.bind(this);
    this.maxWidthChange = this.maxWidthChange.bind(this);
    this.widthChange = this.widthChange.bind(this);
  }

  /**
   * @return {HTMLElement} .shadow
   */
  get _shadow() {
    return this._root.querySelector('.shadow');
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
    this._root.innerHTML = `
      <style>
        :host {
          background-color: #ECEFF1;
          height: 100%;
        }
        .container {
          padding: var(--reef-view-padding, 24px);
          display: flex;
          flex-direction: var(--reef-view-container-direction, column);
        }
        .shadow {
          box-shadow: 0 2px 2px 0 rgba(0, 0, 0, 0.14),
                      0 1px 5px 0 rgba(0, 0, 0, 0.12),
                      0 3px 1px -2px rgba(0, 0, 0, 0.2);
          background-color: var(--reef-view-background, #FFF);
        }
        .no-shadow {
          box-shadow: none;
        }
        :host, .container {
          width: 100%;
          box-sizing: border-box;
        }
        :host, .shadow {
          width: 100%;
          Box-sizing: border-box;
        }
      </style>
      <span class="shadow">
        <div class="container"><slot></slot></div>
      </span>
    `;
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
