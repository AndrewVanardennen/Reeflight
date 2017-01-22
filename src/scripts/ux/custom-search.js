'use strict';
export default class CustomSearch extends HTMLElement {
  constructor() {
    super();
    this.root = this.attachShadow({mode: 'open'});
    // @template
  }
}
customElements.define('custom-search', CustomSearch);
