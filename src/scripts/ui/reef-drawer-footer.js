/**
* @extends HTMLElement
*/
export default class ReefDrawerFooter extends HTMLElement {
/**
 * Attributes to observer
 * @return {Array} ['avatar', 'username']
 */
static get observedAttributes() {
  return ['avatar', 'username'];
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

  this.userInfoContainer = document.createElement('span');
  this.userInfoContainer.style.display = 'flex';
  this.userInfoContainer.style.flexDirection = 'row';
  this.userInfoContainer.style.alignItems = 'center';
  this.userInfoContainer.style.height = '48px';

  this.avatarElement = document.createElement('img');
  this.avatarElement.style.height = '48px';
  this.avatarElement.style.width = '48px';
  this.avatarElement.style.borderRadius = '50%';
  this.avatarElement.style.outline = 'none';
  this.avatarElement.userSelect = 'none';
  this.avatarElement.pointerEvents = 'none';

  this.nameElement = document.createElement('span');
  this.nameElement.style.display = 'flex';
  this.nameElement.style.flexDirection = 'column';
  this.nameElement.style.paddingLeft = '12px';
  this.nameElement.style.justifyContent = 'flex-end';
  this.nameElement.style.height = '48px';

  let border = document.createElement('span');
  border.style.display = 'flex';
  border.style.borderBottom = '1px solid rgba(0,0,0,0.12)';
  border.style.marginTop = '-1px';
  border.style.width = '100%';
  border.style.height = '1px';

  this.userInfoContainer.appendChild(this.avatarElement);
  this.userInfoContainer.appendChild(this.nameElement);
  this.container.appendChild(this.userInfoContainer);
  this.root.appendChild(border);
  this.root.appendChild(this.container);
}

/**
 * @param {String} value
 */
set avatar(value) {
  this.setAttribute('avatar', value);
  if (value) {
    this.avatarElement.src = value;
  } else {
    this.avatarElement.src = null;
  }
}

/**
 * @param {String} value
 */
set username(value) {
  this.setAttribute('username', value);
  if (value) {
    this.nameElement.innerHTML = `
    <span class="greeting">Hello</span>
    <span class="username">${value}</span>`;
  } else {
    this.nameElement.innerHTML = 'Welcome';
  }
}

/**
 * Runs whenever attribute changes are detected
 * @param {string} name The name of the attribute that changed.
 * @param {string|object|array} oldValue
 * @param {string|object|array} newValue
 */
attributeChangedCallback(name, oldValue, newValue) {
  if (oldValue === null || oldValue !== newValue) {
    this[name] = newValue;
  }
}
}
customElements.define('reef-drawer-footer', ReefDrawerFooter);
