import FirebaseController from './firebase-controller';

export default class UserController extends FirebaseController {
  static get is() { return 'user-controller' }
  constructor() {
    super();
    // bind methods
    this._onAuthStateChanged = this._onAuthStateChanged.bind(this);
    this.style.display = 'none';
  }

  set _user(user) {
    if (user && user.isAnonymous) {
    }
  }

  get _user() {
    if (firebase && firebase.apps.length > 0) {
      return firebase.auth().currentUser;
    }
    return null;
  }

  get user() {
    return this._user || JSON.parse(localStorage.getItem(`firebase:authUser:${this.config.apiKey}:[DEFAULT]`));
  }

  connectedCallback() {
    super.connectedCallback();
    this._checkUserStatus();
  }

  _checkUserStatus() {
    try {
      firebase.auth().onAuthStateChanged(this._onAuthStateChanged);
    } catch (e) {
      setTimeout(() => {
        this._checkUserStatus();
      }, 250);
    }
  }

  /**
   * @arg {string} provider default's to anonymous, options: 'anonymous', 'google'
   */
  login() {
    if (this.user === null) {
      firebase.auth().signInAnonymously().catch(error => {
        this.errorHandler(error);
      });
    }
  }

  _onAuthStateChanged(user) {
    if (user !== null) {
      // User is signed in.
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
      } else {
        firebase.database().ref('users/' + uid).once('value', (snapshot) => {
          if (!new Boolean(snapshot.val())) {
            this.writeUserData(uid, user.displayName, user.email, user.photoURL);
          }
        })

      }
      return this.dispatchEvent('user-login', uid);
    }
    // login when the user is logged out
    return this.login();
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
}
customElements.define(UserController.is, UserController);
