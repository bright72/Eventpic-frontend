// import * as firebase from 'firebase';
// import 'firebase/auth';
// import 'firebase/app';

// // Initialize Firebase
// var config = {

//     apiKey: "AIzaSyC2nZWMUc158M6XTvqjuhOaEuyvWYJnHtM",
//     authDomain: "test-file-store-d0505.firebaseapp.com",
//     databaseURL: "https://test-file-store-d0505.firebaseio.com",
//     projectId: "test-file-store-d0505",
//     storageBucket: "test-file-store-d0505.appspot.com",
//     messagingSenderId: "44569118630",
//     appId: "1:44569118630:web:8688c0f60d802eaf3fb167",
//     measurementId: "G-X1FJRZFNRB"
// };

// firebase.initializeApp(config);

// export default firebase.auth()

import * as firebase from 'firebase';
import 'firebase/storage';
import 'firebase/auth';
import 'firebase/app';
import config from './config'

// Initialize Firebase
// var config = {

//     apiKey: "AIzaSyC2nZWMUc158M6XTvqjuhOaEuyvWYJnHtM",
//     authDomain: "test-file-store-d0505.firebaseapp.com",
//     databaseURL: "https://test-file-store-d0505.firebaseio.com",
//     projectId: "test-file-store-d0505",
//     storageBucket: "test-file-store-d0505.appspot.com",
//     messagingSenderId: "44569118630",
//     appId: "1:44569118630:web:8688c0f60d802eaf3fb167",
//     measurementId: "G-X1FJRZFNRB"
// };
// Initialize Firebase
if (!firebase.apps.length) {
    firebase.initializeApp(config)
  }

// const storage = firebase.storage()
// const auth = firebase.auth()

export default firebase