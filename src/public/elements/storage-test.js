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

  // Get elements
  var uploader = document.getElementById('uploader');
  var fileButton = document.getElementById('fileButton');

  // Listen for file selection
  fileButton.addEventListener('change', function(e) {
    // Get file
    var file = e.target.files[0];
    // Create a storage ref
    var storageRef =  firebase.storage().ref('sweet_gifs/' + file.name);

    // Upload file
    storageRef.put(file);

    // Update progress background-color
    task.on('state_changed',
      function progress(snapshot) {
        var percentage = 100 * (snapshot.bytesTransferred/snapshot.totalBytes);
        uploader.value = percentage;
      },
      function error(err) {

      },
      function complete() {

      }


    );

  });


}());
