'use strict';
import OfflineDatabaseController from './offline-database-controller.js';
import utils from './../../node_modules/backed-utils/dist/utils-es.js';
/**
 * @extends OfflineDatabaseController
 */
export default Backed(class DatabaseController extends OfflineDatabaseController {
	static get observedAttributes() {
		return ['database'];
	}
	static get properties() {
		return {
			userOnline: {
				observer: '_onUserLogin',
				global: true
			}
		};
	}
	attributeChangedCallback(name, oldValue, newValue) {
		if (oldValue !== newValue) {
			this[utils.toJsProp(name)] = newValue;
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
	get offline() {
		return this._offline || false;
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
	_onUserLogin(change, oldValue) {
		if (change.value !== oldValue && oldValue) {
			this.getFirebaseData();
		}
		this._onDatabaseReady();
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
});
