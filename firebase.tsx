import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDg-pqUeQDsu_Qpffpdp9Bw_gCYD2c77Ug",
  authDomain: "survey-app-38a3a.firebaseapp.com",
  projectId: "survey-app-38a3a",
  storageBucket: "survey-app-38a3a.appspot.com",
  messagingSenderId: "1021703810477",
  appId: "1:1021703810477:web:db92b884208e2a7fc24524",
  measurementId: "G-M9DLW715RF"
};

let app;
if (!firebase.apps.length) {
  app = firebase.initializeApp(firebaseConfig);
} else {
  app = firebase.app();
}

const auth = firebase.auth();

export { auth, firebase };
