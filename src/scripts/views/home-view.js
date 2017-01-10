import './../ux/swipeable-cards.js';
/**
 * HomeView
 * @extends HTMLElement
 */
export default class HomeView extends HTMLElement {
  /**
   * observedAttributes
   * The attributes to observe
   * @return {Array} ['username']
   */
  static get observedAttributes() {
    return ['username'];
  }
  /**
   * Setup shadowRoot
   */
  constructor() {
    super();
    this.root = this.attachShadow({mode: 'open'});
  }
  /**
   * connectedCallback runs when the element is inserted into document
   */
  connectedCallback() {
    // @template
  }
  /**
   * @param {String} username 'some-name'
   */
  set username(username) {
    this.setAttribute('username', username);
    this.usernameEl.innerHTML = username;
  }
  /**
   * @return {HTMLElement} element containing the (.)username class
   */
  get usernameEl() {
    return this.root.querySelector('.username');
  }
  /**
   * @return {HTMLElement} reef-grid
   */
  get reefGrid() {
    return this.root.querySelector('reef-grid');
  }

  /**
   * Runs whenever attribute changes are detected
   * @param {string} name The name of the attribute that changed.
   * @param {string|object|array} oldValue
   * @param {string|object|array} newValue
   */
  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue !== newValue) {
      this[name] = newValue;
    }
  }
}
customElements.define('home-view', HomeView);
