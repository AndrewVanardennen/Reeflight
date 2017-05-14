'use strict';
const earthRadius = 6378;
const pi = 3.14159265359;

export default Backed(class UserConnectionController extends HTMLElement {
	static get properties() {
		return {
			userOnline: {
				value: false,
				observer: '__onUserOnline__',
				global: true
			},
			mobileDetectReady: {
				value: false,
				observer: '__onUserOnline__'
			},
			isMobile: {
				value: () => {
					return Boolean(new MobileDetect(window.navigator.userAgent).mobile());
				}
			},

			position: {
				value: {
					latitude: null,
					longitude: null
				}
			},

			// TODO: Load devices (lights) from firebase
			devices: {
				value: [{
					uid: '001',
					settings: {
						inrangeMode: true,
						range: 100 // maximum range in meters
					},
					position: {
						longitude: 5.157689899999999,
						latitude: 51.013560999999996
					}
				}]
			}
		};
	}

	connected() {
		this.mobileDetectLoaded = this.mobileDetectLoaded.bind(this);

		requestIdleCallback(() => {
			const script = document.createElement('script');
			script.src = 'node_modules/mobile-detect/mobile-detect.js';
			script.setAttribute('async', '');
			script.onload = this.mobileDetectLoaded;

			this.appendChild(script);
		});
	}

	mobileDetectLoaded() {
		this.mobileDetectReady = true;
	}

	__onUserOnline__(change, oldValue) {
		const value = change.value;
		if (value !== oldValue &&
				oldValue !== undefined &&
				this.mobileDetectReady) {
			let uid = firebase.auth().currentUser.uid;
			this.createConnections(uid);
		}
	}

	createConnections(uid) {
		let inRangeRef = firebase.database().ref(`users/${uid}/inRange`);

		let connectionsRef = firebase.database().ref(`users/${uid}/connections`);

		// stores the timestamp of last disconnect (last time seen online)
		let lastOnlineRef = firebase.database().ref(`users/${uid}/lastOnline`);

		let connectedRef = firebase.database().ref('.info/connected');

		connectedRef.on('value', snap => {
			if (snap.val() === true) {
				let isMobile = this.isMobile();
				if (!this.geolocation && isMobile) {
					this.geolocation = navigator.geolocation.watchPosition(position => {
						let metersRatio = (this.devices[0].settings.range / earthRadius);
						let deviceLatitude = this.devices[0].position.latitude;
						let deviceLongitude = this.devices[0].position.longitude;
						let cos = Math.cos(deviceLatitude * pi/180);
						let maxLatitude = deviceLatitude + metersRatio * (180 / pi);
						let maxLongitude = deviceLongitude + metersRatio * (180 / pi) / cos;
						inRangeRef.set(Boolean(position.coords.latitude < maxLatitude &&
																		position.coords.longitude < maxLongitude));
					});
				}

				// TODO: Sync local data with firebase here
				// We're connected (or reconnected)!
				// Do anything here that should happen only if online (or on reconnect)

				// add this device to user connections list
				// this value could contain info about the device or a timestamp too
				let con = connectionsRef.push({
					mobile: isMobile,
					// inRange: this.inRange(),
					timestamp: firebase.database.ServerValue.TIMESTAMP
				});

				// when disconnecting, remove this device
				con.onDisconnect().remove();

				// when disconnecting, update the last time seen online
				lastOnlineRef.onDisconnect()
					.set(firebase.database.ServerValue.TIMESTAMP);
				} else if(this.geolocation) delete this.geolocation;
		});
	}


});
