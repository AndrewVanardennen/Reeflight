'use strict';
import PubSub from './../internals/pubsub';
import './../internals/request-idle-callback-shim';

export default class BaseController extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    this.pubsub = new PubSub();
  }

  error(error=Object) {
    var errorCode = error.code;
    var errorMessage = error.message;
    console.log(`error-${errorCode}::${errorMessage}`);
  }
}
