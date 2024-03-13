import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyCXWlsOmtZi_TJeH9bulTuM8taBR3dso0Y",
  authDomain: "best-rest-c94d9.firebaseapp.com",
  projectId: "best-rest-c94d9",
  storageBucket: "best-rest-c94d9.appspot.com",
  messagingSenderId: "764986136524",
  appId: "1:764986136524:web:8f4a49a241fcb5e699ef69"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
