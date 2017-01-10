'use strict';
/**
 * @extends HTMLElement
 */
export default class SwipeableCard extends HTMLElement {
	/**
	 * Calls super
	 */
	constructor() {
		super();
		this.root = this.attachShadow({mode: 'open'});
		this.root.innerHTML = `
	<style>
		:host {
			width: 100%;
			cursor: pointer;
			box-shadow: 0 2px 2px 0 rgba(0, 0, 0, 0.14),
									0 1px 5px 0 rgba(0, 0, 0, 0.12),
									0 3px 1px -2px rgba(0, 0, 0, 0.2);
		}
		:host(.swiped) {
			display: none;
		}
	</style>
	<slot></slot>
		`;
	}
	/**
	 * Runs when inserted into document
	 */
	connectedCallback() {
		this._onTouchStart = this._onTouchStart.bind(this);
    this._onTouchMove = this._onTouchMove.bind(this);
    this._onTouchEnd = this._onTouchEnd.bind(this);
    this.render = this.render.bind(this);
		this.reset = this.reset.bind(this);
    this.targetBCR = null;
    this.target = null;
    this.startX = 0;
    this.currentX = 0;
    this.screenX = 0;
    this.targetX = 0;

		this.addEventListener('touchstart', this._onTouchStart);
    this.addEventListener('touchmove', this._onTouchMove);
    this.addEventListener('touchend', this._onTouchEnd);

    this.addEventListener('mousedown', this._onTouchStart);
    this.addEventListener('mousemove', this._onTouchMove);
    this.addEventListener('mouseup', this._onTouchEnd);

    requestAnimationFrame(this.render);
	}
	/**
	 * @param {boolean} value
	 */
	set dragging(value) {
		this._dragging = value;
	}
	/**
	 * @param {object} value
	 */
	set boundingClientRect(value) {
		this._boundingClientRect = value;
	}
	/**
	 * @return {boolean}
	 * @default false
	 */
	get dragging() {
		return this._dragging || false;
	}
	/**
	 * @return {object}
	 */
	get boundingClientRect() {
		return this._boundingClientRect;
	}
	/**
	 * @return {number}
	 */
	get threshold() {
		return this.boundingClientRect.width * 0.35;
	}
	/**
	 * @param {object} event
	 */
	_onTouchStart(event) {
		this.reset();
		this.boundingClientRect = this.getBoundingClientRect();
		this.startX = event.pageX || event.touches[0].pageX;
		this.currentX = this.startX;
		this.style.willChange = 'transform';
		this.dragging = true;
	}
	/**
	 * @param {object} event
	 */
	_onTouchMove(event) {
		if (this.dragging) this.currentX = event.pageX || event.touches[0].pageX;
	}
	/**
	 * @param {object} event
	 */
	_onTouchEnd(event) {
		const x = this.currentX - this.startX;
		const width = this.boundingClientRect.width;
		this.x = 0;
		if (Math.abs(x) > this.threshold) {
			this.x = (x > 0) ? width : -width;
		};
		this.lastDragging = this.dragging;
		this.dragging = false;
	}
	/**
	 *
	 */
	render() {
		requestAnimationFrame(this.render);
		if (this.dragging === false && this.lastDragging === false) return;
		if (this.boundingClientRect) {
			const width = this.boundingClientRect.width;
			let x = this.screenX || 0;
			if (this.dragging && this.currentX)
				x = this.currentX - this.startX;
			else
				x += (this.x - x) / 2;

			const normalizedDistance = (Math.abs(x) / width);
			const opacity = 1 - Math.pow(normalizedDistance, 4);

			this.style.transform = `translateX(${x}px)`;
			this.style.opacity = opacity;
			this.screenX = x;
			if (this.dragging) return;
			const isNearlyInvisible = (opacity < 0.65);

			if (isNearlyInvisible) {
				this.classList.add('swiped');
				this.reset();
			}	else
				this.reset();
		}
		this.lastDragging = this.dragging;
	}

	reset() {
		this.dragging = false;
		this.style.willChange = 'initial';
    this.style.transform = 'none';
		this.style.opacity = 1;
		this.screenX = 0;
		this.currentX = 0;
		this.startX = 0;
		this.x = 0;
	}
}
customElements.define('swipeable-card', SwipeableCard);
