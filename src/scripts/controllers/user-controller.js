import FirebaseController from './firebase-controller';

export default class UserController extends FirebaseController {
  static get is() { return 'user-controller' }
  constructor() {
    super();
    this.style.display = 'none';
    // bind methods
    this._onFirebaseReady = this._onFirebaseReady.bind(this);
    this._onAuthStateChanged = this._onAuthStateChanged.bind(this);
  }

  set _user(user) {
    if (user && user.isAnonymous) {
    }
  }

  get user() {
    return JSON.parse(localStorage.getItem(`firebase:authUser:${this.config.apiKey}:[DEFAULT]`)) || null;
  }

  connectedCallback() {
    super.connectedCallback();
    document.addEventListener('firebase-ready', this._onFirebaseReady);
  }

  /**
   * @arg {string} provider default's to anonymous, options: 'anonymous', 'google'
   */
  login() {
    if (this.user === null) {
      firebase.auth().signInAnonymously().catch(error => {
        if (error) {
          let user = firebase.auth().currentUser;
          user.reauthenticate(user.refreshToken);
        }
      });
    }
  }

  _onAuthStateChanged(user) {
    console.log(user);
    if (user === null) {
      // login when the user is logged out
      this.login();
    } else if(user !== null && this.user !== null) {
      firebase.database().ref( 'users/' + user.uid).once('value', snap => {
        let data = snap.val();
        if (data) {
          return document.dispatchEvent(new CustomEvent('user-login', {detail: data}));
        } else if(data === null) {
          var isAnonymous = user.isAnonymous;
          var uid = user.uid;

          if (isAnonymous || isAnonymous && user.email === null) {
            let newPassword = Math.random().toString(36).slice(-8);
            let newName = Math.random().toString(36).slice(-8);
            let newEmail = `${newName}@reeflight.be`;

            user.updatePassword(newPassword).then(() => {
              console.log(newPassword);
              // Update successful.
            }, (error) => {
              this.error(error);
            });

            user.updateEmail(newEmail).then(() => {
              console.log(newEmail);
              // Update successful.
            }, (error) => {
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

  randomAvatar() {
    let num = Math.floor((Math.random() * 10) + 1); // Get a number between 1 & 10
    return `sources/avatars/avatar-${num}.png`;
  }

  writeUserData(uid, name, email, imageUrl) {
    if (name !== null && email !== null && imageUrl !== null) {
      firebase.database().ref('users/' + uid).set({
        username: name,
        email: email,
        profile_picture : imageUrl
      });
    }

    // localStorage.setItem('hitchon-user-uid', userId);
  }
  _onFirebaseReady () {
    firebase.auth().onAuthStateChanged(this._onAuthStateChanged);
    document.removeEventListener('firebase-ready', this._onFirebaseReady);
  }
}
customElements.define(UserController.is, UserController);
