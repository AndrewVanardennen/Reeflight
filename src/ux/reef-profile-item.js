'use strict';
import utils from './../../node_modules/backed-utils/dist/utils-es.js';
Backed(class ReefProfileItem extends HTMLElement {
	static get observedAttributes() {
		return ['data-index'];
	}

	created() {
		this.root = this.attachShadow({mode: 'open'});
		// @template
		this._onDataChange = this._onDataChange.bind(this);
		this._onTimeChange = this._onTimeChange.bind(this);
	}

	attributeChangedCallback(name, oldVal, newVal) {
		if (oldVal !== newVal) this[utils.toJsProp(name)] = newVal;
	}

	set item(value) {
		this._profile = value;
	}
	set dataIndex(value) {
		this._dataIndex = value;
		this.setUpPubSubs(value);
	}
	get item() {
		return this._profile;
	}
	get dataIndex() {
		return this._dataIndex;
	}

	setUpPubSubs(index) {
		// setup observers, we setup the data observer first,
		// because the time observer publishes changes to it.
		PubSub.subscribe(`data[${index}]change`, this._onDataChange);
		PubSub.subscribe(`time[${index}]change`, this._onTimeChange);
	}

	_onDataChange(change) {
		// write to firebase
		let path = change.data.key.replace('.', '/');
		let dataUid = change.data.uid;
		try {
			let uid = firebase.auth().currentUser.uid;
			firebase.database().ref(`users/${uid}/profiles/${dataUid}/${path}`).set(change.data.value);
		} catch (error) {
			console.warn(error);
			// notify user to login save data to localstorage,
			// update the database when logged in
		}
	}

	_onTimeChange(change, oldValue) {
		let index = this.dataIndex;
		pubsub.publish(`data[${index}]change`, {dataIndex: index, data: change});
	}
});
