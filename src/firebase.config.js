import firebase from "firebase";

var firebaseConfig = {
  apiKey: "AIzaSyB87eLvjHNZeBQsW7_e8xmDVdBMC39-YpA",
  authDomain: "plantscanner-44527.firebaseapp.com",
  projectId: "plantscanner-44527",
  storageBucket: "plantscanner-44527.appspot.com",
  messagingSenderId: "557781975739",
  appId: "1:557781975739:web:f98c3c445a3c8b8bd41f9e",
  measurementId: "G-2JTLKBTS3K",
};

var firebaseApp;

if (!firebase.apps.length) {
  firebaseApp = firebase.initializeApp(firebaseConfig);
} else {
  firebaseApp = firebase.app();
}
const db = firebaseApp.firestore();

export default db;
