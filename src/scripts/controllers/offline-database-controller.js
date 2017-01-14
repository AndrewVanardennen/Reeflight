'use strict';
import PouchController from './pouch-controller.js';
import toJsProp from './../../../node_modules/backed/src/methods/to-js-prop.js';
import PubSub from './../internals/pubsub.js';
window.pubsub = window.pubsub || new PubSub();
/**
 * @extends PouchController
 */
export default class OfflineDatabaseController extends PouchController {
	static get observedAttributes() {
		return ['database'];
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
	set database(value) {
		this._database = value;
		this._onDatabaseReady;
	}
	get database() {
		return this._database;
	}
	_onDatabaseReady() {
		if (this.database && this.pouchReady) {
			this.pouch = new PouchDB(this.database);
			pubsub.publish(`database.${this.database}.ready`, true);
		}
	}
}
customElements.define('offline-database-controller', OfflineDatabaseController);
