'use strict';
import AppController from './controllers/app-controller.js';

/**
 * ReeflightApp
 */
class ReeflightApp extends AppController {
  static get is() { return 'reeflight-app'; }
  constructor() {
    super('reeflight-app');
    // bind methods
    this._onUserLogin = this._onUserLogin.bind(this);
    this._onUserChange = this._onUserChange.bind(this);
    this._onToggleDrawer = this._onToggleDrawer.bind(this);
    this._onHomeClick = this._onHomeClick.bind(this);
    this._onSettingsClick = this._onSettingsClick.bind(this);
    this._onProfilesClick = this._onProfilesClick.bind(this);
  }
  /**
   * Runs everytime the user changes
   */
  set user(value) {
    this._user = value;
  }

  get user() {
    return this._user || {};
  }

  get header() {
    return this._root.querySelector('reeflight-header');
  }

  get drawer() {
    return this._root.querySelector('reeflight-drawer');
  }

  get drawerFooter() {
    return this._root.querySelector('reeflight-drawer-footer');
  }

  get pages() {
    return this._root.querySelector('reef-pages');
  }

  connectedCallback() {
    super.connectedCallback();
    this.pubsub.subscribe('user.change', this._onUserChange);
    document.addEventListener('user-login', this._onUserLogin);
    document.addEventListener('toggle-drawer', this._onToggleDrawer);
    document.addEventListener('home-button-click', this._onHomeClick);
    document.addEventListener('settings-button-click', this._onSettingsClick);
    document.addEventListener('profiles-button-click', this._onProfilesClick);

    this._handleLazyimports();
    // TODO: stream lamps
    // fetch('api/devices').then(response => {
    //   //stream
    // }).then(response => {
    //
    // })

  }

  _handleLazyimports() {
    setTimeout(() => {
      this._lazyImport('elements/reef-pages.html').then(() => {
        // import loaded
        this._onHomeClick();
      });
      const asyncImports = [
        'elements/reeflight-header.html',
        'elements/reeflight-footer.html',
        'elements/reef-selector.html',
        'elements/reef-button.html',
        'elements/reeflight-drawer.html',
        'elements/reeflight-drawer-heading.html',
        'elements/reeflight-drawer-footer.html'
      ];

      const imports = [
        'elements/icons.html'
      ];

      imports.forEach(href => {
        this._lazyImport(href);
      });

      asyncImports.forEach(href => {
        this._lazyImport(href, true);
      });
    });
  }

  _onUserLogin(event) {
    let user = event.detail;
    this.pubsub.publish('user.change', user);
  }

  _onUserChange(user) {
    console.log(user);
    if (user !== null) {
      this.drawerFooter.setAttribute('avatar', user.profile_picture);
      this.drawerFooter.setAttribute('username', user.username);
    }
  }

  _onToggleDrawer() {
    if (this.drawer.shown) {
      this.drawer.hide();
      this._applyAppStateStyles(
        'width ease-out 0.18s',
        '100%'
      );
    } else {
      this.drawer.show();
      this._applyAppStateStyles(
        'width ease-in 0.18s',
        'calc(100% - ' + this.drawer.width + ')'
      );
    }
  }

  _applyAppStateStyles(transition, width) {
    requestAnimationFrame(() => {
      this.style.transition = transition;
      this.style.width = width;
    });
  }

  _onHomeClick(){
    this.pages.select('home');
    this._lazyImport('elements/views/home-view.html');
  }

  _onSettingsClick() {
    this.pages.select('settings');
    this._lazyImport('elements/views/settings-view.html');
  }

  _onProfilesClick(){
    this.pages.select('profiles');
    this._lazyImport('elements/views/profiles-view.html');
  }
}
customElements.define(ReeflightApp.is, ReeflightApp);
