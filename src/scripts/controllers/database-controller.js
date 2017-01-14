'use strict';
import OfflineDatabaseController from './offline-database-controller.js';
import toJsProp from './../../../node_modules/backed/src/methods/to-js-prop.js';
/**
 * @extends OfflineDatabaseController
 */
export default class DatabaseController extends OfflineDatabaseController {
	static get observedAttributes() {
		return ['database'];
	}
	constructor() {
		super();
		this._onUserLogin = this._onUserLogin.bind(this);
		pubsub.subscribe('user.online', this._onUserLogin);
	}
	attributeChangedCallback(name, oldValue, newValue) {
		if (oldValue !== newValue) {
			this[toJsProp(name)] = newValue;
		}
	}
	set database(value) {
		super.database = value;
		this._setupPubSubs(value);
	}
	get database() {
		return super.database;
	}
	set offline(value) {
		this._offline = value;
	}
	set userOnline(value) {
		this._userOnline = value;
		if (value === true) {
			this.getFirebaseData();
		}
		this._onDatabaseReady();
	}
	get offline() {
		return this._offline || false;
	}
	get userOnline() {
		return this._userOnline || false;
	}
	set firebaseData(value) {
		this._firebaseData = value;
	}
	get firebaseData() {
		return this._firebaseData || null;
	}
	_setupPubSubs(database) {
		if (database === undefined || database == null) {
			return console.warn(`name is ${database}`);
		}
		this._handleData();
	}
	_onUserLogin(newValue, oldValue) {
		if (oldValue !== newValue) this.userOnline = newValue;
	}
	getFirebaseData() {
		let uid = firebase.auth().currentUser.uid;
		this.databaseLocation = `users/${uid}/${this.database}`;
		this._getFirebaseData(this.database, uid);
	}
	_getFirebaseData(databaseName) {
		firebase.database().ref(this.databaseLocation).on('value', snap => {
			let data = snap.val();
			this.firebaseData = data;
			this._handleData();
		});
	}
	_onDatabaseReady() {
		super._onDatabaseReady();
		if (this.userOnline && this.offline === false) {
			// handle data when online
			this._handleData();
		}
	}
	_splitRef(ref) {
		let result = ref.split('-');
		return Number(result[0]);
	}
	_handleData() {
		let name = this.database;
		let data = this.firebaseData;
		if (this.pouch && data !== null && data._rev === null) {
			this.pouch.put(data, (error, result) => {
				if (!error) {
					firebase.database().ref(`${this.databaseLocation}/_rev`)
						.set(result.rev);
					console.log(`Local ${name}-database created`);
				} else {
					console.warn(error);
				}
			});
		} else if (this.pouch && data !== null) { // && pouchdata
			this.pouch.get(name).then(doc => {
				if (doc._rev === data._rev) {
					console.log(`Local ${name}-database up to date`);
					return;
				} else if (this._splitRef(doc._rev) > this._splitRef(data._rev)) {
					console.log(`Syncing firebase with local ${name}-database`);
					firebase.database().ref(this.databaseLocation).set(doc);
				} else if (this._splitRef(doc._rev) < this._splitRef(data._rev)) {
					console.log(`Syncing local ${name}-database with firebase`);
					this.pouch.put(data, (error, result) => {
						if (!error) {
							firebase.database().ref(`${this.databaseLocation}/_rev`)
								.set(result.rev);
							console.log(`Local ${name}-database created`);
						} else {
							console.warn(error);
						}
					});
				}
			}).catch(err => {
				if (err.status === 404 && data !== null) {
					data._id = `${name}`;
					this.pouch.put(data, (error, result) => {
						if (!error) {
							firebase.database().ref(`${this.databaseLocation}/_rev`)
								.set(result.rev);
							console.log(`Local ${name}-database created`);
						} else {
							console.warn(error);
						}
					});
				}
			});
		}
	}
}
customElements.define('database-controller', DatabaseController);
