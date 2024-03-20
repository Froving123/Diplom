import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDO_-hjElfDwtU1ESVRSFt8hZJ7IIMwlno",
  authDomain: "best-rest-99119.firebaseapp.com",
  projectId: "best-rest-99119",
  storageBucket: "best-rest-99119.appspot.com",
  messagingSenderId: "90112321750",
  appId: "1:90112321750:web:2be2a6ea307df81f7b8177"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
const db = getFirestore(app);
