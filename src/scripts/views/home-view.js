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
    this.root.innerHTML = `
      <style>
        :host {
          display: flex;
          height: 100%;
          justify-content: center;
          --reef-icon-button-color: #555;
          background-color: var(--reef-primary-background-color);
        }
        h1, h2 {
          margin: 0;
        }
        summary {
          padding-top: 24px;
        }
      </style>

      <reef-grid>
      <style>
        .grid-item.item-1 {
          justify-content: center;
          display: flex;
        }
      </style>
        <div class="grid-item item-1" style="width:100%;">
          <h1>Welcome
          <span class="username"></span>
          to Reeflight.</h1>
        </div>

        <div class="grid-item">
          <reef-icon-button icon="lightbulb-outline" toggles></reef-icon-button>
          <reef-icon-button icon="wifi" toggles></reef-icon-button>
          <reef-icon-button icon="bluetooth" toggles></reef-icon-button>
          <reef-icon-button icon="settings" toggles></reef-icon-button>
          <reef-icon-button icon="import-contacts" toggles></reef-icon-button>
        </div>
          <div class="grid-item">
            <summary>
              <h2>Future plans:</h2>
              <p>-- Time past and/or Time until new activation --</p>
              <p>-- Connected with Rsp icon #extra --</p>
            </summary>
          </div>
      </reef-grid>
    `;
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
    return this.reefGrid.root.querySelector('.username');
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
