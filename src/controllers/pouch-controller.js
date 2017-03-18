'use strict';
// import PubSub from './../internals/pubsub.js';

export default Backed(class PouchController extends HTMLElement {
	constructor() {
		super();
	}
	ready() {
		// TODO: @vandeurenglenn this could break things, note: @AndrewVanardennen
		// this.pubsub = new PubSub();
	}
	/**
	 * @private
	 */
	connectedCallback() {
		this._importPouchdb();
	}
	set pouchReady(value) {
		this._pouchReady = value;
	}

	get pouchReady() {
		return this._pouchReady || false;
	}
	/**
	 * @private
	 */
	_importPouchdb() {
		if (window.PouchDB !== undefined) {
			this.pouchReady = true;
			this.pubsub.publish('pouchdb.ready', this.pouchReady);
			pubsub.publish('pouchdb.ready', this.pouchReady);
			return;
		}
		const script = document.createElement('script');
		script.src = 'https://cdn.jsdelivr.net/pouchdb/6.1.0/pouchdb.min.js';
		script.setAttribute('async', '');
		script.onload = () => {
			this.pouchReady = true;
			// TODO: Fork PouchDB & run rollup on it
			this.pubsub.publish('pouchdb.ready', this.pouchReady);
		};
		this.appendChild(script);
	}
});
