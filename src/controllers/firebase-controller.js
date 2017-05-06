import Backed from './../../node_modules/backed/dist/backed-es.js';
import BaseController from './base-controller';
// import PubSub from './../internals/pubsub.js';
// window.pubsub = window.pubsub || new PubSub();

/**
 * @extends BaseController
 */
export default Backed(class FirebaseController extends BaseController {
  static get properties() {
		return {
			firebaseReady: {
				value: false,
				global: true,
				observer: '_onFirebaseReady',
				strict: false
			}
		};
	}

  /**
   * Set's up firebase
   */
  connected() {
    const script = document.createElement('script');
    script.src = 'bower_components/firebase/firebase.js';
    script.setAttribute('async', '');
    script.onload = () => {
      // Initialize Firebase onload
      firebase.initializeApp(this.config);
			this.firebaseReady = true;
      document.dispatchEvent(new CustomEvent('firebase-ready'));
    };
    this.appendChild(script);
  }

  /**
   * @return {Object}
   */
  get config() {
    return {
      apiKey: 'AIzaSyCxBWJTjZ822a_0bxGbTJV3F1dZoQVFo1w',
      authDomain: 'reeflight-fb71e.firebaseapp.com',
      databaseURL: 'https://reeflight-fb71e.firebaseio.com',
      storageBucket: 'reeflight-fb71e.appspot.com',
      messagingSenderId: '117361697825'
    };
  }
}
);
