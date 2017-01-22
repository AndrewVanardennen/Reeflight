'use strict';
export default class DevicesView extends HTMLElement {
  constructor() {
    super();
    this.root = this.attachShadow({mode: 'open'});
    // @template

    this.onSearchClick = this.onSearchClick.bind(this);
  }
  connectedCallback() {
    this.searchIcon.addEventListener('click', this.onSearchClick);
    this.searchIcon.addEventListener('tap', this.onSearchClick);
  }

  get searchIcon() {
    return this.root.querySelector('.search-icon');
  }

  set searchBarOpened(value) {
    this._searchBarOpened = value;
  }

  get searchBarOpened() {
    return this._searchBarOpened || false;
  }

  get searchBar() {
    return this.root.querySelector('.search-bar');
  }

  onSearchClick() {
    event.preventDefault();
    event.stopPropagation();
    this.searchBarOpened = !this.searchBarOpened;
    if (this.searchBarOpened)
      this.searchBar.classList.add('opened');
    else
      this.searchBar.classList.remove('opened');
  }

}
customElements.define('devices-view', DevicesView);
