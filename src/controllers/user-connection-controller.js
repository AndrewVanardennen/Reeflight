'use strict';
// import PubSub from './../internals/pubsub.js';
// window.pubsub = window.pubsub || new PubSub();
import Backed from './../../node_modules/backed/dist/backed-es.js';
export default Backed(class UserConnectionController extends HTMLElement {
	static get properties() {
		return {
			userOnline: {
				value: false,
				observer: '__onUserOnline__',
				global: true
			}
		};
	}
	__onUserOnline__(change, oldValue) {
		const value = change.value;
		if (value !== oldValue && oldValue !== undefined) {
			let uid = firebase.auth().currentUser.uid;
			this.createConnections(uid);
		}
	}
	createConnections(uid) {
		let connectionsRef = firebase.database().ref(`users/${uid}/connections`);

		// stores the timestamp of last disconnect (last time seen online)
		let lastOnlineRef = firebase.database().ref(`users/${uid}/lastOnline`);

		let connectedRef = firebase.database().ref('.info/connected');

		connectedRef.on('value', snap => {
			if (snap.val() === true) {
				// We're connected (or reconnected)!
				// Do anything here that should happen only if online (or on reconnect)

				// add this device to user connections list
				// this value could contain info about the device or a timestamp too
				let con = connectionsRef.push(true);

				// when disconnecting, remove this device
				con.onDisconnect().remove();

				// when disconnecting, update the last time seen online
				lastOnlineRef.onDisconnect()
					.set(firebase.database.ServerValue.TIMESTAMP);
				}
		});
	}

});
