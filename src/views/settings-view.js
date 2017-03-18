/**
 * SettingsView
 * @extends HTMLElement
 */
export default Backed(class SettingsView extends HTMLElement {

	created() {
		this.root = this.attachShadow({mode: 'open'});
		// @template
	}
});
