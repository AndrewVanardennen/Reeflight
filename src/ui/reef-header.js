import './reef-icon-button.js';
/**
* ReeflightHeader
*/
export default Backed(class ReefHeader extends HTMLElement {
  /**
   * Set's up the shadowRoot
   */
	created() {
    this.root = this.attachShadow({mode: 'open'});
		// @template
	}

  /**
   * Runs when inserted into document
   */
  connected() {
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
});
