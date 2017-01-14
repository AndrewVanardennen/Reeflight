/**
* @extends {HTMLElement}
*/
export default class ReefDrawerHeading extends HTMLElement {
  /**
   * Attributes to observer
   * @return {Array} ['logo']
   */
  static get observedAttributes() {
    return ['logo'];
  }

  /**
   * Calls super & creates shadowRoot
   */
  constructor() {
    super();
    this.root = this.attachShadow({mode: 'open'});
		// @template
  }

  /**
   * Stamps innerHTML
   */
  connectedCallback() {
    this.container = document.createElement('span');
    this.container.classList.add('container');

    this.logoContainer = document.createElement('span');
    this.logoContainer.style.display = 'flex';
    this.logoContainer.style.flexDirection = 'row';
    this.logoContainer.style.alignItems = 'center';
    this.logoContainer.style.justifyContent = 'center';

    this.logoElement = document.createElement('img');
    this.logoElement.style.height = '48px';
    this.logoElement.style.width = '48px';
    this.logoElement.style.borderRadius = '50%';
    this.logoElement.style.outline = 'none';
    this.logoElement.style.userSelect = 'none';
    this.logoElement.style.pointerEvents = 'none';

    this.menuTitleContainer = document.createElement('span');
    this.menuTitleContainer.style.display = 'flex';
    this.menuTitleContainer.style.alignItems = 'flex-end';
    this.menuTitleContainer.style.height = '64px';
    this.menuTitleContainer.style.paddingLeft = '8px';
    this.menuTitleContainer.style.fontWeight = '700';
    this.menuTitleContainer.style.color = 'var(--paper-grey-700)';
    this.menuTitleContainer.innerHTML = 'Menu';

    let border = document.createElement('span');
    border.style.display = 'flex';
    border.style.borderBottom = '1px solid rgba(0,0,0,0.12)';
    border.style.marginTop = '-1';
    border.style.width = '100%';
    border.style.height = '1px';

    this.logoContainer.appendChild(this.logoElement);
    this.container.appendChild(this.logoContainer);
    this.container.appendChild(this.menuTitleContainer);
    this.root.appendChild(this.container);
    this.root.appendChild(border);
  }

  /**
   * @param {String} value
   */
  set logo(value) {
    this.setAttribute('logo', value);
    if (value) {
      this.logoElement.src = value;
    } else {
      this.logoElement.src = null;
    }
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
customElements.define('reef-drawer-heading', ReefDrawerHeading);
