import {initializeApp, getApps} from 'firebase/app';
import{getDatabase} from 'firebase/database';
import {getAuth} from 'firebase/auth';
import {getFirestore} from 'firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyBxRBsjWSguRPNnm5ldJfLFymM8GQovk3U",
    authDomain: "lab5-firebase-82ad1.firebaseapp.com",
    projectId: "lab5-firebase-82ad1",
    storageBucket: "lab5-firebase-82ad1.appspot.com",
    messagingSenderId: "264832428591",
    appId: "1:264832428591:web:1b72346ce9a29a7a9a74da",
    measurementId: "G-2F00WC5FK8"
  };

  //const app = initializeApp(firebaseConfig);

  var app;

  if (!getApps().length){
    app = initializeApp(firebaseConfig);
  }
  else{
    const APPS = getApps();
    app = APPS[0];
  }

export const db = getDatabase(app);
export const auth = getAuth(app);
export const store = getFirestore(app);