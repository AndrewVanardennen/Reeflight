import './reef-icon-button.js';
/**
* ReeflightHeader
*/
export default class ReefHeader extends HTMLElement {
  /**
   * Set's up the shadowRoot
   */
  constructor() {
    super();
    this.root = this.attachShadow({mode: 'open'});
		// @template
  }

  /**
   * Runs when inserted into document
   */
  connectedCallback() {
    this.drawerToggle.addEventListener('click', this.toggleDrawer);
  }

  /**
   * @return {HTMLElement} .drawer-toggle
   */
  get drawerToggle() {
    return this.root.querySelector('.drawer-toggle');
  }

  /**
   * Dispatches toggle-drawer event
   */
  toggleDrawer() {
    document.dispatchEvent(new CustomEvent('toggle-drawer'));
  }
}
customElements.define('reef-header', ReefHeader);
