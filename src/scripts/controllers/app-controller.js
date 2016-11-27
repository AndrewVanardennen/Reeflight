'use strict';
import UserController from './user-controller';
import BaseController from './base-controller';

export default class AppController extends BaseController {
  constructor(name) {
    super();
    // TODO: create CustomHTMLElement
    // when name given, try to find template
    if (name) {
      this._root = this.attachShadow({mode:'open'});
      this._tryFindTemplate(name).then(tmpl => {
        this._root.appendChild(tmpl.content.cloneNode(true));
      });
    }
    new UserController();
  }

  _tryFindTemplate(name) {
    return new Promise((resolve, reject) => {
      try {
        const currentScript = document.currentScript;
        const doc = currentScript ? currentScript.ownerDocument : document;
        const tmpl = doc.querySelector(`#${name}`);
        resolve(tmpl);
      } catch (error) {
        reject(error);
      }
    });
  }

  _lazyImport(href, _async_) {
    return new Promise((resolve, reject) => {
      let link = document.createElement('link');
      link.rel = 'import';
      link.href = href;
      if (_async_) {
        link.setAttribute('async', '');
      }
      link.onload = result => {
        resolve(result);
      };
      this.appendChild(link);
    });
  }
}
