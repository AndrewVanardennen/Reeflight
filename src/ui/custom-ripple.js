'use strict';

export default Backed(class CustomRipple extends HTMLElement {
	created() {
		this.root = this.attachShadow({mode: 'open'});
		// @template
	}

	/**
   * Runs the ripple
   */
  run() {
    this.classList.add('run');
    setTimeout(() => {
      this.classList.remove('run');
    }, 320);
  }
});
