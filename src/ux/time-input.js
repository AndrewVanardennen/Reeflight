'use strict';
import utils from './../../node_modules/backed-utils/dist/utils-es.js';
export default Backed(class TimeInput extends HTMLElement {
	/**
	 * Attributes to observer
	 * @return {Array} ['value']
	 */
	static get observedAttributes() {
		return ['value', 'key', 'data-index', 'data-uid'];
	}

	created() {
		this.root = this.attachShadow({mode: 'open'});
		this.root.innerHTML = `
	<style>
		:host {
			--reef-icon-button-size: 24px;
			--reef-icon-button-color: #777;
			--reef-icon-button-padding: 0;
			display: flex;
			flex-direction: row;
			align-items: center;
			background: #FFF;
			border: 1px solid #ddd;
			padding: 6px 12px;
			box-sizing: border-box;
			border-radius: 2px;
		}
		.container {
			padding-right: 6px;
			cursor: pointer;
		}
		:host([contenteditable]) .container {
			cursor: text;
		}
		:host([contenteditable]) reef-icon-button[icon="clock"],
		reef-icon-button[icon="save"] {
			display: none;
		}
		:host([contenteditable]) reef-icon-button[icon="save"] {
			display: initial;
		}
	</style>
	<div class="container" title="click edit">
		<slot></slot>
	</div>
	<reef-icon-button icon="clock"></reef-icon-button>
	<reef-icon-button icon="save"></reef-icon-button>
		`;
	}

	/**
	 * Runs when inserted into document
	 */
	connected() {
		this.setAttribute('title', 'Open time picker');
		this._onClick = this._onClick.bind(this);
		this._onSaveClick = this._onSaveClick.bind(this);
		this._onClockClick = this._onClockClick.bind(this);
		this._onTimePickerAction = this._onTimePickerAction.bind(this);

		this.root.querySelector('.container')
			.addEventListener('click', this._onClick);
		this.root.querySelector('reef-icon-button[icon="clock"]')
				.addEventListener('click', this._onClockClick);
		this.root.querySelector('reef-icon-button[icon="save"]')
			.addEventListener('click', this._onSaveClick);
	}
	/**
	 * @private
	 * @param {string} value
	 */
	set value(value) {
		this._value = value;
		this.innerHTML = value;
	}
	/**
	 * @private
	 * @param {boolean} value
	 */
	set editing(value) {
		this._editing = value;
		if (value) {
			this.setAttribute('contenteditable', '');
		} else {
			this.removeAttribute('contenteditable');
		}
	}
	set key(value) {
		this._key = value;
	}
	set dataIndex(value) {
		this._dataIndex = value;
	}
	set dataUid(value) {
		this._dataUid = value;
	}
	/**
	 * @return {string}
	 */
	get value() {
		return this.innerHTML;
	}
	/**
	 * @return {boolean}
	 */
	get editing() {
		return this._editing || false;
	}
	get key() {
		return this._key || 0;
	}
	get dataIndex() {
		return this._dataIndex;
	}
	get dataUid() {
		return this._dataUid;
	}
	/**
	 * Runs when attribute changes.
	 * @param {string} name The name of the attribute that changed.
	 * @param {string|object|array} oldValue
	 * @param {string|object|array} newValue
	 */
	attributeChangedCallback(name, oldValue, newValue) {
		if (oldValue !== newValue) {
			this[utils.toJsProp(name)] = newValue;
		}
	}
	/**
	 * @param {object} event
	 */
	_onClick(event) {
		event.preventDefault();
		if (!this.hasAttribute('contenteditable')) {
			this.editing = true;
		}
		return;
	}
	/**
	 * @param {object} event
	 */
	_onClockClick(event) {
		event.preventDefault();
		let parts = this.value.split(':');
		let hour = parts[0];
		let minutes = parts[1];
		this.picker = document.createElement('time-picker');
		this.picker.time = {hour: hour, minutes: minutes};
		this.picker.noClock = true;
		this.picker.addEventListener('time-picker-action',
			this._onTimePickerAction);
		this.root.appendChild(this.picker);
		this.picker.open();
		// this.dispatchEvent(new CustomEvent('open-picker'));
		// document.dispatchEvent(new CustomEvent('open-picker', {detail: this}));
	}
	/**
	 * @param {object} event
	 */
	_onSaveClick(event) {
		event.preventDefault();
		this.editing = false;
		pubsub.publish('time.change', time);
	}

	_onTimePickerAction(event) {
		// TODO: add backdrop to timePicker
		this.picker.style.transformOrigin = 'left top';
		this.picker.style.position = 'fixed';
		this.picker.style.height = '40px';
		let detail = event.detail;
		if (detail.action === 'ok') {
			let key = this.key;
			let uid = this.dataUid;
			let hour = detail.time.hour;
			let minutes = detail.time.minutes;
			let value = `${hour}:${minutes}`;
			this.value = value;
			pubsub.publish(`time[${this.dataIndex}]change`, {
				value: value,
				key: key,
				uid: uid
			});
		}
		setTimeout(() => {
			this.root.removeChild(this.picker);
		}, 160);
	}
}
);
