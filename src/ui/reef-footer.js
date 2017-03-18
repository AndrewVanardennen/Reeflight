/**
 * ReefFooter
 * @extends HTMLElement
 */
export default Backed(class ReefFooter extends HTMLElement {

	ready() {
    this._root = this.attachShadow({mode: 'open'});
    this._root.innerHTML = `
      <style>
        :host {
          display: none;
          flex-direction: column;
          width: 100%;
          min-height: 72px;
        }
      </style>
      <slot name="made-with"></slot>
      <slot></slot>
      <slot name="copyright"></slot>
    `;
	}
});
