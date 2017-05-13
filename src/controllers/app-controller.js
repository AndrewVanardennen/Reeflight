'use strict';
import BaseController from './base-controller';

/**
 * @extends BaseController
 */
export default Backed(class AppController extends BaseController {

		ready() {
	    // TODO: create CustomHTMLElement
	    // when name given, try to find template
	    this.root = this.attachShadow({mode: 'open'});
		}

	  /**
	   * @param {String} name
	   * @return {Promise}
	   */
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

	  /**
	   * @param {String} href
	   * @param {Boolean} _async_
	   * @return {Promise}
	   */
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
	});
