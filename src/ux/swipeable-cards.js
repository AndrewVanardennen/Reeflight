'use strict';
import Backed from './../../node_modules/backed/dist/backed-es.js';
import './swipeable-card.js';
/**
 * @class SwipeableCards
 * @extends HTMLElement
 */
export default class SwipeableCards extends HTMLElement {
	connected() {
		this.style.display = 'flex';
		let cards = this.querySelectorAll('swipeable-card');
		let cardsDefined = cards.map(card => {
			return customElements.whenDefined(card.localName);
		});
		Promise.all(cardsDefined).then(() => {
			console.log('cards ready');
		});
	}
}
customElements.define('swipeable-cards', SwipeableCards);
