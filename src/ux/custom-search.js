'use strict';
export default Backed(class CustomSearch extends HTMLElement {
	created() {
    this.root = this.attachShadow({mode: 'open'});
    // @template
	}
  connected() {
		this.onSearchClick = this.onSearchClick.bind(this);
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
});
