import FirebaseController from './firebase-controller';
import UserConnectionController from './user-connection-controller.js';
/**
 * @extends FirebaseController
 */
export default Backed(class UserController extends FirebaseController {
  static get properties() {
		return {
			user: {
        value: null,
				global: true
			},
			firebaseReady: {
				observer: '_onFirebaseReady',
				global: true,
				value: false
			},
			userOnline: {
				value: false,
				observer: '__onUserOnline__',
				global: true
			}
		};
	}

	created() {
    this.style.display = 'none';
	}

  /**
   * Calls super.connectedCallback & add's eventListeners
   */
  connected() {
    super.connected();
		this.shadowRoot.appendChild(new UserConnectionController());
  }

  /**
   * @param {string} provider default's to anonymous,
   * **options**: 'anonymous', 'google'
   */
	// mq1qyqfr
  login() {
		const provider = new firebase.auth.GoogleAuthProvider();
		provider.addScope('profile');
		provider.addScope('email');
		firebase.auth().signInWithPopup(provider).then(result => {
		 // This gives you a Google Access Token.
		 let token = result.credential.accessToken;
		 // The signed-in user info.
		 this.user = result.user;
		});
    // if (this.user === null) {
    //   firebase.auth().signInAnonymously().catch(error => {
    //     if (error) {
    //       let user = firebase.auth().currentUser;
    //       user.reauthenticate(user.refreshToken);
    //     }
    //   });
    // } else {
    // }
  }

  /**
   * Runs whenever the user's auth state changes
   * @param {Object} user
   */
  _onAuthStateChanged(user) {
		if (user === null || user === undefined) {
			this.login();
		}
    firebase.database().ref( 'users/' + user.uid).once('value', snap => {
      let data = snap.val();
      if (data) {
				this.user = data;
				this.userOnline = true;
				// pubsub.publish('user.online', true);
        return document.dispatchEvent(
          new CustomEvent('user-login', {detail: data}
        ));
      } else if(data === null) {
        this.writeUserData(
					user.uid,	user.displayName, user.email, user.photoURL
				);
      }
    });
  }

  /**
   * @param {String} uid
   * @param {String} name
   * @param {String} email
   * @param {String} imageUrl
   */
  writeUserData(uid, name, email, imageUrl) {
    if (name !== null && email !== null && imageUrl !== null) {
      firebase.database().ref('users/' + uid).set({
        username: name,
        email: email,
        profile_picture: imageUrl
      });
    }
    // localStorage.setItem('hitchon-user-uid', userId);
  }

  /**
   * Removes the firebase-ready eventListener
   */
  _onFirebaseReady(change, oldValue) {
		if (!change.value || change.value === oldValue) {
			return;
		}
    firebase.auth().onAuthStateChanged(this._onAuthStateChanged.bind(this));
  }
});
