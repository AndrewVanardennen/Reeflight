import FirebaseController from './firebase-controller';
import UserConnectionController from './user-connection-controller.js';
// import PubSub from './../internals/pubsub.js';
// window.pubsub = window.pubsub || new PubSub();
/**
 * @extends FirebaseController
 */
export default Backed(class UserController extends FirebaseController {
  static get properties() {
		return {
			user: {
				global: true
			},
			firebaseReady: {
				observer: '_onFirebaseReady',
				global: true,
				value: false
			}
		};
	}

	created() {
    this.style.display = 'none';
    // bind methods
    this._onAuthStateChanged = this._onAuthStateChanged.bind(this);
		new UserConnectionController();
	}

  /**
   * Calls super.connectedCallback & add's eventListeners
   */
  connected() {
    super.connected();
  }

  /**
   * @param {string} provider default's to anonymous,
   * **options**: 'anonymous', 'google'
   */
  login() {
    if (this.user === null) {
      firebase.auth().signInAnonymously().catch(error => {
        if (error) {
          let user = firebase.auth().currentUser;
          user.reauthenticate(user.refreshToken);
        }
      });
    } else {
    }
  }

  /**
   * Runs whenever the user's auth state changes
   * @param {Object} user
   */
  _onAuthStateChanged(user) {
		console.log(user);
    if (user === null) {
      // login when the user is logged out
			// TODO: decide if we login the user atomatically or not
			this.userOnline = false;
      this.login();
    } else if(user !== null) {
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
          let isAnonymous = user.isAnonymous;
          let uid = user.uid;

          if (isAnonymous || isAnonymous && user.email === null) {
            let newPassword = Math.random().toString(36).slice(-8);
            let newName = Math.random().toString(36).slice(-8);
            let newEmail = `${newName}@reeflight.be`;

            user.updatePassword(newPassword).then(() => {
              // console.log(newPassword);
              // Update successful.
            }, error => {
              this.error(error);
            });

            user.updateEmail(newEmail).then(() => {
              // console.log(newEmail);
              // Update successful.
            }, error => {
              this.error(error);
            });

            this.writeUserData(uid, newName, newEmail, this.randomAvatar());
          }
        }
      });
      // User is signed in.
    }
    return;
  }

  /**
   * @return {String}
   */
  randomAvatar() {
    // Get a number between 1 & 10
    let num = Math.floor((Math.random() * 10) + 1);
    return `sources/avatars/avatar-${num}.png`;
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
    firebase.auth().onAuthStateChanged(this._onAuthStateChanged);
  }
});
