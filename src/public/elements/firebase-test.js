(function(){
  // Initialize Firebase
  var config = {
    apiKey: "AIzaSyCxBWJTjZ822a_0bxGbTJV3F1dZoQVFo1w",
    authDomain: "reeflight-fb71e.firebaseapp.com",
    databaseURL: "https://reeflight-fb71e.firebaseio.com",
    storageBucket: "reeflight-fb71e.appspot.com",
    messagingSenderId: "117361697825"
  };
  firebase.initializeApp(config);

  //Get elements
  const preObject = document.getElementById('object'); //object out of dom
  const ulList = document.getElementById('list'); //list out of dom
  //Get elements login
  const txtEmail = document.getElementById('txtEmail');
  const txtPassword = document.getElementById('txtPassword');
  const btnLogin = document.getElementById('btnLogin');
  const btnSignUp = document.getElementById('btnSignUp');
  const btnLogout = document.getElementById('btnLogout');

  //add login event
  btnLogin.addEventListener('click', e => {
    //get email and pass
    const email = txtEmail.value;
    const pass = txtPassword.value;
    const auth = firebase.auth();
    //Sign in
    const promise = auth.signInWithEmailAndPassword(email, pass);
    promise.catch(e => console.log(e.message));
  });

  // Add signup event
  btnSignUp.addEventListener('click', e => {
  // create email and pass
  // Check for real emails
  const email = txtEmail.value;
  const pass = txtPassword.value;
  const auth = firebase.auth();
  //Sign in
  const promise = auth.createUserWithEmailAndPassword(email, pass);
  promise.catch(e => console.log(e.message));
  });

  // Add a realtime listener
  firebase.auth().onAuthStateChanged(firebaseUser => {
    if(firebaseUser) {
      console.log(firebaseUser);
      btnLogout.classList.remove('hide');
    } else {
      console.log('not logged in');
      btnLogout.classList.add('hide');
    }
  });

  // btnLogout
  btnLogout.addEventListener('click', e => {
    firebase.auth().signOut();
  });

  //create references
  const dbRefObject = firebase.database().ref().child('object');
  const dbRefList = dbRefObject.child('purpose');

  // sync object changes
  //dbRefobject.on('value', snap => console.log(snap.val()));
  dbRefObject.on('value', snap => {
    preObject.innerText =JSON.stringify(snap.val(), null, 3);
  });

  //sync list changes
  dbRefList.on('child_added', snap => console.log(snap.val()));

  dbRefList.on('child_added', snap => {
    const li = document.createElement('li');
    li.innerText = snap.val();
    ulList.appendChild(li);
  });

  dbRefList.on('child_changed', snap => {
    const liChanged = document.getElementById(snap.key);
    lichanged.innerText = snap.val();
  });

  dbRefList.on('child_removed', snap => {
    const liToRemove = document.getElementById(snap.key);
    liToRemove.remove();
  })




}());
