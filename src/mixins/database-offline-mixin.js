'use strict';
export default base => class extends base {
	/**
	 * @private
	 */
	static get properties() {
		return {
			pouchdbReady: {
				value: false,
				observer: '_pouchdbReady',
				global: true
			}
		};
	}
};
