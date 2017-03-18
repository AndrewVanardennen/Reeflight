/**
 * @extends HTMLElement
 */
export default Backed(class ReefPages extends HTMLElement {

  /**
   * Creates shadowRoot
   */
	created() {
		this._root = this.attachShadow({mode: 'open'});
	}

	ready() {
    this._root.innerHTML = `
      <style>
        :host {
					display: block;
    			height: 100%;
          overflow-y: auto;
          --reef-primary-background-color: #ECEFF1;
        }
				@media (min-width: 600px) {
		      :host {
		        flex: 1;
		      }
		    }
      </style>
      <slot></slot>
    `;
	}

  /**
   * @param {String} page
   */
  select(page) {
    for (let i = 0; i < this.children.length; i++) {
      let child = this.children[i];
      if (child.getAttribute('name') === page) {
        child.removeAttribute('hidden');
      } else {
        child.setAttribute('hidden', '');
      };
    }
  }
});
