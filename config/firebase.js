import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyApWFvE6aWIvIDIpAu2c0hR_zFHr_7tggo",
  authDomain: "highlevel-hiring-challenge.firebaseapp.com",
  projectId: "highlevel-hiring-challenge",
  storageBucket: "highlevel-hiring-challenge.appspot.com",
  messagingSenderId: "136037840808",
  appId: "1:136037840808:web:521b359e5931921cf94f9d",
};

const app = initializeApp(firebaseConfig);

const db = getFirestore(app);

export default db;
