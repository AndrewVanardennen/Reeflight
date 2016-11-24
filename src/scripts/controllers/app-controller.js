'use strict';
import UserController from './user-controller';
import BaseController from './base-controller';

export default class AppController extends BaseController {
  constructor(name) {
    super();
    // TODO: create CustomHTMLElement
    // when name given, try to find template
    if (name) {
      this._tryFindTemplate(name).then(tmpl => {
        this._root = this.attachShadow({mode:'open'});
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
}
