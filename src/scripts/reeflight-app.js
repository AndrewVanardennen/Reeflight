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
    this.style.position = 'absolute';
    this.style.top = 0;
    this.style.bottom = 0;
    this.style.left = 0;
    this.style.right = 0;
    this._onUserLogin = this._onUserLogin.bind(this);
    this._onUserChange = this._onUserChange.bind(this);
    this._onToggleDrawer = this._onToggleDrawer.bind(this);
    this._onHomeClick = this._onHomeClick.bind(this);
    this._onSettingsClick = this._onSettingsClick.bind(this);
    this._onProfilesClick = this._onProfilesClick.bind(this);
    this.pubsub.subscribe('user.change', this._onUserChange);
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

  get drawerHeading() {
    return this._root.querySelector('reeflight-drawer-heading');
  }

  get pages() {
    return this._root.querySelector('reef-pages');
  }

  connectedCallback() {
    this.pubsub.subscribe('user', this._onUserChange, this);
    document.addEventListener('user-login', this._onUserLogin);
    document.addEventListener('toggle-drawer', this._onToggleDrawer);
    document.addEventListener('home-button-click', this._onHomeClick);
    document.addEventListener('settings-button-click', this._onSettingsClick);
    document.addEventListener('profiles-button-click', this._onProfilesClick);

    setTimeout(() => {
      const sources = [
        'elements/reeflight-header.html',
        'elements/icons.html',
        'elements/reeflight-footer.html',
        'elements/home-view.html'];
      sources.forEach(source => {
        this._lazyImport(source);
      });
    });

    // TODO: stream lamps
    // fetch('api/devices').then(response => {
    //   //stream
    // }).then(response => {
    //
    // })

  }

  _lazyImport(href) {
    let link = document.createElement('link');
    link.rel = 'import';
    link.href = href;
    this.appendChild(link);
  }

  _onUserLogin(event) {
    firebase.database().ref('users/' + event.detail).once('value', snapshot => {
      // update the user prop with snapshot value
      let user = snapshot.val();
      this.user = user;
      this.pubsub.publish('user.change', user);
    });
  }

  _onUserChange(user) {
    this.drawerHeading.setAttribute('avatar', user.profile_picture);
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
      if (this.drawer.drawerRight) {
        this.style.left = 0;
        this.style.right = null;
      } else {
        this.style.left = null;
        this.style.right = 0;
      }
    });
  }

  _onHomeClick(){
    this.pages.select('home');
    this._lazyImport('elements/home-view.html');
  }

  _onSettingsClick() {
    this.pages.select('settings');
    this._lazyImport('elements/settings-view.html');
  }

  _onProfilesClick(){
    this.pages.select('profiles');
    this._lazyImport('elements/profiles-view.html');
  }
}
customElements.define(ReeflightApp.is, ReeflightApp);
