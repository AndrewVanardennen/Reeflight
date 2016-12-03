'use strict';
import AppController from './controllers/app-controller.js';
import './ui/reef-grid.js';

/**
 * ReeflightApp
 */
class ReeflightApp extends AppController {
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

  /**
   * @return {HTMLElement} reeflight-header
   */
  get header() {
    return this._root.querySelector('reeflight-header');
  }

  /**
   * @return {HTMLElement} reef-drawer
   */
  get drawer() {
    return this._root.querySelector('reef-drawer');
  }

  /**
   * @return {HTMLElement} reeflight-drawer-footer
   */
  get drawerFooter() {
    return this._root.querySelector('reeflight-drawer-footer');
  }

  /**
   * @return {HTMLElement} reef-pages
   */
  get pages() {
    return this._root.querySelector('reef-pages');
  }

  /**
   * @return {HTMLElement} home-view
   */
  get homeView() {
    return this.pages.querySelector('home-view');
  }

  /**
   * @return {Boolean} true when the is-vulcanized attribute is set
   */
  get isVulcanized() {
    return this.hasAttribute('is-vulcanized');
  }

  /**
   * @param {Boolean} value
   */
  set loadComplete(value) {
    if (value) {
      this.removeAttribute('loading');
    } else {
      this.setAttribute('loading', '');
    }
  }

  /**
   * Subscribes user.change to pubsub, lazyImports elements,
   * sets up the drawer & the eventListeners
   */
  connectedCallback() {
    super.connectedCallback();
    this.loadComplete = false;
    this.pubsub.subscribe('user.change', this._onUserChange);
    document.addEventListener('user-login', this._onUserLogin);
    document.addEventListener('toggle-drawer', this._onToggleDrawer);
    document.addEventListener('home-button-click', this._onHomeClick);
    document.addEventListener('settings-button-click', this._onSettingsClick);
    document.addEventListener('profiles-button-click', this._onProfilesClick);
    this.addEventListener('click', this._onClick);
    window.addEventListener('resize', this._onResize);
    customElements.whenDefined('reeflight-app').then(() => {
      this._handleLazyimports();
      let undefinedElements = [this._root.querySelector('reef-pages'),
        this.drawer,
        this.header, this.drawerFooter,
        this._root.querySelector('reef-footer'),
        this._root.querySelector('reef-selector')
      ];
      undefinedElements.map(el => {
        return customElements.whenDefined(el.localName);
      });
      this._onResize();
      this._preloadTasks = ['profiles', 'settings'];
      requestIdleCallback(this._preloadViews);
      this.loadComplete = true;
    });
    // TODO: stream lamps
    // fetch('api/devices').then(response => {
    //   //stream
    // }).then(response => {
    //
    // })
    // load lazy resources after render and set `loadComplete` when done.
  }

  /**
   * PreloadViews when the user is idle &
   * requests a new idleCallback when tasks aren't finished
   * @param {Object} deadline
   */
  _preloadViews(deadline) {
    for (let view of this._preloadTasks) {
      this._loadView(view);

      // Use any remaining time, or, if timed out, just run through the tasks.
      while ((deadline.timeRemaining() > 0 || deadline.didTimeout) &&
             this._preloadTasks.length > 0 && !this.busy)
        this._loadViews();

      if (this._preloadTasks.length > 0 && !this.busy)
        requestIdleCallback(this._preloadViews);
    }
  }

  /**
   * @param {String} view
   */
  _loadView(view) {
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
  /**
   * Registers service-worker, runs _onHomeClick, _preloadViews &
   * lazyImports elements
   */
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
          'elements/reef-footer.html',
          'elements/reef-selector.html',
          'elements/reef-button.html',
          'elements/reef-drawer.html',
          'elements/reeflight-drawer-heading.html',
          'elements/reeflight-drawer-footer.html'
        ];
        asyncImports.forEach(href => {
          this._lazyImport(href, true);
        });
      }
    });
  }

  /**
   * Runs when the window resizes
   * Closes the drawer on smallScreens & Opens it on big ones
   */
  _onResize() {
    requestAnimationFrame(() => {
      this._width = this.getBoundingClientRect().width;
      if (this._width === 0) {
        setTimeout(() => {
          this._onResize();
        }, 10);
      } else if (this._width < 860) {
        this.classList.add('floating-drawer');
        if (this.drawer.opened) {
          this._closeDrawer();
        }
      } else if (this._width > 1116) { /* 860 + 256(drawer width) */
        this.classList.remove('floating-drawer');
        this._openDrawer();
      }
    });
  }

  /**
   * Runs on user login, publishes to pubsub
   *
   * @param {Object} event {event.detail: {
   *     user: {
   *       username: 'username', profile_picture: 'profile_picture'
   *     }
   *   }
   * }
   */
  _onUserLogin(event) {
    let user = event.detail;
    this.pubsub.publish('user.change', user);
  }

  /**
   * Runs whenever user changes, changes are detected by the pubsub
   *
   * @param {Object} user {
   *    username: 'username', profile_picture: 'profile_picture'
   *   }
   */
  _onUserChange(user) {
    if (user !== null) {
      this.drawerFooter.setAttribute('avatar', user.profile_picture);
      this.drawerFooter.setAttribute('username', user.username);
      this.homeView.setAttribute('username', user.username);
    }
  }

  /**
   * Opens the drawer
   */
  _openDrawer() {
    requestAnimationFrame(() => {
      this._applyAppStateStyles(
        'width ease-in 0.16s',
        'calc(100% - ' + this.drawer.width + 'px)'
      );
      this.drawer.opened = true;
    });
  }

  /**
   * Closes the drawer
   */
  _closeDrawer() {
    requestAnimationFrame(() => {
      this._applyAppStateStyles(
        'width ease-out 0.16s',
        '100%'
      );
      this.drawer.opened = false;
    });
  }

  /**
   * Toggles the drawer
   */
  _onToggleDrawer() {
    if (this.drawer.opened) {
      this._closeDrawer();
    } else {
      this._openDrawer();
    }
  }

  /**
   * Applies transition & width when closing or opening the drawer
   *
   * @param {String} transition the transition to run
   * @param {String} width the width to set
   */
  _applyAppStateStyles(transition, width) {
    this.style.transition = transition;
    this.style.width = width;
  }

  /**
   * Closes the drawer when opened & when width is under 1116px
   */
  _closeDrawerIfNeeded() {
    let width = this._width || this.getBoundingClientRect().width;
    if (this.drawer.opened && width < 1116) {
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
   * Performs pages.select('home')
   * Closes the drawer if needed
   */
  _onHomeClick() {
    this.pages.select('home');
    this._closeDrawerIfNeeded();
  }
  /**
   * Performs pages.select('settings')
   * Closes the drawer if needed
   */
  _onSettingsClick() {
    this.pages.select('settings');
    this._closeDrawerIfNeeded();
  }
  /**
   * Performs pages.select('profiles')
   * Closes the drawer if needed
   */
  _onProfilesClick() {
    this.pages.select('profiles');
    this._closeDrawerIfNeeded();
  }
}
customElements.define('reeflight-app', ReeflightApp);
