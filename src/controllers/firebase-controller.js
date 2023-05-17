import AppController from './app-controller';

/**
 * @extends BaseController
 */
export default Backed(class FirebaseController extends AppController {
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
  ready() {
		try {
			const noFirebase = firebase ? false : true;
		} catch (e) {
			// TODO: log
			return this.importScript('/bower_components/firebase/firebase.js').then(() => {
				// Initialize Firebase onload
				firebase.initializeApp(this.config);
				this.firebaseReady = true;
				document.dispatchEvent(new CustomEvent('firebase-ready'));
			});
		}
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
