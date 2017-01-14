import PouchController from './../controllers/pouch-controller.js';
import './../ux/reef-slider.js';
import './../ux/time-input.js';
import './../../../bower_components/time-picker/dist/time-picker.js';
// import './../../../bower_components/array-repeat/dist/array-repeat.js';
import profiles from './../../sources/profiles.json';
import './../ux/reef-list.js';
import './../ux/reef-profile-item.js';
import './../ux/reef-profile-option-item.js';
import './../ux/reef-profile-option.js';
/**
 * @extends HTMLElement
 */
class ProfilesView extends PouchController {
  /**
   * Creates shadowRoot
   */
  constructor() {
    super();
    this.root = this.attachShadow({mode: 'open'});
		this._onClick = this._onClick.bind(this);
		this._onProfileChange = this._onProfileChange.bind(this);
		this._onUserLogin = this._onUserLogin.bind(this);
		this._pouchReady = this._pouchReady.bind(this);
		pubsub.subscribe('user.login', this._onUserLogin);
		this.pubsub.subscribe('pouchdb.ready', this._pouchReady);
  }

  /**
   * Stamps innerHTML
   */
  connectedCallback() {
		// @template
		super.connectedCallback();
    this.timePicker = document.createElement('time-picker');
    this.timePicker.noClock = true;
    this.root.appendChild(this.timePicker);
		this._reefList.addEventListener('on-item-select', this._onClick);
		document.addEventListener('open-picker', event => {
			let hour = this.selected.hour;
			let minutes = this.selected.minutes;
			this.timePicker.time = {hour: el.hour};
			this.timePicker.open();
		}, {capture: true});
  }
	/**
	 * @return {HTMLElement}
	 */
	get _reefList() {
		return this.root.querySelector('reef-list');
	}
	set selected(value) {
		this._selected = value;
	}
	get selected() {
		return this._selected;
	}
	/**
	 * @param {Array} value
	 */
	set profiles(value) {
    this._profiles = value;
    this.setUpPubSubs();
		this._reefList.items = value;
	}
  get profiles() {
    return this._profiles;
  }
	/**
	 * @param {object} event
	 */
	_onClick(event) {
		this.selected = event.detail.data;
		console.log(this.selected);
	}
  setUpPubSubs() {
    if (this.profiles !== null && this.profiles !== undefined)
		for (let index of Object.keys(this.profiles)) {
      pubsub.subscribe(`data[${index}]change`, this._onProfileChange);
    }
  }
	_onProfileChange(newVal, oldVal) {
		if (newVal !== oldVal) {
			let profiles = this.profiles;
			let index = newVal.dataIndex;
			let change = newVal.data;
			let parts = change.key.split('.');
			profiles[index][parts[0]][parts[1]] = change.value;
			if (this.pouch === undefined) {
				this.pouch = new PouchDB('profiles');
			}
			this.pouch.get('profiles').then(doc => {
				doc[change.uid][parts[0]][parts[1]] = change.value;
				this.pouch.put(doc, (error, result) => {
					if (!error) {
						let uid = firebase.auth().currentUser.uid;
						firebase.database().ref(`users/${uid}/profiles/${change.uid}`).set(doc[change.uid]);
						firebase.database().ref(`users/${uid}/profiles/_rev`).set(result.rev);
					}
					// update firebase
				});
			});
			// this.profiles = profiles;
		}
	}

	set pouch(value) {
		this._pouch = value;
	}

	get pouch() {
		return this._pouch || undefined;
	}

	_pouchReady() {
		this.pouch = new PouchDB('profiles');
		this.pouch.get('profiles').then(doc => {
			this.profiles = doc;
		}).catch(err => {
			// TODO: create log
			// console.log(err);
		});
	}

	_onUserLogin() {
		let uid = firebase.auth().currentUser.uid;
		firebase.database().ref(`users/${uid}/profiles`).on('value', snap => {
			let data = snap.val();
			if (data === null) {
				for (let profile of profiles) {
					firebase.database().ref(`users/${uid}/profiles/${profile.uid}`).set(profile);
				};
				firebase.database().ref(`users/${uid}/profiles/_id`).set('profiles');
			}	else {
				this.profiles = data;
			};
		});
	}
}
customElements.define('profiles-view', ProfilesView);
