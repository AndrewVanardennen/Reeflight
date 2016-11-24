'use strict';
import PubSub from './../internals/pubsub';

export default class BaseController extends HTMLElement {
  constructor() {
    super();
    this.pubsub = new PubSub();
  }

  dispatchEvent(type=String, detail=Object, target=document) {
    target.dispatchEvent(new CustomEvent(type, {detail: detail || null}));
  }

  error(error=Object) {
    var errorCode = error.code;
    var errorMessage = error.message;
    console.log(`error-${errorCode}::${errorMessage}`);
  }
}
