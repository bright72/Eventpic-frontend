import * as firebase from 'firebase/firebase';
import 'firebase/storage';
import 'firebase/auth';
import config from './config'

if (!firebase.apps.length) {
  firebase.initializeApp(config)
}

export default firebase