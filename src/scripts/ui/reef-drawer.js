'use strict';
export default class ReefDrawer extends HTMLElement {
  static get is() {
 return 'reef-drawer';
};
  static get ObservedAttributes() {
    return ['show'];
  }
  constructor() {
    super();
    this.firstRender = true;
    this._onClick = this._onClick.bind(this);
    this._root = this.attachShadow({mode: 'open'});
    this._root.innerHTML = `
      <style>
        :host {
          user-select: none;
          cursor: default;
          box-shadow: 3px 0 6px -3px rgba(0,0,0,0.21);
          z-index: 100;
        }
      </style>
      <slot name="heading"></slot>
      <div style="flex: 1">
        <slot></slot>
      </div>
      <slot name="footer"></slot>
    `;
  }

  get forcedShow() {
    return this.hasAttribute('force-show');
  }

  set shown(value) {
    this._shown = value;
    this.setAttribute('shown', value);
    if (value) {
      this._applyDrawerStateStyles(
        'transform ease-in 0.16s, opacity ease-in 0.16s',
        'translateX(0)',
        1
      );
    } else {
      this._applyDrawerStateStyles(
        'transform ease-out 0.16s, opacity ease-out 0.16s',
        'translateX(-102%)',
        0
      );
    }
  }

  get shown() {
    return this._shown;
  }

  get width() {
    return this.style.width;
  }

  connectedCallback() {
    this.addEventListener('click', this._onClick);
    this.style.display = 'flex';
    this.style.flexDirection = 'column';
    this.style.height = '100%';
    this.style.width = '256px';
    this.style.position = 'fixed';
    this.style.top = '0';
    this.style.bottom = '0';
    this.style.opacity = '0';
    if (this.drawerRight) {
      this.style.right = '0';
    } else {
      this.style.left = '0';
    }
    if (this.forcedShow) {
      this.show();
    } else {
      this.hide();
    }
  }

  _applyDrawerStateStyles(transition, transform, opacity) {
    requestAnimationFrame(() => {
      if (this.firstRender) {
        this.firstRender = false;
      } else {
        this.style.transition = transition;
      }
      this.style.transform = transform;
      this.style.opacity = opacity;
    });
  }

  show() {
    this.shown = true;
  }

  hide() {
    this.shown = false;
  }

  _onClick() {
    event.stopPropagation();
  }

  attributeChangedCallback(name, oldValue, newValue) {
    console.log(name, oldValue);
  }
}
customElements.define(ReefDrawer.is, ReefDrawer);
