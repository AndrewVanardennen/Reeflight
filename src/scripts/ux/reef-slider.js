import ReefProgress from './reef-progress';
/**
 * ReefSlider
 * @extends HTMLElement
 */
class ReefSlider extends ReefProgress {

  /**
   * observedAttributes
   */
  static get observedAttributes() {
    return ['value'];
  }

  /**
   * Creates shadowRoot & binds methods
   */
  constructor() {
    super();
    this._mousedown = this._mousedown.bind(this);
    this._mouseup = this._mouseup.bind(this);
    this._click = this._click.bind(this);
		let style = document.createElement('style');
    style.innerHTML = `
	:host {
    display: inline-flex;
    flex-direction: row;
    align-items: center;
    height: 16px;
		box-sizing: border-box;
    cursor: pointer;
    --reef-slider-container-color: var(--paper-grey-300);
    --reef-slider-color: var(--paper-cyan-700);
    --reef-slider-knob-color: var(--paper-amber-a700);
  }
  paper-progress {
    --paper-progress-container-color: var(--reef-slider-container-color);
    --paper-progress-active-color: var(--reef-slider-color);
  }
  .slider-knob {
    width: 16px;
    height: 16px;
    border-radius: 50%;
    background: var(--reef-slider-knob-color);
    transform: translateX(-8px);
		transform-origin: left center;
    z-index: 10;
  }
  :host[square] .slider-knob {
    border-radius: 3px;
  }
		`;

    this.sliderKnob = document.createElement('div');
		this.sliderKnob.classList.add('slider-knob');
		this.root.appendChild(style);
		this.root.appendChild(this.sliderKnob);
  }

  /**
   * @param {Number} value
   */
  set value(value) {
    this._value = value;
		super.value = value;
		// value *= 2;
		// value -= 16;
		requestAnimationFrame(() => {
			let ratio = this._calcRatio(value) * 100;
			// console.log((ratio / 100));
			// value = (((ratio / 100) * 2) - 8);
			// 	if (value < -8) {
			// 		value = -8;
			// 	} else if (value > 192) {
			// 		value = 192;
			// 	}
			this.sliderKnob.style.transform = 'translateX(' + ((ratio * 2) - 8) + 'px)';
		});
  }

  /**
   * @return {Boolean} true when square is set else false
   */
  get square() {
    return this.hasAttribute('square');
  }

  /**
   * Runs when an attribute set in observedAttributes changes
   * @param {String} name name of the attribute that changed
   * @param {String} oldVal Last known value
   * @param {String} newVal Current value
   */
  attributeChangedCallback(name, oldVal, newVal) {
    if (oldVal !== newVal) {
      this[name] = newVal;
    }
  }
  /**
   * Runs when inserted in document,
   * Stamps innerHTML, set's up eventListeners
   */
  connectedCallback() {
		super.connectedCallback();
    // Needed for tabbing
    this.tabIndex = 0;
    // setup event listeners
    this.addEventListener('mousedown', this._mousedown);
    this.addEventListener('mouseup', this._mouseup);
    this.addEventListener('click', this._click);
  }
  /**
   * @param {Number} x current value
   * @param {Number} _x previous value of x
   * @return {Number} result
   */
  _calculateChange(x, _x) {
    let result = Number();
    if (_x < x) {
      x -= _x;
      result = x;
    } else if (_x > x) {
      _x -= x;
      result = _x;
    }
    return result;
  }

  /**
   * Updates the value
   */
  _mouseup() {
    event.preventDefault();
    let value = this._calculateChange(event.clientX, this.startX);
    // let progressValue = this.value;

    if (event.clientX < this.startX) {
      this.value = this._between((this.lastValue - value), 0, this.max);
    } else if(event.clientX > this.startX) {
      this.value = this._between((this.lastValue + value), 0, this.max);
    }
    this.lastValue = this.value;
  }

  /**
   * Sets startX for calculating change
   * @param {Object} event
   */
  _mousedown(event) {
    event.preventDefault();
    this.startX = event.clientX;
  }

  /**
   * Updates the value
   * @param {Object} event
   */
  _click(event) {
    event.preventDefault();
    let clientLeft = this.getBoundingClientRect().left;
    this.value = this._between(
      ((event.clientX - clientLeft) - 8), 0, this.max);
  }

  /**
   * @param {Number} value The value to check
   * @param {Number} min The min allowed value to return
   * @param {Number} max The max allowed value to return
   * @return {Number} between min and max, min or max
   */
  _between(value, min, max) {
    return (Math.min(max, Math.max(min, value)));
  }
}
customElements.define('reef-slider', ReefSlider);
