'use strict';
import ArrayRepeat from
	'./../../../bower_components/array-repeat/dist/array-repeat.es.js';
/**
 * @extends ArrayRepeat
 */
export default class ReefList extends ArrayRepeat {
	/**
	 * Calls super
	 */
	constructor() {
		super();
	}
	/**
	 * Runs whenever inserted into dom
	 */
	connectedCallback() {
		super.connectedCallback();
		setTimeout(() => {
			let style = document.createElement('style');
			style.setAttribute('slot', 'style');
			style.innerHTML = `
		:host {
			display: flex;
			width: 100%;
			flex-flow: row wrap;
			justify-content: space-around;
			// height: 100%;
		}
		.array-repeat-item {
			display: flex;
			flex-direction: column;
			box-shadow: 0 2px 2px 0 rgba(0, 0, 0, 0.14),
									0 1px 5px 0 rgba(0, 0, 0, 0.12),
									0 3px 1px -2px rgba(0, 0, 0, 0.2);
			box-sizing: border-box;
			width: 100%;
			padding: 8px 16px;
			margin-bottom: 6px;
			background: #FFF;
			height: 420px;
			@apply(var(--reef-list-item));
		}
		@media (min-width: 840px) {
			.array-repeat-item {
				width: calc(50% - 6px);
			}
		}
		@media (min-width: 1280px) {
			.array-repeat-item {
				width: calc(100% / 3 - 6px);
			}
		}
			`;
			this.appendChild(style);
		}, 10);
	}
}
customElements.define('reef-list', ReefList);
