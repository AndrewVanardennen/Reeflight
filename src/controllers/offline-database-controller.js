'use strict';
import PouchController from './pouch-controller.js';
import utils from './../../node_modules/backed-utils/dist/utils-es.js';
import DatabaseOfflineMixin from './../mixins/database-offline-mixin.js';
// import PubSub from './../internals/pubsub.js';
// window.pubsub = window.pubsub || new PubSub();
/**
 * @extends PouchController
 */
export default Backed(class OfflineDatabaseController extends DatabaseOfflineMixin(PouchController) {
	static get observedAttributes() {
		return ['database'];
	}

	// static get properties() {
	// 	return {
	// 		userOnline: {
	// 			value: false,
	// 			observer: '_onUserLogin',
	// 			global: true,
	// 			strict: false
	// 		}
	// 	};
	// }
	attributeChangedCallback(name, oldValue, newValue) {
		if (oldValue !== newValue) {
			this[utils.toJsProp(name)] = newValue;
		}
	}
	set database(value) {
		this._database = value;
		// this._pouchdbReady();
	}
	get database() {
		return this._database;
	}
	_pouchdbReady() {
		if (this.database && this.pouchReady) {
			this.pouch = new PouchDB(this.database);
			pubsub.publish(`database.${this.database}.ready`, true);
		}
	}
});
