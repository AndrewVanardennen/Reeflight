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

  connectedCallback() {
    this.pubsub.subscribe('user', this._onUserChange, this);
    document.addEventListener('user-login', this._onUserLogin);

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
    this.header.setAttribute('avatar', user.profile_picture);
  }
}
customElements.define(ReeflightApp.is, ReeflightApp);
