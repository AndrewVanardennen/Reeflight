'use strict';
import './reef-drawer-heading.js';
import './reef-drawer-footer.js';
/**
 * @extends HTMLElement
 */
export default Backed(class ReefDrawer extends HTMLElement {
  /**
   * @param {Object} opts
   * @param {Number} width
   * @param {Boolean} drawerLeft
   */
  created(opts={width: 256, drawerLeft: true}) {
    this.root = this.attachShadow({mode: 'open'});
		// @template
    this.width = opts.width;
    this.drawerLeft = opts.drawerLeft;
  }

	ready() {
    this._onClick = this._onClick.bind(this);
	}

  /**
   * @return {Boolean}
   */
  get forcedShow() {
    return this.hasAttribute('force-show');
  }

  /**
   * @param {Boolean} value
   */
  set opened(value) {
    this._opened = value;
    if (value) {
      this.setAttribute('opened', '');
    } else {
      this.removeAttribute('opened');
    }
  }

  /**
   * @return {Boolean}
   */
  get opened() {
    return this._opened;
  }

  /**
   * @param {Number} value
   */
  set width(value) {
    if (value === undefined) value = 256;
    this._width = value;
    this.style.setProperty('--reef-drawer-width', `${value}px`);
  }

  /**
   * @return {Number}
   */
  get width() {
    return this._width;
  }

  /**
   * @return {Boolean}
   */
  get drawerRight() {
    return this._drawerRight;
  }

  /**
   * @return {Boolean}
   */
  get drawerLeft() {
    return this._drawerLeft;
  }

  /**
   * @param {Boolean} value
   */
  set drawerLeft(value) {
    if (value) {
      this.classList.add('drawer-left');
      this.drawerRight = false;
    } else {
      this.classList.remove('drawer-left');
      this._drawerLeft = false;
    }
  }

  /**
   * @param {Boolean} value
   */
  set drawerRight(value) {
    if (value) {
      this.classList.add('drawer-right');
      this.drawerLeft = false;
    } else {
      this.classList.remove('drawer-right');
      this._drawerRight = false;
    }
  }

  /**
   * Stamps innerHTML
   */
  connectedCallback() {
		// @template
    this.addEventListener('click', this._onClick);
    if (this.forcedShow) {
      this.opened = true;
    }
  }

  /**
   * stops event propagation
   */
  _onClick() {
    event.stopPropagation();
  }
	});
