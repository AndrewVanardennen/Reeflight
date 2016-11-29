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
    this._onResize = this._onResize.bind(this);
    this._preloadViews = this._preloadViews.bind(this);
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
    window.addEventListener('resize', this._onResize);
    this._handleLazyimports();
    this._preloadTasks = ['profiles', 'settings'];
    requestIdleCallback(this._preloadViews);
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
           this._preloadTasks.length > 0)
      this._loadViews();

    if (this._preloadTasks.length > 0)
      requestIdleCallback(this._preloadViews);
  }

  _loadViews() {
    for (let view of this._preloadTasks) {
      this._lazyImport(`elements/views/${view}-view.html`).then(() => {
        let index = this._preloadTasks.indexOf(view);
        if (index > -1) {
          this._preloadTasks.splice(index, 1);
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
      }
    });
  }

  _onResize(event) {
    let width = this.getBoundingClientRect().width;
    if (width <= 860) {
      this.classList.add('floating-drawer');
      if (this.drawer !== null && this.drawer.shown) {
        this._applyAppStateStyles(
          'width ease-out 0.18s',
          '100%'
        );
        requestAnimationFrame(() => {
          this.drawer.hide();
        });
      }
    } else if (width > 1116) { /* 860 + 256(drawer width) */
      this.classList.remove('floating-drawer');
      this._applyAppStateStyles(
        'width ease-in 0.18s',
        'calc(100% - ' + this.drawer.width + ')'
      );
      this.drawer.show();
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

  _onToggleDrawer() {
    if (this.drawer.shown) {
      this._applyAppStateStyles(
        'width ease-out 0.18s',
        '100%'
      );
      this.drawer.hide();
    } else {
      this._applyAppStateStyles(
        'width ease-in 0.18s',
        'calc(100% - ' + this.drawer.width + ')'
      );
      this.drawer.show();
    }
  }

  _applyAppStateStyles(transition, width) {
    requestAnimationFrame(() => {
      this.style.transition = transition;
      this.style.width = width;
    });
  }

  _onHomeClick() {
    this.pages.select('home');
  }

  _onSettingsClick() {
    this.pages.select('settings');
  }

  _onProfilesClick(){
    this.pages.select('profiles');
  }
}
customElements.define(ReeflightApp.is, ReeflightApp);
