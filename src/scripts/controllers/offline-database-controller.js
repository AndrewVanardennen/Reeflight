'use strict';
import toJsProp from './../../../node_modules/backed/src/methods/to-js-prop.js';
import PubSub from './../internals/pubsub.js';
window.pubsub = window.pubsub || new PubSub();
export default class OfflineDatabaseController extends HTMLElement {
	static get observedAttributes() {
		return ['name'];
	}
	/**
	 * @private
	 */
	constructor() {
		super();
		this.pubsub = new PubSub();
		this._onDatabaseReady = this._onDatabaseReady.bind(this);
		this.pubsub.subscribe('pouchdb.ready', this._onDatabaseReady);
	}
	attributeChangedCallback(name, oldValue, newValue) {
		if (oldValue !== newValue) {
			this[toJsProp(name)] = newValue;
		}
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
	set database(value) {
		this._database = value;
		this._onDatabaseReady;
	}
	get pouchReady() {
		return this._pouchReady || false;
	}
	get database() {
		return this._database;
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
	_onDatabaseReady() {
		if (this.database && this.pouchReady) {
			pubsub.publish(`${this.database}.database.ready`, true);
		}
	}
}
customElements.define('offline-database-controller', OfflineDatabaseController);
