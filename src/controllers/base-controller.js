'use strict';
import Backed from './../../node_modules/backed/dist/backed-es.js';
import './../internals/request-idle-callback-shim';

/**
 * @extends HTMLElement
 */
export default Backed(class BaseController extends HTMLElement {
  /**
   * logs given error
   * @param {Object} error
   */
  error(error=Object) {
    let errorCode = error.code;
    let errorMessage = error.message;
    console.log(`error-${errorCode}::${errorMessage}`);
  }
});
