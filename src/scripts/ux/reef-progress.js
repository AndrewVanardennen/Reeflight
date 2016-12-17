'use strict';
/**
 * @extends HTMLElement
 */
export default class ReefProgress extends HTMLElement {
	/**
	 * Attributes to observe
	 */
	static get observedAttributes() {
		return ['disabled', 'value'];
	}
	/**
	 * Calls super
	 */
	constructor() {
		super();
		this.root = this.attachShadow({mode: 'open'});
		this.root.innerHTML = `
	<style>
		:host {
			display: block;
			position: relative;
			width: 200px;
		}
		#progress {
			position: absolute;
			width: 100%;
			height: 4px;
      transform-origin: left center;
      transform: scaleX(0);
      will-change: transform;
			background: var(--reef-progress-color, var(--google-green-500));
		}
		.progress-background {
			position: absolute;
			width: 100%;
			height: 4px;
			background: var(--reef-progress-background, var(--paper-grey-300));
		}
		:host([disabled]) #progress {
      background:
				var(--reef-progress-disabled-color, var(--google-grey-500));
    }
		#progress.transiting {
			transition: transform ease 0.08s;
		}
	</style>
	<div class="progress-background"></div>
	<div id="progress"></div>
		`;
	}
	/**
	 * Runs when inserted
	 */
	connectedCallback() {
		this.setAttribute('role', 'progressbar');
	}
	/**
	 * @return {HTMLElement}
	 */
	get _progress() {
		return this.root.querySelector('#progress');
	}
	/**
	 * @param {number} value
	 */
	set value(value) {
		let ratio = this._calcRatio(value) * 100;
		this._transformProgress(ratio);
	}
	/**
	 * @param {Boolean} value
	 * @default false
	 */
	set disabled(value) {
		this.setAttribute('aria-disabled', value);
	}/**
   * @param {Number} value
   */
  set min(value) {
    this._min = value;
  }

  /**
   * @param {Number} value
   */
  set max(value) {
		this._max = value;
  }

  /**
   * @param {Number} value
   */
  set lastValue(value) {
    this._lastValue = value;
  }

  /**
   * @return {Number} attributeValue or 0
   */
  get value() {
    return this._value || 0;
  }

  /**
   * @return {Number} attributeValue or 0
   */
  get min() {
    return this._min || 0;
  }

  /**
   * @return {Number} attributeValue or 100
   */
  get max() {
    return this._max || 200;
  }

  /**
   * @return {Number} _lastValue or 0
   */
  get lastValue() {
    return this._lastValue || 0;
  }
	/**
	 * @param {Number} ratio
	 */
	_transformProgress(ratio) {
		let transform = 'scaleX(' + ratio / 100 + ')';
		requestAnimationFrame(() => {
			this._progress.style.transform = transform;
		});
	}
	/**
	 * Checks if value is between min & max
	 * Returns the min when lesser
	 * Returns the value of max when greater
	 * @param {Number} value number to check
	 * @param {Number} min
	 * @param {Number} max
	 * @return {Number}
	 */
	_between(value, min, max) {
    return (Math.min(max, Math.max(min, value)));
  }
	_calcRatio(value) {
    return (this._clampValue(value) - this.min) / (this.max - this.min);
  }
  _clampValue(value) {
    return Math.min(this.max, Math.max(this.min, this._calcStep(value)));
  }
  _calcStep(value) {
    // polymer/issues/2493
    value = parseFloat(value);
    if (!this.step) {
      return value;
    }
    let numSteps = Math.round((value - this.min) / this.step);
    if (this.step < 1) {
     /**
      * For small values of this.step, if we calculate the step using
      * `Math.round(value / step) * step` we may hit a precision point issue
      * eg. 0.1 * 0.2 =  0.020000000000000004
      * http://docs.oracle.com/cd/E19957-01/806-3568/ncg_goldberg.html
      *
      * as a work around we can divide by the reciprocal of `step`
      */
      return numSteps / (1.0001 / this.step) + this.min;
    } else {
      return numSteps * this.step + this.min;
    }
  }
}
customElements.define('reef-progress', ReefProgress);
