'use strict';

/**
 * @extends BaseController
 */
export default Backed(class AppController extends HTMLElement {
  /**
   * @param {String} href
   * @param {Boolean} _async_
   * @return {Promise}
   */
  lazyImport(href, _async_) {
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

	importScript(src) {
		return new Promise((resolve, reject) => {
			const script = document.createElement('script');
	    script.src = src;
	    script.setAttribute('async', '');
	    script.onload = () => {
				resolve();
	    };
			script.onerror = error => {
				return reject(error);
			};
	    this.appendChild(script);
		});
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
});
