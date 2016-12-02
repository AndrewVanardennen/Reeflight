'use strict';
import AppController from './controllers/app-controller.js';
import Drawer from './ui/reef-drawer.js';

/**
 * ReeflightApp
 */
class ReeflightApp extends AppController {
  static get is() {
    return 'reeflight-app';
  }
  /**
   * create reeflight-app
   */
  constructor() {
    super('reeflight-app');
    // bind methods
    this._onUserLogin = this._onUserLogin.bind(this);
    this._onUserChange = this._onUserChange.bind(this);
    this._onToggleDrawer = this._onToggleDrawer.bind(this);
    this._onHomeClick = this._onHomeClick.bind(this);
    this._onSettingsClick = this._onSettingsClick.bind(this);
    this._onProfilesClick = this._onProfilesClick.bind(this);
    this._onClick = this._onClick.bind(this);
    this._onResize = this._onResize.bind(this);
    this._preloadViews = this._preloadViews.bind(this);
  }
  /**
   * Runs everytime the user changes
   * @param {Object} value {username: 'name', profile_picture: 'some_image'}
   */
  set user(value) {
    this._user = value;
  }

  /**
   * return {Object} value {username: 'name', profile_picture: 'some_image'}
   */
  get user() {
    return this._user || {};
  }

  get header() {
    return this._root.querySelector('reeflight-header');
  }

  get drawer() {
    return this._root.querySelector('reef-drawer');
  }

  get drawerFooter() {
    return this._root.querySelector('reeflight-drawer-footer');
  }

  get pages() {
    return this._root.querySelector('reef-pages');
  }

  get homeView() {
    return this.pages.querySelector('home-view');
  }

  get isVulcanized() {
    return this.hasAttribute('is-vulcanized');
  }

  connectedCallback() {
    super.connectedCallback();
    this.pubsub.subscribe('user.change', this._onUserChange);
    document.addEventListener('user-login', this._onUserLogin);
    document.addEventListener('toggle-drawer', this._onToggleDrawer);
    document.addEventListener('home-button-click', this._onHomeClick);
    document.addEventListener('settings-button-click', this._onSettingsClick);
    document.addEventListener('profiles-button-click', this._onProfilesClick);
    document.addEventListener('click', this._onClick);
    window.addEventListener('resize', this._onResize);
    let drawer = this._root.querySelector('reef-drawer');
    drawer = new Drawer();
    this._onResize();
    this._handleLazyimports();
    // TODO: stream lamps
    // fetch('api/devices').then(response => {
    //   //stream
    // }).then(response => {
    //
    // })
    // load lazy resources after render and set `loadComplete` when done.
  }

  _preloadViews(deadline) {
    // Use any remaining time, or, if timed out, just run through the tasks.
    while ((deadline.timeRemaining() > 0 || deadline.didTimeout) &&
           this._preloadTasks.length > 0 && !this.busy)
      this._loadViews();

    if (this._preloadTasks.length > 0 && !this.busy)
      requestIdleCallback(this._preloadViews);
  }

  _loadViews() {
    for (let view of this._preloadTasks) {
      this.busy = true;
      this._lazyImport(`elements/views/${view}-view.html`, true).then(() => {
        let index = this._preloadTasks.indexOf(view);
        if (index > -1) {
          this._preloadTasks.splice(index, 1);
          if (this._preloadTasks.length === 0) {
            this.busy === false;
          }
        }
      });
    }
  }

  _handleLazyimports() {
    setTimeout(() => {
      this._onHomeClick();
      if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('/service-worker.js');
      }
      if (this.isVulcanized) {
        this._onHomeClick();
      } else {
        this._preloadTasks = ['profiles', 'settings'];
        requestIdleCallback(this._preloadViews);

        const asyncImports = [
          'elements/reeflight-header.html',
          'elements/reeflight-footer.html',
          'elements/reef-selector.html',
          'elements/reef-button.html',
          'elements/reeflight-drawer-heading.html',
          'elements/reeflight-drawer-footer.html'
        ];
        asyncImports.forEach(href => {
          this._lazyImport(href, true);
        });
      }
    });
  }

  _onResize(event) {
    let width = this.getBoundingClientRect().width;
    if (width === 0) {
      setTimeout(() => {
        this._onResize();
      }, 10);
    } else if (width < 860) {
      this.classList.add('floating-drawer');
      if (this.drawer.shown) {
        this._closeDrawer();
      }
    } else if (width > 1116) { /* 860 + 256(drawer width) */
      this.classList.remove('floating-drawer');
      this._openDrawer();
    }
  }

  _onUserLogin(event) {
    let user = event.detail;
    this.pubsub.publish('user.change', user);
  }

  _onUserChange(user) {
    if (user !== null) {
      this.drawerFooter.setAttribute('avatar', user.profile_picture);
      this.drawerFooter.setAttribute('username', user.username);
      this.homeView.setAttribute('username', user.username);
    }
  }

  _openDrawer() {
    requestAnimationFrame(() => {
      this._applyAppStateStyles(
        'width ease-in 0.16s',
        'calc(100% - ' + this.drawer.width + ')'
      );
      this.drawer.show();
    });
  }

  _closeDrawer() {
    requestAnimationFrame(() => {
      this._applyAppStateStyles(
        'width ease-out 0.16s',
        '100%'
      );
      this.drawer.hide();
    });
  }

  _onToggleDrawer() {
    if (this.drawer.shown) {
      this._closeDrawer();
    } else {
      this._openDrawer();
    }
  }

  _applyAppStateStyles(transition, width) {
    this.style.transition = transition;
    this.style.width = width;
  }

  _closeDrawerIfNeeded() {
    if (this.drawer.shown) {
      this._closeDrawer();
    }
  }
  /**
   * _onClick
   * Closes the drawer if needed
   */
  _onClick() {
    this._closeDrawerIfNeeded();
  }
  /**
   * _onHomeClick
   * Performs pages.select('home')
   * Closes the drawer if needed
   */
  _onHomeClick() {
    this.pages.select('home');
    this._closeDrawerIfNeeded();
  }

  _onSettingsClick() {
    this.pages.select('settings');
    this._closeDrawerIfNeeded();
  }

  _onProfilesClick() {
    this.pages.select('profiles');
    this._closeDrawerIfNeeded();
  }
}
customElements.define(ReeflightApp.is, ReeflightApp);
