'use strict';
import UserController from './user-controller';
import PubSub from './../internals/pubsub';

export default class AppController extends HTMLElement {
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
    this.pubsub = new PubSub();
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
