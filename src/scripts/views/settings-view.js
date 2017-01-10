/**
 * SettingsView
 * @extends HTMLElement
 */
class SettingsView extends HTMLElement {
  /**
   * Create shadowRoot (root) & stamp template
   */
  constructor() {
    super();
    this.root = this.attachShadow({mode: 'open'});
  }

  /**
   * Stamps innerHTML
   */
  connectedCallback() {
		// @template
  }
}
customElements.define('settings-view', SettingsView);
