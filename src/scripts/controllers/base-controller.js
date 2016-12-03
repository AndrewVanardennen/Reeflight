'use strict';
import PubSub from './../internals/pubsub';
import './../internals/request-idle-callback-shim';

/**
 * @extends HTMLElement
 */
export default class BaseController extends HTMLElement {
  /**
   * Calls super
   */
  constructor() {
    super();
  }

  /**
   * Set's up pubsub
   */
  connectedCallback() {
    this.pubsub = new PubSub();
  }

  /**
   * logs given error
   * @param {Object} error
   */
  error(error=Object) {
    let errorCode = error.code;
    let errorMessage = error.message;
    console.log(`error-${errorCode}::${errorMessage}`);
  }
}
